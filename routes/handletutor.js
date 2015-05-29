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
			stuName:req.body.stuname, 
			stuNumber:req.body.stunumber,
			stuPhone:req.body.stucellphone, 
			prjName:req.body.prjname,
			tutorNumber:req.body.tutornumber,
			tutorName:req.body.tutorname,
			tutorPhone:req.body.tutorcellphone
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
						docs[i].tutorNumber = req.body.tutornumber;
						docs[i].tutorName = req.body.tutorname;
						docs[i].tutorPhone = req.body.tutorcellphone;
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
	        LinkDelete: comutil.link.tutor_queryresult_delete,
	        LinkDetail: comutil.link.tutor_queryresult_detail,
	        LinkExport: comutil.link.tutor_queryresult_export
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
				        LinkDelete: comutil.link.tutor_queryresult_delete,
				        LinkDetail: comutil.link.tutor_queryresult_detail,
				        LinkExport: comutil.link.tutor_queryresult_export
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

exports.addstudent = function(req, res){
	var newStudent = new mgdb.ModelStudent();

	//maybe need check again?
	//...

	var crypto = require('crypto');
	var sh256 = crypto.createHash('sha256');
	sh256.update(req.body.password);
	var codedpass = sh256.digest('base64');
	console.log(codedpass);

	newStudent.username = req.body.username;
	newStudent.name = req.body.name;
	newStudent.password = codedpass;
	newStudent.cellphone = req.body.cellphone;
	newStudent.weixin = req.body.weixin;
	newStudent.email = req.body.email;
	newStudent.comment = req.body.comment;
	newStudent.registered = true;
	newStudent.created = Date.now();

	mgdb.AddStudent(newStudent, function(msg){
		if(msg.msg=='ok')
		{
			res.render('tutor_redirect_delay', 
				{msg:'add student ok!', 
				title:'The Result', 
				smalltitle:'tutor may see operation result here', 
				newpage:'/tutor_admin', timeout:3000});
		}
		else
		{
			res.render('tutor_redirect_delay', 
				{msg:'add student error!', 
				title:'The Result', 
				smalltitle:'tutor may see operation result here',
				newpage:'/tutor_admin', timeout:3000});
		}
	});
};

exports.showadmin = function(req, res){
	res.render('tutor_admin', 
		{act:'1', 
		title:'Query Student', 
		smalltitle: req.session.user + 'welcome and you may add new student here'});
};


exports.modifyselfpass = function(req, res){

	if('user' in req.session && req.session.role=='tutor')
	{
		mgdb.FindOneByUsername(mgdb.ModelTutor, req.session.user, function(err, docs){
			if(err)
			{
				res.render('tutor_redirect_delay', 
					{msg:'error!', 
					title:'The Result', 
					smalltitle:'tutor may see operation result here',
					newpage:'/tutor_admin', timeout:3000});
			}
			else
			{
				if(docs)
				{
					console.log('tutor username= ' + docs.username);
					res.render('tutor_modify_selfpass', 
						{act:'4', 
						tutor:docs,
						title:'Modify Tutor password', 
						smalltitle: req.session.user + 'welcome and you may modify yourself information here'});
				}
				else
				{
					res.render('tutor_redirect_delay', 
						{msg:'can not find your information!', 
						title:'The Result', 
						smalltitle:'tutor may see operation result here',
						newpage:'/tutor_admin', timeout:5000});
				}
			}
		});	

	}
	else
	{
		res.render('tutor_redirect_delay', 
			{msg:'please login first!', 
			title:'The Result', 
			smalltitle:'tutor may see operation result here',
			newpage:'/user_login.html', timeout:3000});
	}
};

exports.showblank = function(req, res){
	res.render('form_wizard2', {});
};

exports.queryalllog = function(req, res){
	mgdb.DoQueryAll(mgdb.ModelWorklog, function(err, docs){
		if(err) throw err;

		if(docs)
		{
			res.render('query_log_result', 
				{worklogs:docs, 
				act:3, 
				title:'Test Photo Logs', 
				smalltitle:'supervisor may query tutors here'});
			// for(j=0; j<docs.length; j++)
			// {
			// 	console.log('docs['+j+'].weixin_id=' + docs[j].weixin_id);
			// 	console.log('docs['+j+'].logtext=' + docs[j].logtext);
			// 	console.log('docs['+j+'].logpicpath=' + docs[j].logpicpath);				
			// }
		}
		else
		{
			res.send('no worklogs!');
		}
	});
};

