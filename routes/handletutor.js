/*******************************************************************************************
Filename    :handletutor.js
Summary     :handle tuptor operation
Version     :1.0
Created     :2015-02-07
Author      :Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/


//
// packages required
//

var mgdb = require('../model/mgdb');
var cmutils = require('../model/commonutils');
var comutil = require('../model/commonutils');
var exportlogs = require('../model/exportlogs');

//////////////////////////////////////////////////////////////////
//function: find and show students belong to self
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.ViewStudents = function(req, res){
	console.log('user:' + req.session.user);

	mgdb.FindAllbyOption(mgdb.ModelSysRecord, {'tutorNumber':req.session.user}, function(err, docs){
		if(err)
		{
			res.render('tutor_query_member_result', 
				{
					act: comutil.sidebaract.tutor.viewstudents,
					members:null,
					msg: comutil.msg.msg_error_abnormal, 
					title: comutil.msg.title_error, 
					smalltitle: comutil.msg.stitle_error,
					breadtext: comutil.bread.tutor_viewstudents_text,
					breadhref: comutil.bread.tutor_viewstudents_href
				});
		}
		else
		{
			if(docs)
			{
				res.render('tutor_query_member_result', 
					{
						act: comutil.sidebaract.tutor.viewstudents, 
						members:docs,
						msg: comutil.msg.msg_tutorviewstudents,
						title: comutil.msg.title_tutorviewstudents, 
						smalltitle: ' ' + req.session.user + '， ' + comutil.msg.stitle_tutorviewstudents,
						breadtext: comutil.bread.tutor_viewstudents_text,
						breadhref: comutil.bread.tutor_viewstudents_href
					});
			}
			else
			{
				res.render('tutor_query_member_result', 
					{
						act: comutil.sidebaract.tutor.viewstudents,
						members:docs,
						msg: comutil.msg.msg_error_tutorviewstudents, 
						title: comutil.msg.title_tutorviewstudents, 
						smalltitle:  ' ' + req.session.user + '， ' + comutil.msg.stitle_tutorviewstudents,
						breadtext: comutil.bread.tutor_viewstudents_text,
						breadhref: comutil.bread.tutor_viewstudents_href
					});
			}
		}

	});
};

//////////////////////////////////////////////////////////////////
//function: find and show students modification page
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.ModifyStudentById = function(req, res){

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('modify id= ' + idStr);
	
	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('not found!');
			res.render('tutor_redirect_delay', 
				{
					act: comutil.sidebaract.tutor.viewstudents,
					msg: comutil.msg.msg_error_abnormal, 
					title: comutil.msg.title_error, 
					smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_error,
					newpage:'/tutor_viewstudents',
					timeout:comutil.redirect_timeout
				});
		}
		else
		{
			res.render('tutor_modify_student',
				  	{
				  		act: comutil.sidebaract.tutor.viewstudents,
				  		stu:docs, 
						msg: comutil.msg.msg_modifystudents, 
						title: comutil.msg.title_modifystudents, 
						smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_modifystudents,
						id:idStr
				  	});
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: handle post of modification of students information
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.DoModifyStudentById = function(req, res) {

	console.log('id=' + req.body.modifyid + 
		        ' stuname= ' + req.body.stuname + 
		        ' stunumber= ' + req.body.stunumber + 
		        ' stucellphone= ' + req.body.stucellphone + 
		        ' prjname=' + req.body.prjname +
		        // ' prjstartdate=' + req.body.prjstartdate +
		        // ' prjstopdate=' + req.body.prjstopdate +
		        ' tutorname=' + req.body.tutorname +
		        ' tutornumber=' + req.body.tutornumber +
		        ' tutorcellphone=' + req.body.tutorcellphone 
		        );

	//check input?
	//...

	mgdb.DoModifyById(
		mgdb.ModelSysRecord, 
		req.body.modifyid, 
		{
			stuName:req.body.stuname.trim(), 
			stuNumber:req.body.stunumber.trim(),
			stuPhone:req.body.stucellphone.trim(), 
			prjName:req.body.prjname.trim(),
			// prjStartDate:req.body.prjstartdate,
			// prjStopDate:req.body.prjstopdate,
			tutorNumber:req.body.tutornumber.trim(),
			tutorName:req.body.tutorname.trim(),
			tutorPhone:req.body.tutorcellphone.trim()
	    },
		function(err, stu){
			if(err)
			{
			  console.log('err=' + err.message);
			  res.render('tutor_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.tutor.viewstudents,
					msg: comutil.msg.msg_error_abnormal, 
					title: comutil.msg.title_error, 
					smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_error,
					newpage:'/tutor_viewstudents',
					timeout:comutil.redirect_timeout
			  	});
			}
			else
			{
			  res.render('tutor_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.tutor.viewstudents,
					msg: comutil.msg.msg_ok_modifystudents, 
					title: comutil.msg.title_ok, 
					smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_ok,
					newpage:'/tutor_viewstudents',
					timeout:comutil.redirect_timeout
			  	});
			}
		}
	);
};

exports.ModifySelfInfo = function(req, res) {
	TutorModifySelf(req, res, comutil.modifytype.info);
};

exports.ModifySelfPass = function(req, res) {
	TutorModifySelf(req, res, comutil.modifytype.password);
};

//////////////////////////////////////////////////////////////////
//function: tutor show page of modify self information or self password
//parameters:  
//    @req
//    @res
//    @modify_flag: 'info' or 'password'
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
var TutorModifySelf = function(req, res, modify_flag) {

	var tutorNumber = req.session.user;
	console.log('TutorModifySelf tutorNumber=' + tutorNumber);

	var renderPage = 'tutor_modify_selfpass';;
	var actFlag = comutil.sidebaract.tutor.modifyselfpass;
	var msg = comutil.msg.msg_modifytutorselfinfo;
	var title = comutil.msg.title_modifytutorselfinfo;
	var stitle = comutil.msg.stitle_modifytutorselfinfo;
	var breadtext;
	var breadhref;
	if(modify_flag==comutil.modifytype.password)
	{
		renderPage = 'tutor_modify_selfpass';
		actFlag = comutil.sidebaract.tutor.modifyselfpass;
		msg = comutil.msg.msg_modifytutorselfpass;
		title = comutil.msg.title_modifytutorselfpass;
		stitle = comutil.msg.stitle_modifytutorselfpass;
		breadtext = comutil.bread.tutor_modifyselfpass_text;
		breadhref = comutil.bread.tutor_modifyselfpass_href;
	}
	else
	{
		renderPage = 'tutor_modify_selfinfo';
		actFlag = comutil.sidebaract.tutor.modifyselfinfo;
		msg = comutil.msg.msg_modifytutorselfinfo;
		title = comutil.msg.title_modifytutorselfinfo;
		stitle = comutil.msg.stitle_modifytutorselfinfo;
		breadtext = comutil.bread.tutor_modifyselfinfo_text;
		breadhref = comutil.bread.tutor_modifyselfinfo_href;
	}

	mgdb.ModelSysRecord.findOne(
		{'tutorNumber':tutorNumber}, 
		function(err, docs){
			if(err)
			{
			  console.log('ModifySelfInfo tutorNumber not found!');
			  res.render('tutor_redirect_delay', 
			  	{
			  		act: actFlag,
					msg: comutil.msg.msg_error_abnormal, 
					title: comutil.msg.title_error, 
					smalltitle:  ' ' + req.session.user + '，  ',
					breadtext: breadtext,
					breadhref: breadhref,
					newpage:'/tutor_viewstudents',
					timeout:comutil.redirect_timeout
			  	});
			}
			else
			{
				

				if(docs)
				{
					res.render(renderPage,
						  	{
						  		act: actFlag,
						  		tutor:docs, 
								msg: msg, 
								title: title, 
								smalltitle:  ' ' + req.session.user + '，  ' + stitle,
								breadtext: breadtext,
					                                                breadhref: breadhref
						  	});
				}
				else
				{
					res.render('tutor_redirect_delay', 
						  	{
						  		act: actFlag,
								msg: comutil.msg.msg_error_notfound, 
								title: comutil.msg.title_error, 
								smalltitle:  ' ' + req.session.user + '，  ' + comutil.msg.stitle_error,
								breadtext: breadtext,
					                                                breadhref: breadhref,
								newpage: '/tutor_viewstudents', 
						  		timeout: comutil.redirect_timeout
						  	}
					  	);
				}
			}
	});
};

exports.DoModifySelfInfo = function(req, res) {
	TutorDoModifySelf(req, res, 'info');
};

exports.DoModifySelfPass = function(req, res) {
	TutorDoModifySelf(req, res, 'password');
};

//////////////////////////////////////////////////////////////////
//function: tutor do modification of self information or self password
//parameters:  
//    @req
//    @res
//    @modify_flag: 'info' or 'password'
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
var TutorDoModifySelf = function(req, res, modify_flag) {
	var actFlag;
	var breadtext;
	var breadhref;
	if(modify_flag==comutil.modifytype.info)
	{
		actFlag = comutil.sidebaract.tutor.modifyselfinfo;
		breadtext = comutil.bread.tutor_modifyselfinfo_text;
		breadhref = comutil.bread.tutor_modifyselfinfo_href;
		console.log('req.session.user=' + req.session.user + 
		        ' tutorname= ' + req.body.tutorname + 
		        ' tutornumber= ' + req.body.tutornumber + 
		        ' tutorcellphone= ' + req.body.tutorcellphone 
		        );
	}
	else if(modify_flag==comutil.modifytype.password)
	{
		actFlag = comutil.sidebaract.tutor.modifyselfpassword;
		breadtext = comutil.bread.tutor_modifyselfpass_text;
		breadhref = comutil.bread.tutor_modifyselfpass_href;
		console.log('req.session.user=' + req.session.user + 
		        ' new password= ' + req.body.password
		        );
	}
	else
	{
		console.log('error modify_flag: ' + modify_flag);
		return;
	}	

	mgdb.FindAllbyOption(mgdb.ModelSysRecord, {'tutorNumber':req.session.user}, function(err, docs){
		if(err)
		{
			res.render('tutor_redirect_delay', 
			  	{
			  		act: actFlag,
					msg: comutil.msg.msg_error_abnormal, 
					title: comutil.msg.title_error, 
					smalltitle:  ' ' + req.session.user + ' ',
					breadtext: breadtext,
					breadhref: breadhref,
					newpage:'/tutor_viewstudents',
					timeout:comutil.redirect_timeout
			  	});
		}
		else
		{
			if(docs)
			{
				for(var i=0; i<docs.length; i++)
				{
					if(modify_flag=='info')
					{						
						docs[i].tutorNumber = req.body.tutornumber.trim();
						docs[i].tutorName = req.body.tutorname.trim();
						docs[i].tutorPhone = req.body.tutorcellphone.trim();
					}
					else if(modify_flag=='password')
					{
						var codedPass = comutil.CodedPassword(req.body.password);
						docs[i].tutorPassword = codedPass;
					}					
					
					docs[i].save(function(err) {
						if(err)
						{
							console.log('save err :' + i + err.message);

							res.render('tutor_redirect_delay', 
							  	{
							  		act: actFlag,
									msg: comutil.msg.msg_error_abnormal, 
									title: comutil.msg.title_error, 
									smalltitle:  ' ' + req.session.user + ' ',
									breadtext: breadtext,
					                breadhref: breadhref,
									newpage:'/tutor_viewstudents',
									timeout:comutil.redirect_timeout
							  	});
							return;
						}
						else
						{
							console.log('save ' + i + 'ok!');
						}	
					});
					//console.log('1111111111111111111111111');
				}
				//console.log('222222222222222');

				res.render('tutor_redirect_delay', 
				  	{
				  		act: actFlag,
						msg: comutil.msg.msg_ok_modify, 
						title: comutil.msg.title_ok, 
						smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_ok,
						breadtext: breadtext,
					    breadhref: breadhref,
						newpage:'/tutor_viewstudents', 
				  		timeout:comutil.redirect_timeout
				  	});			
			}
			else
			{
				res.render('tutor_redirect_delay', 
				  	{
				  		act: actFlag,
						msg: comutil.msg.msg_error_notfound, 
						title: comutil.msg.title_error, 
						smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_error,
						breadtext: breadtext,
					    breadhref: breadhref,
						newpage: '/tutor_viewstudents', 
				  		timeout: comutil.redirect_timeout
				  	});
			}
		}
	});
};

exports.AllowLogin = function(req, res) {
	DoAllowLogin(req, res, true);
};

exports.NotAllowLogin = function(req, res) {
	DoAllowLogin(req, res, false);
};

//////////////////////////////////////////////////////////////////
//function: tutor do modification of self information or self password
//parameters:  
//    @req
//    @res
//    @allow_login: boolean, true or false
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
var DoAllowLogin = function(req, res, allow_login) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('DoAllowLogin id= ' + idStr);

	mgdb.DoModifyById(
		mgdb.ModelSysRecord, 
		idStr, 
		{
		    stuLoginFlag:allow_login
	    },
		function(err, docs){
			if(err)
			{
			  console.log('err=' + err.message);
			  res.render('/tutor_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.tutor.viewstudents,
					msg: comutil.msg.msg_error_abnormal, 
					title: comutil.msg.title_error, 
					smalltitle:  ' ' + req.session.user + ' ',
					breadtext: comutil.bread.tutor_viewstudents_text,
					breadhref: comutil.bread.tutor_viewstudents_href,
					newpage:'/tutor_viewstudents',
					timeout:comutil.redirect_timeout
			  	});
			}
			else
			{
			  res.redirect('/tutor_viewstudents');
			}
		});
};

//////////////////////////////////////////////////////////////////
//function: tutor reset student password
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.ResetStuPassword = function(req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('ResetStuPassword id= ' + idStr);

	//get student cellphone
	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, doc){
		if(err)
		{
		  console.log('ResetStuPassword err=' + err.message);
		  res.render('tutor_redirect_delay', 
		  	{
		  		act: comutil.sidebaract.tutor.viewstudents,
				msg: comutil.msg.msg_error_abnormal, 
				title: comutil.msg.title_error, 
				smalltitle:  ' ' + req.session.user + ' ',
				breadtext: comutil.bread.tutor_viewstudents_text,
				breadhref: comutil.bread.tutor_viewstudents_href,
				newpage:'/tutor_viewstudents',
				timeout:comutil.redirect_timeout
		  	});
		}
		else
		{
			if(doc)
			{
				var codedPass = comutil.CodedPassword(doc.stuPhone);
				console.log('stuPhone=' + doc.stuPhone + '\tcodedPass=' + codedPass);
				doc.stuPassword = codedPass;
				doc.save(function(error){
					if(error)
					{
						res.render('tutor_redirect_delay', 
						  	{
						  		act: comutil.sidebaract.tutor.viewstudents,
								msg: comutil.msg.msg_error_abnormal, 
								title: comutil.msg.title_error, 
								smalltitle:  ' ' + req.session.user + ' ',
								breadtext: comutil.bread.tutor_viewstudents_text,
					                                                breadhref: comutil.bread.tutor_viewstudents_href,
								newpage:'/tutor_viewstudents',
								timeout:comutil.redirect_timeout
						  	});
					}
					else
					{
						res.render('tutor_redirect_delay', 
						  	{
						  		act: comutil.sidebaract.tutor.viewstudents,
								msg: comutil.msg.msg_ok_modifystudentspass, 
								title: comutil.msg.title_ok, 
								smalltitle:  ' ' + req.session.user + '，  ' + comutil.msg.stitle_ok,
								breadtext: comutil.bread.tutor_viewstudents_text,
					                                                breadhref: comutil.bread.tutor_viewstudents_href,
								newpage:'/tutor_viewstudents',
								timeout:comutil.redirect_timeout
						  	});
					}
				});
			}
			else
			{
				res.render('/tutor_redirect_delay', 
				  	{
				  		act: comutil.sidebaract.tutor.viewstudents,
						msg: comutil.msg.msg_error_notfound, 
						title: comutil.msg.title_error, 
						smalltitle:  ' ' + req.session.user + '，  ' + comutil.msg.stitle_error,
						breadtext: comutil.bread.tutor_viewstudents_text,
					                breadhref: comutil.bread.tutor_viewstudents_href,
						newpage: '/tutor_viewstudents', 
				  		timeout: comutil.redirect_timeout
				  	});
			}
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: tutor delete student 
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.DeleteStudentById = function(req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('DeleteStudentById id= ' + idStr);

	mgdb.DeleteById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
		  console.log('remove error!');
		  res.render('tutor_redirect_delay', 
		  	{
		  		act: comutil.sidebaract.tutor.viewstudents,
				msg: comutil.msg.msg_error_abnormal, 
				title: comutil.msg.title_error, 
				smalltitle:  ' ' + req.session.user + ' ',
				breadtext: comutil.bread.tutor_viewstudents_text,
			                breadhref: comutil.bread.tutor_viewstudents_href,
				newpage:'/tutor_viewstudents',
				timeout:comutil.redirect_timeout
		  	});
		}
		else
		{
		  res.redirect('/tutor_viewstudents');
		}		
	});
};

exports.ViewSysWorklog = function(req, res) {
	console.log('tutor ViewSysWorklog: tutorNumber=' + req.session.user);

	mgdb.GetPrjUniqueName(mgdb.ModelSysRecord, {prjExpired:false, tutorNumber:req.session.user}, function(prjs){

		console.log('prjNames=');
		console.log(prjs);

		res.render('tutor_query_worklog_general_result', 
      	{
      		act: comutil.sidebaract.tutor.viewworklog,
      		SysRecords: null,
      		mbtn: comutil.mbtn_id_tutordeletelog, 
      		title: comutil.msg.title_viewsysworklog, 
      		smalltitle: (' ' + req.session.user + '，  ' + comutil.msg.stitle_viewsysworklog), 
      		breadtext: comutil.bread.tutor_viewworklog_text,
	        breadhref: comutil.bread.tutor_viewworklog_href,
	        action: comutil.link.tutor_queryworklog,
	        IsShowStu: true,
	        IsShowPrj: true,
			IsShowTutor: false,
	        tutorNumber: req.session.user,
	        prjNames: prjs,
	        LinkDelete: comutil.link.tutor_queryresult_delete,
	        LinkDetail: comutil.link.tutor_queryresult_detail,
	        LinkExport: comutil.link.tutor_queryresult_export
      	});

	});
	
};

exports.ViewSysWorklogQueryResult = function(req, res) {
	var stuNumber = req.body.stuNumber.trim();
	var prjName = req.body.prjName.trim();
	var selectedYear = req.body.selectedYear.trim();

	console.log('stuNumber:' + stuNumber + '\tprjName:'+ prjName+ '\ttutorNumber:'+req.session.user);

	var optArrayYear = [];

	switch(selectedYear)
	{
		case '0':
		    optArrayYear.push({'workRecords.startTime':/^2015/});
		    optArrayYear.push({'workRecords.startTime':/^2016/});
		    optArrayYear.push({'workRecords.startTime':/^2017/});
		    optArrayYear.push({'workRecords.startTime':/^2018/});
		    optArrayYear.push({'workRecords.startTime':/^2019/});
		    optArrayYear.push({'workRecords.startTime':/^2020/});
		    optArrayYear.push({'workRecords.startTime':/^2021/});
		    optArrayYear.push({'workRecords.startTime':/^2022/});
		    break;
		case '2015':
		    optArrayYear.push({'workRecords.startTime':/^2015/});
		    break;
		case '2016':
		    optArrayYear.push({'workRecords.startTime':/^2016/});
		    break;
		case '2017':
		    optArrayYear.push({'workRecords.startTime':/^2017/});
		    break;
		case '2018':
		    optArrayYear.push({'workRecords.startTime':/^2018/});
		    break;
		case '2019':
		    optArrayYear.push({'workRecords.startTime':/^2019/});
		    break;
		case '2020':
		    optArrayYear.push({'workRecords.startTime':/^2020/});
		    break;
		case '2021':
		    optArrayYear.push({'workRecords.startTime':/^2021/});
		    break;
		case '2022':
		    optArrayYear.push({'workRecords.startTime':/^2022/});
		    break;
	}		

	var optArray = [];
	optArray.push({'tutorNumber': req.session.user});

	if(stuNumber!='')
		optArray.push({'stuNumber': stuNumber});
	if(prjName!='')
		optArray.push({'prjName': prjName});

	mgdb.FindAllbyOption(
		mgdb.ModelSysRecord, 
		{
			"$and":optArray,
			"$or":optArrayYear
		}, 
		function(err, docs){
			if(err)
			{
				res.render('tutor_redirect_delay', 
			      	{
			      		act: comutil.sidebaract.tutor.viewworklog,
						msg: comutil.msg.msg_error_abnormal, 
						title: comutil.msg.title_error, 
						smalltitle:  ' ' + req.session.user + '，  ' + comutil.msg.stitle_error_abnormal,
						breadtext: comutil.bread.tutor_viewworklog_text,
					                breadhref: comutil.bread.tutor_viewworklog_href,
						newpage:'/tutor_viewworklog',
						timeout:comutil.redirect_timeout
			      	});
			}
			else
			{
				mgdb.GetPrjUniqueName(mgdb.ModelSysRecord, {prjExpired:false, tutorNumber:req.session.user}, function(prjs){

					console.log('prjNames=');
					console.log(prjs);

					res.render('tutor_query_worklog_general_result', 
			      	{
			      		act: comutil.sidebaract.tutor.viewworklog,
			      		SysRecords: docs,
			      		mbtn: comutil.mbtn_id_tutordeletelog, 
			      		title: comutil.msg.title_viewsysworklog, 
			      		smalltitle: (' ' + req.session.user + '，  ' + comutil.msg.stitle_viewsysworklog), 
			      		breadtext: comutil.bread.tutor_viewworklog_text,
				        breadhref: comutil.bread.tutor_viewworklog_href,
				        action: comutil.link.tutor_queryworklog,
				        IsShowStu: true,
				        IsShowPrj: true,
				        IsShowTutor: false,
				        tutorNumber: req.session.user,
				        prjNames: prjs,
				        LinkDelete: comutil.link.tutor_queryresult_delete,
				        LinkDetail: comutil.link.tutor_queryresult_detail,
				        LinkExport: comutil.link.tutor_queryresult_export
			      	});

				});
				
			}
	});	

};

exports.ViewSysWorklogDetails = function(req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('tutor ViewSysWorklogDetails id= ' + idStr);

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('tutor_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.tutor.viewworklog,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.tutor_viewworklog_text,
                    breadhref: comutil.bread.tutor_viewworklog_href,
		      		newpage:'/tutor_viewworklog', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				res.render('tutor_query_worklog_detail_result',
				  	{
				  		act: comutil.sidebaract.tutor.viewworklog,
				  		worklogs: docs.workRecords,
				  		weixin_id: docs.stuWeixin_id, 
				  		stuname: docs.stuName,
				  		stunumber: docs.stuNumber,
				  		prjname: docs.prjName,
						msg: comutil.msg.msg_modifymember, 
				  		title: comutil.msg.title_viewsysworklog, 
				  		smalltitle: ' ' + req.session.user + '，  ' + comutil.msg.stitle_viewsysworklog,
				  		breadtext: comutil.bread.tutor_viewworklog_text,
                        breadhref: comutil.bread.tutor_viewworklog_href,
				  		id:idStr
				  	});
			}
		}
	});
};

exports.SyslogExport = function(req, res) {
	exportlogs.SysWorklogExport(req, res, comutil.userrole.tutor);
};

exports.ClearSysWorklog = function(req, res) {
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('ClearSysWorklog id= ' + idStr);

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('tutor_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.tutor.viewworklog,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.tutor_viewworklog_text,
                    breadhref: comutil.bread.tutor_viewworklog_href,
		      		newpage:'/tutor_viewworklog', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				docs.workRecords = [];
				docs.save(function(err){
					if(err)
					{
						console.log('ClearSysWorklog save err :' + err);

						res.render('tutor_redirect_delay', 
						  	{
						  		act: comutil.sidebaract.tutor.viewworklog,
								msg: comutil.msg.msg_error, 
						  		title: comutil.msg.title_error, 
						  		smalltitle: comutil.msg.stitle_error_abnormal, 
						  		breadtext: comutil.bread.tutor_viewworklog_text,
                                breadhref: comutil.bread.tutor_viewworklog_href,
						  		newpage: '/tutor_viewworklog', 
						  		timeout: comutil.redirect_timeout
						  	});
					}
					else
					{
						console.log('tutor ClearSysWorklog clear ok!');
						res.redirect('/tutor_viewworklog');
					}
				});
			}
			else
			{
				console.log('not found!');
				res.render('tutor_redirect_delay', 
			  	    {
			  	    	act: comutil.sidebaract.tutor.viewworklog,
						msg: comutil.msg.msg_error_notfound, 
				  		title: comutil.msg.title_error, 
				  		smalltitle: comutil.msg.stitle_error_abnormal, 
				  		breadtext: comutil.bread.tutor_viewworklog_text,
                        breadhref: comutil.bread.tutor_viewworklog_href,
				  		newpage: '/tutor_viewworklog', 
				  		timeout: comutil.redirect_timeout
			  	    });
			}			
		}
	});
};
