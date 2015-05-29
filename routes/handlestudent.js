/*******************************************************************************************
Filename    :handlestudent.js
Summary     :handle student operation
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
var comutil = require('../model/commonutils');
var exportlogs = require('../model/exportlogs');



exports.ModifySelfInfo = function(req, res) {
	StudentModifySelf(req, res, 'info');
};

exports.ModifySelfPass = function(req, res) {
	StudentModifySelf(req, res, 'password');
};

//////////////////////////////////////////////////////////////////
//function: show student modify self info or pass
//parameters:  
//    @req
//    @res
//    @modify_flag: info or password
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
var StudentModifySelf = function(req, res, modify_flag) {
	var stuNumber = req.session.user;
	console.log('StudentModifySelf stuNumber=' + stuNumber);

	var renderPage;
	var actFlag;
	var msg;
	var title;
	var stitle;
	var breadtext;
	var breadhref;
	if(modify_flag==comutil.modifytype.password)
	{
		renderPage = 'student_modify_selfpass';
		actFlag = comutil.sidebaract.student.modifyselfpassword;
		title = comutil.msg.title_modifystuselfpass;
		stitle = comutil.msg.stitle_modifystuselfpass;
		msg = comutil.msg_modifystuselfpass;
		breadtext = comutil.bread.student_modifyselfpassword_text;
		breadhref = comutil.bread.student_modifyselfpassword_href;
	}
	else
	{
		renderPage = 'student_modify_selfinfo';
		actFlag = comutil.sidebaract.student.modifyselfinfo;
		title = comutil.msg.title_modifystuselfinfo;
		stitle = comutil.msg.stitle_modifystuselfinfo;
		msg = comutil.msg_modifystuselfinfo;
		breadtext = comutil.bread.student_modifyselfinfo_text;
		breadhref = comutil.bread.student_modifyselfinfo_href;
	}

	mgdb.ModelSysRecord.findOne(
		{'stuNumber':stuNumber}, 
		function(err, docs){
			if(err)
			{
			  console.log('ModifySelfInfo stuNumber not found!');
			  res.render('student_redirect_delay', 
			  	{
			  		act: actFlag,
					msg: comutil.msg.msg_error_abnormal, 
					title: comutil.msg.title_error, 
					smalltitle: comutil.msg.stitle_error,
					breadtext: breadtext,
					breadhref: breadhref,
					newpage: '/student_logout', 
			  		timeout: comutil.redirect_timeout
			  	});
			}
			else
			{
				if(docs)
				{
					res.render(renderPage,
						  	{
						  		act: actFlag,
						  		stu:docs, 
								msg: msg, 
								title: title, 
								smalltitle:  ' ' + req.session.user + '，  ' + stitle,
								breadtext: breadtext,
					                                                breadhref: breadhref
						  	});
				}
				else
				{
					res.render('student_redirect_delay', 
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
	StudentDoModifySelf(req, res, 'info');
};

exports.DoModifySelfPass = function(req, res) {
	StudentDoModifySelf(req, res, 'password');
};

//////////////////////////////////////////////////////////////////
//function: student do modify self info or pass
//parameters:  
//    @req
//    @res
//    @modify_flag: info or password
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
var StudentDoModifySelf = function(req, res, modify_flag) {

	var actFlag;
	var breadtext;
	var breadhref;
	if(modify_flag==comutil.modifytype.info)
	{
		actFlag = comutil.sidebaract.tutor.modifyselfinfo;
		breadtext = comutil.bread.student_modifyselfinfo_text;
		breadhref = comutil.bread.student_modifyselfinfo_href;
		console.log('req.session.user=' + req.session.user + 
		        ' studentname= ' + req.body.stuname + 
		        ' studentnumber= ' + req.body.stunumber + 
		        ' studentcellphone= ' + req.body.stucellphone 
		        );
	}
	else if(modify_flag==comutil.modifytype.password)
	{
		actFlag = comutil.sidebaract.tutor.modifyselfpassword;
		breadtext = comutil.bread.student_modifyselfpassword_text;
		breadhref = comutil.bread.student_modifyselfpassword_href;
		console.log('req.session.user=' + req.session.user + 
		        ' new password= ' + req.body.password
		        );
	}
	else
	{
		console.log('error modify_flag: ' + modify_flag);
		res.render('student_redirect_delay', 
		  	{
		  		act:actFlag,
		  		msg: comutil.msg.msg_error_abnormal, 
		  		title: comutil.msg.title_error,
			                smalltitle: comutil.msg.stitle_error,
		  		newpage:'/student_logout', 
		  		timeout: comutil.redirect_timeout
		  	});

		return;
	}

	mgdb.FindAllbyOption(mgdb.ModelSysRecord, {'stuNumber':req.session.user}, function(err, docs){
		if(err)
		{
			res.render('student_redirect_delay', 
			  	{
			  	    act:actFlag,
			  		msg: comutil.msg.msg_error_abnormal, 
			  		title: comutil.msg.title_error,
				    smalltitle: comutil.msg.stitle_error,
				    breadtext: breadtext,
				    breadhref: breadhref,
			  		newpage:'/student_logout', 
			  		timeout: comutil.redirect_timeout
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
						docs[i].stuNumber = req.body.stunumber;
						docs[i].stuName = req.body.stuname;
						docs[i].stuPhone = req.body.stucellphone;
					}
					else if(modify_flag=='password')
					{
						var codedPass = comutil.CodedPassword(req.body.password);
						docs[i].stuPassword = codedPass;
					}			
					
					docs[i].save(function(err) {
						if(err)
						{
							console.log('save err :' + i + err.message);

							res.render('student_redirect_delay', 
							  	{
							  		act:actFlag,
							  		msg: comutil.msg.msg_error_abnormal, 
							  		title: comutil.msg.title_error,
								    smalltitle: comutil.msg.stitle_error,
								    breadtext: breadtext,
					                                                    breadhref: breadhref,
							  		newpage:'/student_logout', 
							  		timeout: comutil.redirect_timeout
							  	});

							return;
						}
						else
						{
							console.log('save ' + i + ' ok!');
						}	
					});
					//console.log('1111111111111111111111111');
				}
				//console.log('222222222222222');

				res.render('student_redirect_delay', 
				  	{
				  		act: actFlag,
						msg: comutil.msg.msg_ok_modify, 
						title: comutil.msg.title_ok, 
						smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_ok,
						breadtext: breadtext,
					                breadhref: breadhref,
						newpage:'/student_modifyselfinfo', 
				  		timeout:comutil.redirect_timeout
				  	});			
			}
			else
			{
				res.render('student_redirect_delay', 
				  	{
				  		act: actFlag,
						msg: comutil.msg.msg_error_notfound, 
						title: comutil.msg.title_error, 
						smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_error,
						breadtext: breadtext,
					                breadhref: breadhref,
						newpage: '/student_logout', 
				  		timeout: comutil.redirect_timeout
				  	});
			}
		}
	});
};

exports.ViewSysWorklog = function(req, res) {
	console.log('student ViewSysWorklog: stuNumber=' + req.session.user);

	mgdb.FindAllbyOption(
		mgdb.ModelSysRecord, 
		{stuNumber: req.session.user}, 
		function(err, docs){
		if(err)
		{
			res.render('student_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.student.viewworklog,
				msg: comutil.msg.msg_error_abnormal, 
				title: comutil.msg.title_error, 
				smalltitle:  ' ' + req.session.user + ' ' + comutil.msg.stitle_error_abnormal,
				breadtext: comutil.bread.student_viewworklog_text,
			                breadhref: comutil.bread.student_viewworklog_href,
				newpage:'/student_modifyselfinfo',
				timeout:comutil.redirect_timeout
		      	});
		}
		else
		{
			res.render('student_query_worklog_general_result', 
		      	{
		      		act: comutil.sidebaract.student.viewworklog,
		      		SysRecords: docs,
		      		//msg: comutil.msg.msg_result, 
		      		title: comutil.msg.title_viewsysworklog, 
		      		smalltitle: (' ' + req.session.user + '，  ' + comutil.msg.stitle_viewsysworklog), 
		      		breadtext: comutil.bread.student_viewworklog_text,
			        breadhref: comutil.bread.student_viewworklog_href,
		      		LinkDelete: comutil.link.student_queryresult_delete,
		      		LinkDetail: comutil.link.student_queryresult_detail,
		      		LinkExport: comutil.link.student_queryresult_export
		      	});
		}
	});
};

exports.ViewSysWorklogDetails = function(req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('student ViewSysWorklogDetails id= ' + idStr);

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('student_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.student.viewworklog,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.student_viewworklog_text,
                    breadhref: comutil.bread.student_viewworklog_href,
		      		newpage:'/student_viewworklog', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				res.render('student_query_worklog_detail_result',
				  	{
				  		act: comutil.sidebaract.student.viewworklog,
				  		worklogs: docs.workRecords, 
				  		stuname: docs.stuName,
				  		stunumber: docs.stuNumber,
				  		prjname: docs.prjName,
						msg: comutil.msg.msg_modifymember, 
				  		title: comutil.msg.title_viewsysworklog, 
				  		smalltitle: (' ' + req.session.user + '，  ' + comutil.msg.stitle_viewsysworklog), 
				  		breadtext: comutil.bread.student_viewworklog_text,
                        breadhref: comutil.bread.student_viewworklog_href,
				  		id:idStr
				  	});
			}
		}
	});
};

exports.SyslogExport = function(req, res) {
	exportlogs.SysWorklogExport(req, res, comutil.userrole.student);
};

exports.ClearSysWorklog = function(req, res) {
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('student ClearSysWorklog id= ' + idStr);

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('student_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.student.viewworklog,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.student_viewworklog_text,
                    breadhref: comutil.bread.student_viewworklog_href,
		      		newpage:'/student_viewworklog', 
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

						res.render('student_redirect_delay', 
						  	{
						  		act: comutil.sidebaract.student.viewworklog,
								msg: comutil.msg.msg_error, 
						  		title: comutil.msg.title_error, 
						  		smalltitle: comutil.msg.stitle_error_abnormal, 
						  		breadtext: comutil.bread.student_viewworklog_text,
                                breadhref: comutil.bread.student_viewworklog_href,
						  		newpage: '/student_viewworklog', 
						  		timeout: comutil.redirect_timeout
						  	});
					}
					else
					{
						console.log('student ClearSysWorklog clear ok!');
						res.redirect('/student_viewworklog');
					}
				});
			}
			else
			{
				console.log('not found!');
				res.render('student_redirect_delay', 
			  	    {
			  	    	act: comutil.sidebaract.student.viewworklog,
						msg: comutil.msg.msg_error_notfound, 
				  		title: comutil.msg.title_error, 
				  		smalltitle: comutil.msg.stitle_error_abnormal, 
				  		breadtext: comutil.bread.student_viewworklog_text,
                        breadhref: comutil.bread.student_viewworklog_href,
				  		newpage: '/student_viewworklog', 
				  		timeout: comutil.redirect_timeout
			  	    });
			}
		}
	});
};

exports.showadmin = function(req, res){
	res.render('student_admin', 
		{act:'1', 
		title:'Student Administor', 
		smalltitle: req.body.username + ', you may admin here'});
};

exports.querystudent = function(req, res){
	
	mgdb.DoQueryAll(mgdb.ModelStudent, function(err, docs){
		if(!err)
		{
			console.log(docs);
			//for(stu, index in docs)
			for(i=0; i<docs.length;i++)
			{
				console.log('name= ' + docs[i].name);
			}
			res.render('query_student_result', {students:docs, act:1, title:'Query Students', smalltitle:'supervisor may query tutors here'});
		}
		else
		{
			throw err;
			res.render('tutor_redirect_delay', {msg:'query students error!', newpage:'/tutor_admin', timeout:3000});
		}
	})
};