exports.querylog = function(req, res){
	
	var logtext = new Array();
	var logpicpath = new Array();
	var logResult = {
		'name':'johnny',
		'weixin_id':'',
		'logtext':logtext,
		'logpicpath':logpicpath
	};
	var logLists = new Array();

/*	for(i=0; i<10; i++)
	{
		logtext[i] = ''+i;
		logpicpath[i] = '/home/imag/' + i + '.jpg';
	}

	console.log('logResult.logtext.length=' + logResult.logtext.length);
	console.log('logResult.logtext[2]=' + logResult.logtext[2]);
	console.log('logResult.logpicpath[5]=' + logResult.logpicpath[5]);*/
	
	mgdb.DoQueryAll(mgdb.ModelSubScribeStudent, function(err, docs){
		if(err) throw err;

		if(docs)
		{
			for(i=0; i<docs.length; i++)
			{
				var weixin_id = docs[i].weixin_id;
				console.log('substudent['+i+'].weixin_id=' + docs[i].weixin_id);

				logResult.weixin_id = weixin_id;

				logLists[i] = logResult;
				logLists[i].weixin_id = weixin_id;
				logLists[i].name = 'myname';				

				mgdb.FindWorklogByWeixinId(mgdb.ModelWorklog, weixin_id, function(err, worklogs) {
					if(err) throw err;

					if(worklogs)
					{
						var t = 0;
						var m = 0;
						for(j=0; j<worklogs.length; j++)
						{
							//worklogs[j].name = docs[i].name;
							//worklogs[j].cellphone = docs[i].cellphone;
							console.log('worklogs['+j+'].weixin_id=' + worklogs[j].weixin_id);
							console.log('worklogs['+j+'].logtext=' + worklogs[j].logtext);
							console.log('worklogs['+j+'].logpicpath=' + worklogs[j].logpicpath);
							//console.log('worklogs['+j+'].name=' + worklogs[j].name);
							//console.log('worklogs['+j+'].cellphone=' + worklogs[j].cellphone);

							/*
							if(worklogs[j].logtext!='')
							{
								//logtext[t] = worklogs[j].logtext;
								logLists[i].logtext[t] = worklogs[j].logtext;
								t = t + 1;
								console.log('t=' + t);
							}
							if(worklogs[j].logpicpath!='')
							{
								//logpicpath[m] = worklogs[j].logpicpath;
								logLists[i].logpicpath[m] = worklogs[j].logpicpath;
								m = m + 1;
								console.log('m=' + m);
							}*/
						}
/*						res.render('query_log_result', 
							{worklogs:worklogs, 
							act:3, 
							title:'Test Photo Logs', 
							smalltitle:'supervisor may query tutors here'});*/
					}
					else
					{
						res.send('no worklogs!');
					}					
				});

				
			}

		}
		else
		{
			res.send('no subscribed student!');
		}

		//show logLists
		//ShowLoglists(logLists);
	});
};


var ShowLoglists = function(logList){
	console.log('ShowLoglists:');

	for(k=0; k<logList.length; k++)
	{
		console.log('logList[' + k + '].weixin_id=' + logList[k].weixin_id);
		console.log('logList[' + k + '].name=' + logList[k].name);

		for(i=0; i<logList[k].logtext.length; i++)
		{
			console.log('logList[' + k + '].logtext[' + i + ']=' + logList[k].logtext[i]);
		}
		for(i=0; i<logList[k].logpicpath.length; i++)
		{
			console.log('logList[' + k + '].logpicpath[' + i + ']=' + logList[k].logpicpath[i]);
		}
	}
};

exports.querystudent = function(req, res){
	
	mgdb.DoQueryAll(mgdb.ModelSubScribeStudent, function(err, docs){
		if(!err)
		{
			console.log(docs);
			//for(stu, index in docs)
			for(i=0; i<docs.length;i++)
			{
				console.log('name= ' + docs[i].name);
			}
			res.render('query_student_result', 
				{students:docs, 
				act:1, 
				title:'Query Students', 
				smalltitle:'supervisor may query tutors here'});
		}
		else
		{
			throw err;
			res.render('tutor_redirect_delay', 
				{msg:'query students error!', 
				newpage:'/tutor_admin', 
				timeout:3000});
		}
	})
};

exports.querycondstudent = function(req, res){

	//res.send('querycondstudent');
	console.log('name:' + req.body.name + ' cellphone:'+req.body.cellphone + ' weixin:'+req.body.weixin);

	if(req.body.name=="" && req.body.cellphone=="" && req.body.weixin=="")
	{
		console.log('all empty!');

		mgdb.DoQueryAll(mgdb.ModelSubScribeStudent, function(err, docs){
			if(!err)
			{
				console.log(docs);
				//for(stu, index in docs)
				for(i=0; i<docs.length;i++)
				{
					console.log('name= ' + docs[i].name);
				}
				res.render('query_student_result', 
					{students:docs, 
					act:1, 
					title:'Query Students', 
					smalltitle:'supervisor may query tutors here'});
			}
			else
			{
				throw err;
				res.render('tutor_redirect_delay', 
					{msg:'query students error!', 
					newpage:'/query_student_result', 
					timeout:3000});
			}
		});
	}
	else
	{
		console.log('not empty!');
		mgdb.ModelSubScribeStudent.find(
		{
			"$or":
			[
			    {'cellphone':req.body.cellphone},
			    {'name':req.body.name},			    
			    {'weixin':req.body.weixin}
			],
			
		}, function(err, docs){
			if(!err)
			{
				console.log(docs);
				//for(stu, index in docs)
				for(i=0; i<docs.length;i++)
				{
					console.log('name= ' + docs[i].name);
				}
				res.render('query_student_result', 
					{students:docs, 
					act:1, 
					title:'Query Students', 
					smalltitle:'supervisor may query tutors here'});
			}
			else
			{
				throw err;
				res.render('tutor_redirect_delay', 
					{msg:'query students error!', 
					newpage:'/query_student_result', 
					timeout:3000});
			}
		});

	}

};

