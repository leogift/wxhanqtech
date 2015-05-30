/*******************************************************************************************
Filename    :handlesupervisor.js
Summary     :handle supervisor operation
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
//var formidable = require('formidable'); not use formidable now, conflicted with req.body.parameters
var sys = require('sys');
var util = require('util');
var fs = require('fs');
var path = require('path');
var xlsx = require('../model/xlsx');
var exportlogs = require('../model/exportlogs');

exports.ShowHiddenAdminResetPassword = function(req, res) {
	res.render('hiddenadmin_resetpassword', 
      	{
      		//act: comutil.sidebaract.super.viewsyslog,
			msg: comutil.msg.msg_error_abnormal, 
			title: '修改管理员用户密码', 
			smalltitle:  '      welcome, root!' ,
			breadtext: 'root',
		    breadhref: comutil.bread.super_viewsyslog_href,
      	});
};

exports.DoHiddenAdminResetPassword = function(req, res) {
	
	var rootPass = req.body.rootpassword.trim();
	var adminUser = req.body.adminuser.trim();
	var adminPassword = req.body.password.trim();
	var adminRPassword = req.body.rpassword.trim();

	console.log('rootpassword=' + rootPass);
	console.log('admin user=' + adminUser);
	console.log('admin password=' + adminPassword);
	console.log('admin rpassword=' + adminRPassword);

	//check root password
	if(rootPass!='Hanqwebroot13133')
	{
		console.log('hehe?');

		res.render('super_redirect_delay', 
	      	{
	      		//act: comutil.sidebaract.super.viewsyslog,
				msg: 'root password error!', 
				title: comutil.msg.title_error, 
				smalltitle:  'root password error!' ,
				breadtext: comutil.bread.super_viewsyslog_text,
			    breadhref: comutil.bread.super_viewsyslog_href,
			    newpage:'/hiddenadminresetpass123',
				timeout:comutil.redirect_timeout
	      	});

		return;
	}

	//find in db
	mgdb.FindOneByOption(mgdb.ModelAdminPassword, {'adminUser':adminUser}, function(err, docs){
		if(err)
		{
			res.render('super_redirect_delay', 
		      	{
		      		//act: comutil.sidebaract.super.viewsyslog,
					msg: comutil.msg.msg_error_abnormal + ': ' + err, 
					title: comutil.msg.title_error, 
					smalltitle:  comutil.msg.stitle_error,
					breadtext: comutil.bread.super_viewsyslog_text,
				    breadhref: comutil.bread.super_viewsyslog_href,
				    newpage:'/hiddenadminresetpass123',
					timeout:comutil.redirect_timeout
		      	});
		}
		else
		{
			if(docs)
			{
				//modify
				docs.adminPass = comutil.CodedPassword(adminPassword);
				docs.save(function(err, entity){
					if(err) 
					{
						console.log(err);
						res.render('super_redirect_delay', 
					      	{
					      		//act: comutil.sidebaract.super.viewsyslog,
								msg: comutil.msg.msg_error_abnormal + ': ' + err, 
								title: comutil.msg.title_error, 
								smalltitle:  comutil.msg.stitle_error,
								breadtext: comutil.bread.super_viewsyslog_text,
							    breadhref: comutil.bread.super_viewsyslog_href,
							    newpage:'/hiddenadminresetpass123',
								timeout:comutil.redirect_timeout
					      	});
					}				
					else
					{
						console.log('modify ok!');
						res.render('super_redirect_delay', 
						      	{
						      		//act: comutil.sidebaract.super.addnewstudent,
						      		msg: 'modify success!',
						      		title: comutil.msg.title_ok, 
						      		smalltitle: comutil.msg.stitle_ok, 
						      		breadtext: comutil.bread.super_addnewstudent_text,
				                    breadhref: comutil.bread.super_addnewstudent_href,
						      		newpage:'/hiddenadminresetpass123', 
						      		timeout:comutil.redirect_timeout
						      	});	
					}				
				});
			}
			else
			{
				//add new
				var newAdminPass = new mgdb.ModelAdminPassword();
				newAdminPass.adminUser = adminUser;
				newAdminPass.adminPass = comutil.CodedPassword(adminPassword);

				mgdb.AddOneSysRecord(newAdminPass, function(err, entity){
					if(err)
					{
						res.render('super_redirect_delay', 
					      	{
					      		//act: comutil.sidebaract.super.addnewstudent,
					      		msg: comutil.msg.msg_error_addnewstudent + ': ' + err,
					      		title: comutil.msg.title_error, 
					      		smalltitle: comutil.msg.stitle_error, 
					      		breadtext: comutil.bread.super_addnewstudent_text,
			                    breadhref: comutil.bread.super_addnewstudent_href,
					      		newpage:'/hiddenadminresetpass123', 
					      		timeout:(comutil.redirect_timeout*2)
					      	});
					}
					else
					{
						console.log('add ok!');
						res.render('super_redirect_delay', 
					      	{
					      		//act: comutil.sidebaract.super.addnewstudent,
					      		msg: 'add new success!',
					      		title: comutil.msg.title_ok, 
					      		smalltitle: comutil.msg.stitle_ok, 
					      		breadtext: comutil.bread.super_addnewstudent_text,
			                    breadhref: comutil.bread.super_addnewstudent_href,
					      		newpage:'/hiddenadminresetpass123', 
					      		timeout:comutil.redirect_timeout
					      	});			
					}
				});

			}

		}
	});
	
};

exports.ShowSuperModifyPassword = function(req, res) {

	res.render('super_modify_selfpass', 
  	{
  		act: comutil.sidebaract.super.modifypass,
  		//SysRecords: null,
  		//mbtn: comutil.mbtn_id_superdeletelog,
  		title: comutil.msg.title_modifyadminselfpass, 
  		smalltitle: ('   ' + comutil.msg.stitle_modifyadminselfpass), 
  		breadtext: comutil.bread.super_modifyselfpass_text,
        breadhref: comutil.bread.super_modifyselfpass_href
  	});

};

exports.DoSuperModifyPassword = function(req, res) {
	
	console.log('username:' + req.session.user);
	console.log('oldpassword:' + req.body.oldpassword);
	console.log('newpassword:' + req.body.password);

	//check old pass
	mgdb.FindOneByOption(mgdb.ModelAdminPassword, {'adminUser':req.session.user}, function(err, docs){
		if(err)
		{
			res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.modifypass,
					msg: comutil.msg.msg_error_abnormal + ': ' + err, 
					title: comutil.msg.title_error, 
					smalltitle:  comutil.msg.stitle_error,
					breadtext: comutil.bread.super_modifyselfpass_text,
				    breadhref: comutil.bread.super_modifyselfpass_href,
				    newpage:'/super_modifyselfpassword',
					timeout:comutil.redirect_timeout
		      	});
		}
		else
		{
			if(docs)
			{
				var codedPass = comutil.CodedPassword(req.body.oldpassword);
				if(codedPass==docs.adminPass)
				{
					var newCodedPass = comutil.CodedPassword(req.body.password);

					//modify
					docs.adminPass = newCodedPass;
					docs.save(function(err, entity){
						if(err) 
						{
							console.log(err);
							res.render('super_redirect_delay', 
					      	{
					      		act: comutil.sidebaract.super.modifypass,
								msg: comutil.msg.msg_error_abnormal + ': ' + err, 
								title: comutil.msg.title_error, 
								smalltitle:  comutil.msg.stitle_error,
								breadtext: comutil.bread.super_modifyselfpass_text,
							    breadhref: comutil.bread.super_modifyselfpass_href,
							    newpage:'/super_modifyselfpassword',
								timeout:comutil.redirect_timeout
					      	});
						}				
						else
						{
							console.log('modify ok!');
							res.render('super_redirect_delay', 
					      	{
					      		act: comutil.sidebaract.super.modifypass,
					      		msg: 'modify success!',
					      		title: comutil.msg.title_ok, 
					      		smalltitle: comutil.msg.stitle_ok, 
					      		breadtext: comutil.bread.super_modifyselfpass_text,
			                    breadhref: comutil.bread.super_modifyselfpass_href,
					      		newpage:'/super_modifyselfpassword', 
					      		timeout:comutil.redirect_timeout
					      	});	
						}				
					});

				}
				else
				{
					res.render('super_redirect_delay', 
			        {
			       	    act: comutil.sidebaract.super.modifypass,
			       	    msg: comutil.msg.msg_error_userorpass, 
			       	    title: comutil.msg.title_accessdeny, 
			       	    smalltitle: comutil.msg.stitle_accessdeny, 
			       	    breadtext: comutil.bread.super_modifyselfpass_text,
			            breadhref: comutil.bread.super_modifyselfpass_href,
			       	    newpage: '/super_modifyselfpassword',
			       	    timeout:comutil.redirect_timeout
			       });
				}
			}
			else
			{
				res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.modifypass,
					msg: comutil.msg.msg_accessdeny, 
					title: comutil.msg.title_error, 
					smalltitle:  comutil.msg.stitle_error,
					breadtext: comutil.bread.super_modifyselfpass_text,
				    breadhref: comutil.bread.super_modifyselfpass_href,
				    newpage: comutil.supLoginPage,
					timeout:comutil.redirect_timeout
		      	});
				
			}

		}
	});

};

//test
exports.ViewSysWorklog = function(req, res) {

	res.render('super_query_worklog_general_result', 
      	{
      		act: comutil.sidebaract.super.viewsyslog,
      		SysRecords: null,
      		mbtn: comutil.mbtn_id_superdeletelog,
      		title: comutil.msg.title_viewsysworklog, 
      		smalltitle: ('   ' + comutil.msg.stitle_viewsysworklog), 
      		breadtext: comutil.bread.super_viewsyslog_text,
	                breadhref: comutil.bread.super_viewsyslog_href,
	                action: comutil.link.super_queryworklog,
	                IsShowStu: true,
	                IsShowPrj: true,
	                IsShowTutor: true,
	                tutorNumber: '',
      		LinkDelete: comutil.link.super_queryresult_delete,
      		LinkDetail: comutil.link.super_queryresult_detail,
      		LinkExport: comutil.link.super_queryresult_export
      	});
};

exports.ViewSysWorklogQueryResult = function(req, res) {

	var stuNumber = req.body.stuNumber.trim();
	var prjName = req.body.prjName.trim();
	var tutorNumber = req.body.tutorNumber.trim();
	var selectedYear = req.body.selectedYear.trim();

	console.log('stuNumber:' + stuNumber + '\tprjName:'+ prjName+ '\ttutorNumber:'+tutorNumber + '\tselectedYear:' + selectedYear);

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

	if(stuNumber=='' && prjName=='' && tutorNumber=='')
	{
		console.log('empty, query all!');

		mgdb.FindAllbyOption(
			mgdb.ModelSysRecord, 
			{"$or":optArrayYear}, 
			function(err, docs){
				if(err)
				{
					res.render('super_redirect_delay', 
				      	{
				      		act: comutil.sidebaract.super.viewsyslog,
							msg: comutil.msg.msg_error_abnormal, 
							title: comutil.msg.title_error, 
							smalltitle:  '   ' + comutil.msg.stitle_error_abnormal,
							breadtext: comutil.bread.super_viewsyslog_text,
						                breadhref: comutil.bread.super_viewsyslog_href,
							newpage:'/super_viewsyslog',
							timeout:comutil.redirect_timeout
				      	});
				}
				else
				{
					res.render('super_query_worklog_general_result', 
				      	{
				      		act: comutil.sidebaract.super.viewsyslog,
				      		SysRecords: docs,
				      		mbtn: comutil.mbtn_id_superdeletelog,
				      		title: comutil.msg.title_viewsysworklog, 
				      		smalltitle: ('   ' + comutil.msg.stitle_viewsysworklog), 
				      		breadtext: comutil.bread.super_viewsyslog_text,
					        breadhref: comutil.bread.super_viewsyslog_href,
					        action: comutil.link.super_queryworklog,
					        IsShowStu: true,
	                        IsShowPrj: true,
	                        IsShowTutor: true,
					        tutorNumber: '',
					        LinkDelete: comutil.link.super_queryresult_delete,
					        LinkDetail: comutil.link.super_queryresult_detail,
					        LinkExport: comutil.link.super_queryresult_export
				      	});
				}
		});
	}
	else // 有条件与无条件竟然不能合一
	{
		var optArray = [];
		if(stuNumber!='')
			optArray.push({'stuNumber': stuNumber});
		if(prjName!='')
			optArray.push({'prjName': prjName});
		if(tutorNumber!='')
			optArray.push({'tutorNumber': tutorNumber});

		console.log('condition query: optArray=' + optArray.toString());

		mgdb.ModelSysRecord.find(
			{
				"$and":
				optArray,
				"$or":
				optArrayYear
			},
			null,
			{sort:[['stuNumber', 1]]},
			function(err, logRecs){
				if(err)
				{
					res.render('super_redirect_delay', 
				      	{
				      		act: comutil.sidebaract.super.viewsyslog,
							msg: comutil.msg.msg_error_abnormal, 
							title: comutil.msg.title_error, 
							smalltitle:  '   ' + comutil.msg.stitle_error_abnormal,
							breadtext: comutil.bread.super_viewsyslog_text,
						                breadhref: comutil.bread.super_viewsyslog_href,
							newpage:'/super_viewsyslog',
							timeout:comutil.redirect_timeout
				      	});
				}
				else
				{
					console.log('logrecs.length=' + logRecs.length);

					res.render('super_query_worklog_general_result', 
				      	{
				      		act: comutil.sidebaract.super.viewsyslog,
				      		SysRecords: logRecs,
				      		mbtn: comutil.mbtn_id_superdeletelog,
				      		title: comutil.msg.title_viewsysworklog, 
				      		smalltitle: ('   ' + comutil.msg.stitle_viewsysworklog), 
				      		breadtext: comutil.bread.super_viewsyslog_text,
					        breadhref: comutil.bread.super_viewsyslog_href,
					        action: comutil.link.super_queryworklog,
					        IsShowStu: true,
	                        IsShowPrj: true,
	                        IsShowTutor: true,
					        tutorNumber: '',
					        LinkDelete: comutil.link.super_queryresult_delete,
					        LinkDetail: comutil.link.super_queryresult_detail,
					        LinkExport: comutil.link.super_queryresult_export
				      	});
				}
		});
	}
};

exports.ViewSysWorklogDetails = function(req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('ViewSysWorklogDetails id= ' + idStr);

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('super_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.super.viewsyslog,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.super_viewsyslog_text,
                    breadhref: comutil.bread.super_viewsyslog_href,
		      		newpage:'/super_viewsyslog', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				res.render('super_query_worklog_detail_result',
				  	{
				  		act: comutil.sidebaract.super.viewsyslog,
				  		worklogs: docs.workRecords, 
				  		stuname: docs.stuName,
				  		stunumber: docs.stuNumber,
				  		prjname: docs.prjName,
						msg: comutil.msg.msg_modifymember, 
				  		title: comutil.msg.title_viewsysworklog, 
				  		smalltitle: '', 
				  		breadtext: comutil.bread.super_viewsyslog_text,
                        breadhref: comutil.bread.super_viewsyslog_href,
				  		id:idStr
				  	});
			}
			// else
			// {
			// 	console.log('not found!');
			// 	res.render('super_redirect_delay', 
			//   	    {
			//   	    	act: comutil.sidebaract.super.viewmembers,
			// 			msg: comutil.msg.msg_error_notfound, 
			// 	  		title: comutil.msg.title_error, 
			// 	  		smalltitle: comutil.msg.stitle_error_abnormal, 
			// 	  		breadtext: comutil.bread.super_viewsyslog_text,
   //                      breadhref: comutil.bread.super_viewsyslog_href,
			// 	  		newpage: '/super_viewsyslog', 
			// 	  		timeout: comutil.redirect_timeout
			//   	    });
			// }			
		}
	});
};
/*
exports.SyslogExport = function(req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('SyslogExport id= ' + idStr);

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('super_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.super.viewsyslog,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.super_viewsyslog_text,
                    breadhref: comutil.bread.super_viewsyslog_href,
		      		newpage:'/super_viewsyslog', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				//make dir
				var dir = comutil.MakeDownloadDir(docs);
				if(dir==null)
				{
					console.log('MakeDownloadDir null!');
					return;
				}

				//save xlsx
				var xlsxFile = dir + '/' + comutil.export_xlsx_filename;
				console.log('xlsxFile=' + xlsxFile);
				comutil.ExportXlsx(docs, xlsxFile, comutil.export_xlsx_sheetname, function(err){
					if(err)
					{
						console.log(err);

						res.render('super_redirect_delay', 
					  	    {
					  	    	act: comutil.sidebaract.super.viewsyslog,
					      		msg: comutil.msg.msg_error,
					      		title: comutil.msg.title_error, 
					      		smalltitle: comutil.msg.stitle_error, 
					      		breadtext: comutil.bread.super_viewsyslog_text,
				                breadhref: comutil.bread.super_viewsyslog_href,
					      		newpage:'/super_viewsyslog', 
					      		timeout:comutil.redirect_timeout
					  	    });
					}
					else
					{
						console.log('SaveToFile ok!');

						//do zip
						var zipDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir;
						var zipSrcDir = zipDir + '/' + docs.stuNumber + '_' + docs.prjName;
						var zipFilename = docs.stuNumber + '_' + docs.prjName + '.tar.gz';
						var zipFile = zipDir + '/' + zipFilename;

						console.log('zipDir=' + zipDir);
						console.log('zipSrcDir=' + zipSrcDir);
						console.log('zipFilename=' + zipFilename);
						console.log('zipFile=' + zipFile);

						//comutil.DirToZip(zipSrcDir, zipFile);

						//push to downloading...
						res.download(zipFile);
					}

				});
			}
			else
			{
				console.log('not found!');
				res.render('super_redirect_delay', 
			  	    {
			  	    	act: comutil.sidebaract.super.viewsyslog,
			      		msg: comutil.msg.msg_error_abnormal,
			      		title: comutil.msg.title_error, 
			      		smalltitle: comutil.msg.stitle_error, 
			      		breadtext: comutil.bread.super_viewsyslog_text,
	                    breadhref: comutil.bread.super_viewsyslog_href,
			      		newpage:'/super_viewsyslog', 
			      		timeout:comutil.redirect_timeout
			  	    });
			}			
		}
	});
};
*/

exports.SyslogExport = function(req, res) {
	exportlogs.SysWorklogExport(req, res, comutil.userrole.super);
};

exports.ClearSysWorklog = function(req, res) {
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('ClearSysWorklog id= ' + idStr);

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('super_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.super.viewsyslog,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.super_viewsyslog_text,
                    breadhref: comutil.bread.super_viewsyslog_href,
		      		newpage:'/super_viewsyslog', 
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

						res.render('super_redirect_delay', 
						  	{
						  		act: comutil.sidebaract.super.viewsyslog,
								msg: comutil.msg.msg_error, 
						  		title: comutil.msg.title_error, 
						  		smalltitle: comutil.msg.stitle_error_abnormal, 
						  		breadtext: comutil.bread.super_viewsyslog_text,
                                breadhref: comutil.bread.super_viewsyslog_href,
						  		newpage: '/super_viewsyslog', 
						  		timeout: comutil.redirect_timeout
						  	});
					}
					else
					{
						console.log('ClearSysWorklog clear ok!');
						res.redirect('/super_viewsyslog');
					}
				});
			}
			else
			{
				console.log('not found!');
				res.render('super_redirect_delay', 
			  	    {
			  	    	act: comutil.sidebaract.super.viewsyslog,
						msg: comutil.msg.msg_error_notfound, 
				  		title: comutil.msg.title_error, 
				  		smalltitle: comutil.msg.stitle_error_abnormal, 
				  		breadtext: comutil.bread.super_viewsyslog_text,
                        breadhref: comutil.bread.super_viewsyslog_href,
				  		newpage: '/super_viewsyslog', 
				  		timeout: comutil.redirect_timeout
			  	    });
			}			
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: just show SysInit page
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
exports.SysInit = function(req, res) {

	// res.download('./public/download/3_prj2.tar.gz');
	// return;

	res.render('super_sysinit', 
		{
			act: comutil.sidebaract.super.sysinit, 
			msg: comutil.msg.msg_sysinit,
			title: comutil.msg.title_sysinit, 
			smalltitle: comutil.msg.stitle_sysinit,
			breadtext: comutil.bread.super_sysinit_text,
			breadhref: comutil.bread.super_sysinit_href
		});
};

//////////////////////////////////////////////////////////////////
//function: supervisor upload sysinit excel file
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: only one file can be uploaded once, limit it in front page
//////////////////////////////////////////////////////////////////
exports.OnUpload = function(req, res) {
	// mgdb.RemoveDatabase(function(err, result){
	// 	if(err)
	// 	{
	// 		console.log('OnUpload error: ' + err);
	// 		res.render('super_redirect_delay', 
	//       	{
	//       		act: comutil.sidebaract.super.sysinit,
	//       	    msg: comutil.msg.msg_error_sysinit + ' ' + err, 
	//       	    title: comutil.msg.title_error, 
	//       	    smalltitle: comutil.msg.stitle_sysinit,
	//       	    breadtext: comutil.bread.super_sysinit_text,
	// 	        breadhref: comutil.bread.super_sysinit_href, 
	//       	    newpage: '/super_sysinit', 
	//       	    timeout: comutil.redirect_timeout
	//       	});
	// 	}
	// 	else
	// 	{
	// 		console.log('OnUpload result: ' + result);
	// 		XlsxFileToDb(req, res);
	// 	}
	// });	


    // not delete but append
	XlsxFileToDb(req, res);
};

var XlsxFileToDb = function (req, res) {
	for (var i in req.files) 
	{
		console.log('OnUpload: ' + i);

	    if (req.files[i].size == 0)
	    {
	      // 使用同步方式删除一个文件
	      fs.unlinkSync(req.files[i].path);
	      console.log('Successfully removed an empty file!');

	      res.render('super_redirect_delay', 
	      	{act:1,
	      	msg:'File is empty!', 
	      	title:'The Result', 
	      	smalltitle:'supervisor may see operation result here', 
	      	breadtext: comutil.bread.super_sysinit_text,
		    breadhref: comutil.bread.super_sysinit_href,
	      	newpage:'/super_sysinit', 
	      	timeout:3000});
	    } 
	    else 
	    {
	    	var saveOk = true;
	        console.log('file info:');
	        console.log(JSON.stringify(req.files[i]));

	        var target_path = comutil.uploadDir.toString() + req.files[i].name;
	        console.log('filename=' + target_path);

	        // 使用同步方式重命名一个文件
	        fs.renameSync(req.files[i].path, target_path);
	        console.log('文件上传成功');

	        //read file and record to db
	        //var xlsx = require('../model/xlsx');
	        xlsx.PrintTable(target_path);

			xlsx.XlsxToDb(target_path, function(err, entity){
				if(err)
			    {
			        console.log(err);
			        res.render('super_redirect_delay', 
				      	{
				      		act: comutil.sidebaract.super.sysinit,
				      	    msg: comutil.msg.msg_error_sysinit + ': ' + err, 
				      	    title: comutil.msg.title_error, 
				      	    smalltitle: comutil.msg.stitle_sysinit, 
				      	    breadtext: comutil.bread.super_sysinit_text,
			                                    breadhref: comutil.bread.super_sysinit_href,
				      	    newpage: '/super_sysinit', 
				      	    timeout: (comutil.redirect_timeout*2)
				      	});
			    }
			    else
			    {
			        console.log('save ok!' + entity);
			        res.render('super_redirect_delay', 
				      	{
				      		act: comutil.sidebaract.super.sysinit,
				      	    msg: comutil.msg.msg_ok, 
				      	    title: comutil.msg.title_ok, 
				      	    smalltitle: comutil.msg.stitle_ok, 
				      	    breadtext: comutil.bread.super_sysinit_text,
			                breadhref: comutil.bread.super_sysinit_href,
				      	    newpage: '/super_viewmembers', 
				      	    timeout: comutil.redirect_timeout
				      	});
			    }
			});
	    }
	}

};

exports.ViewPrjs = function(req, res) {

	mgdb.ModelSysRecord.distinct('prjName', {}, function(err, docs){
		if(err)
		{
			console.log(err);
			res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.viewprjs,
		      		msg: comutil.msg.msg_error_abnormal_sysinit, 
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error_abnormal, 
		      		breadtext: comutil.bread.super_viewprjs_text,
			        breadhref: comutil.bread.super_viewprjs_href,
		      		newpage: '/super_sysinit', 
		      		timeout: comutil.redirect_timeout
		      	});
		}
		else
		{
			var prjInfo = [];
			//test
			var len = docs.length;
			console.log('docs.length=' + docs.length);

			for(var i=0; i<len; i++)
			{
				console.log(docs[i]);
				mgdb.ModelSysRecord.findOne({'prjName':docs[i]}, function(err, data){
					if(err)
					{
						console.log('error=' + err);
					}
					else
					{
						if(data)
						{
							console.log('prjName=' + docs[i]);
							console.log('prjStartDate' + data.prjStartDate);
							console.log('prjStopDate' + data.prjStopDate);

							var prjObj = {prjName: docs[i], prjStartDate: data.prjStartDate, prjStopDate: data.prjStopDate};
							prjInfo.push(prjObj);
						}
					}

				});
			}

			res.send(prjInfo);
		}
	});

	mgdb.DoQueryAll(mgdb.ModelSysRecord, function(err, docs){
		if(err)
		{
			res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.viewmembers,
		      		msg: comutil.msg.msg_error_abnormal_sysinit, 
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error_abnormal, 
		      		breadtext: comutil.bread.super_viewmembers_text,
			        breadhref: comutil.bread.super_viewmembers_href,
		      		newpage: '/super_sysinit', 
		      		timeout: comutil.redirect_timeout
		      	});
		}
		else
		{
			console.log('msg_ok=' + comutil.msg.title_ok);

			res.render('super_query_member_result', 
		      	{
		      		act: comutil.sidebaract.super.viewmembers,
		      		members: docs,
		      		msg: comutil.msg.msg_result, 
		      		title: comutil.msg.title_viewmembers, 
		      		smalltitle: ('   ' + comutil.msg.stitle_viewmembers), 
		      		breadtext: comutil.bread.super_viewmembers_text,
			        breadhref: comutil.bread.super_viewmembers_href,
		      		//newpage: '/super_sysinit', 
		      		//timeout: comutil.redirect_timeout
		      	});
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: supervisor view member information, including student and tutor
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: when view members, supervisor may do operations, it's done by jade file
//////////////////////////////////////////////////////////////////
exports.ViewMembers = function(req, res) {

	mgdb.DoQueryAll(mgdb.ModelSysRecord, function(err, docs){
		if(err)
		{
			res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.viewmembers,
		      		msg: comutil.msg.msg_error_abnormal_sysinit, 
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error_abnormal, 
		      		breadtext: comutil.bread.super_viewmembers_text,
			        breadhref: comutil.bread.super_viewmembers_href,
		      		newpage: '/super_sysinit', 
		      		timeout: comutil.redirect_timeout
		      	});
		}
		else
		{
			console.log('msg_ok=' + comutil.msg.title_ok);

			res.render('super_query_member_result', 
		      	{
		      		act: comutil.sidebaract.super.viewmembers,
		      		members: docs,
		      		msg: comutil.msg.msg_result, 
		      		title: comutil.msg.title_viewmembers, 
		      		smalltitle: ('   ' + comutil.msg.stitle_viewmembers), 
		      		breadtext: comutil.bread.super_viewmembers_text,
			        breadhref: comutil.bread.super_viewmembers_href,
		      		//newpage: '/super_sysinit', 
		      		//timeout: comutil.redirect_timeout
		      	});
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: show add student page by rendering jade file
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
exports.ShowAddStudent = function(req, res){
	res.render('super_add_member', 
       {
           act: comutil.sidebaract.super.addnewstudent, 
           msg: comutil.msg.msg_addnewstudent, 
           title: comutil.msg.title_addnewstudent, 
           smalltitle: comutil.msg.stitle_addnewstudent,
           breadtext: comutil.bread.super_addnewstudent_text,
           breadhref: comutil.bread.super_addnewstudent_href
       });
};

//////////////////////////////////////////////////////////////////
//function: handle post of do add member
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
exports.AddMember = function(req, res){

	//maybe need check again?
	//...

	//var newWorkRec = new mgdb.ModelWorkRecord();

	var newSysRec = new mgdb.ModelSysRecord();
	newSysRec.stuNumber = req.body.stunumber;
	newSysRec.stuName = req.body.stuname;
	newSysRec.stuPhone = req.body.stucellphone;
	var codedPassword = comutil.CodedPassword(req.body.stucellphone);
	newSysRec.stuPassword = codedPassword;

	newSysRec.stuWeixin_id = 'default_weixin_id';
	newSysRec.stuWeixinBind = false;
	newSysRec.stuLoginFlag = true;
	newSysRec.prjName = req.body.prjname;
	//newSysRec.prjDesc = rec[1];
	//newSysRec.prjLocation = rec[1];
	newSysRec.tutorNumber = req.body.tutornumber;
	newSysRec.tutorName = req.body.tutorname;
	newSysRec.tutorPhone = req.body.tutorcellphone;
	codedPassword = comutil.CodedPassword(req.body.tutorcellphone);
	newSysRec.tutorPassword = codedPassword;
	//newSysRec.workRecords = newWorkRec;
	newSysRec.workRecords = [];
	newSysRec.created = Date.now();

	mgdb.AddOneSysRecord(newSysRec, function(err, entity){
		if(err)
		{
			res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.addnewstudent,
		      		msg: comutil.msg.msg_error_addnewstudent + ': ' + err,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.super_addnewstudent_text,
                    breadhref: comutil.bread.super_addnewstudent_href,
		      		newpage:'/super_addnewstudent', 
		      		timeout:(comutil.redirect_timeout*2)
		      	});
		}
		else
		{
			res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.addnewstudent,
		      		msg: comutil.msg.msg_ok_addnewstudent,
		      		title: comutil.msg.title_ok, 
		      		smalltitle: comutil.msg.stitle_ok, 
		      		breadtext: comutil.bread.super_addnewstudent_text,
                    breadhref: comutil.bread.super_addnewstudent_href,
		      		newpage:'/super_viewmembers', 
		      		timeout:comutil.redirect_timeout
		      	});			
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: reset tutor password to cellphone
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
exports.ResetTutorPassword = function(req, res) {
	ResetPassword(req, res, comutil.userrole.tutor);
};

//////////////////////////////////////////////////////////////////
//function: reset student password to cellphone
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
exports.ResetStudentPassword = function(req, res) {
	ResetPassword(req, res, comutil.userrole.student);
};

//////////////////////////////////////////////////////////////////
//function: reset tutor or student password to cellphone
//parameters:  
//    @req
//    @res
//    @pass_flag: identify student or tutor
//
//return: null
//
//callback: null
//
//remarks: get cellphone by id and reset all password in database
//////////////////////////////////////////////////////////////////
var ResetPassword = function(req, res, pass_flag) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('ResetPassword id= ' + idStr);

	//check pass_flag
	if(pass_flag!=comutil.userrole.tutor && pass_flag!=comutil.userrole.student)
	{
		console.log('pass_flag error: ' + pass_flag);
		res.render('super_redirect_delay', 
		  	{
		  		act: comutil.sidebaract.super.viewmembers,
		  		msg: comutil.msg.msg_error_resetpassword, 
		  		title: comutil.msg.title_error, 
		  		smalltitle: comutil.msg.stitle_error_abnormal, 
		  		breadtext: comutil.bread.super_viewmembers_text,
                                                                breadhref: comutil.bread.super_viewmembers_href,
		  		newpage:'/super_viewmembers', 
		  		timeout:comutil.redirect_timeout
		  	});

		return;
	}

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, doc) {
		if(err)
		{
		  console.log('find id err=' + err.message);
		  res.render('super_redirect_delay', 
		  	{
		  		act: comutil.sidebaract.super.viewmembers,
		  		msg: comutil.msg_error_resetpassword, 
		  		title: comutil.msg.title_error, 
		  		smalltitle: comutil.msg.stitle_error_abnormal, 
		  		breadtext: comutil.bread.super_viewmembers_text,
                                                                breadhref: comutil.bread.super_viewmembers_href,
		  		newpage: '/super_viewmembers', 
		  		timeout: comutil.redirect_timeout
		  	});
		}
		else
		{
			if(doc)
			{
				var codedPass;
				if(pass_flag==comutil.userrole.tutor)
				{
					codedPass = comutil.CodedPassword(doc.tutorPhone);
					console.log('tutorPhone=' + doc.tutorPhone + '\tcodedPass=' + codedPass);					
				}					
				else
				{
					codedPass = comutil.CodedPassword(doc.stuPhone);
					console.log('stuPhone=' + doc.stuPhone + '\tcodedPass=' + codedPass);					
				}				

				var opt;
				if(pass_flag==comutil.userrole.tutor)
					opt = {'tutorNumber':doc.tutorNumber};
				else
					opt = {'stuNumber':doc.stuNumber};

				mgdb.FindAllbyOption(mgdb.ModelSysRecord, opt, function(err, docs) {
					if(err)
					{
						res.render('super_redirect_delay', 
							{
								act: comutil.sidebaract.super.viewmembers,
								msg: comutil.msg_error_resetpassword, 
						  		title: comutil.msg.title_error, 
						  		smalltitle: comutil.msg.stitle_error_abnormal, 
						  		breadtext: comutil.bread.super_viewmembers_text,
                                                                				breadhref: comutil.bread.super_viewmembers_href,
						  		newpage: '/super_viewmembers', 
						  		timeout: comutil.redirect_timeout
							});
					}
					else
					{
						if(docs)
						{
							for(var i=0; i<docs.length; i++)
							{
								if(pass_flag==comutil.userrole.tutor)
									docs[i].tutorPassword = codedPass;
								else
									docs[i].stuPassword = codedPass;

								docs[i].save(function(error) {
									if(error)
									{
										console.log('save err :' + i + error.message);

										res.render('super_redirect_delay', 
										  	{
										  		act: comutil.sidebaract.super.viewmembers,
												msg: comutil.msg.msg_error_savepassword, 
										  		title: comutil.msg.title_error, 
										  		smalltitle: comutil.msg.stitle_error_abnormal, 
										  		breadtext: comutil.bread.super_viewmembers_text,
                                                                								breadhref: comutil.bread.super_viewmembers_href,
										  		newpage: '/super_viewmembers', 
										  		timeout: comutil.redirect_timeout
										  	});

										return;
									}
									else
									{
										console.log('reset ' + i + 'ok!');
									}	
								});
							}

							var message;
							if(pass_flag==comutil.userrole.tutor)
									message = 'reset tutor(' + doc.tutorNumber + ') password to phone ' + doc.tutorPhone + ' ok!';
								else
									message = 'reset student(' + doc.stuNumber + ') password to phone ' + doc.stuPhone + ' ok!';

							res.render('super_redirect_delay', 
						  	{
						  		act: comutil.sidebaract.super.viewmembers,
						  		msg:message, 
					      		title: comutil.msg.title_ok, 
					      		smalltitle: comutil.msg.stitle_ok,
					      		breadtext: comutil.bread.super_viewmembers_text,
                                                                			breadhref: comutil.bread.super_viewmembers_href, 
					      		newpage:'/super_viewmembers', 
					      		timeout:comutil.redirect_timeout
						  	});
						}
						else
						{
							res.render('super_redirect_delay', 
								{
									act: comutil.sidebaract.super.viewmembers,
									msg: comutil.msg.msg_error_notfound, 
							  		title: comutil.msg.title_error, 
							  		smalltitle: comutil.msg.stitle_error_abnormal,
							  		breadtext: comutil.bread.super_viewmembers_text,
                                                                					breadhref: comutil.bread.super_viewmembers_href, 
							  		newpage: '/super_viewmembers', 
							  		timeout: comutil.redirect_timeout
								});
						}
					}
				});
			}
			else
			{
				res.render('/super_redirect_delay', 
				  	{
				  		act: comutil.sidebaract.super.viewmembers,
						msg: comutil.msg.msg_error_notfound, 
				  		title: comutil.msg.title_error, 
				  		smalltitle: comutil.msg.stitle_error_abnormal, 
				  		breadtext: comutil.bread.super_viewmembers_text,
                                                                		breadhref: comutil.bread.super_viewmembers_href,
				  		newpage: '/super_viewmembers', 
				  		timeout: comutil.redirect_timeout
				  	});
			}
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: show modify member information
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
exports.ModifyMemberById = function(req, res){

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('modify id= ' + idStr);
	
	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('super_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.super.viewmembers,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.super_viewmembers_text,
                                                                breadhref: comutil.bread.super_viewmembers_href,
		      		newpage:'/super_viewmembers', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				res.render('super_modify_member',
				  	{
				  		act: comutil.sidebaract.super.viewmembers,
				  		member:docs, 
						msg: comutil.msg.msg_modifymember, 
				  		title: comutil.msg.title_ok, 
				  		smalltitle: comutil.msg.stitle_ok,
				  		breadtext: comutil.bread.super_viewmembers_text,
                                                                		breadhref: comutil.bread.super_viewmembers_href,
				  		id:idStr
				  	});
			}
			else
			{
				console.log('not found!');
				res.render('super_redirect_delay', 
			  	    {
			  	    	act: comutil.sidebaract.super.viewmembers,
						msg: comutil.msg.msg_error_notfound, 
				  		title: comutil.msg.title_error, 
				  		smalltitle: comutil.msg.stitle_error_abnormal, 
				  		breadtext: comutil.bread.super_viewmembers_text,
                                                                		breadhref: comutil.bread.super_viewmembers_href,
				  		newpage: '/super_viewmembers', 
				  		timeout: comutil.redirect_timeout
			  	    });
			}			
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: do modify member information
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
exports.DoModifyMemberById = function(req, res) {

	console.log('id=' + req.body.modifyid + 
		        ' stuname= ' + req.body.stuname + 
		        ' stunumber= ' + req.body.stunumber + 
		        ' stucellphone= ' + req.body.stucellphone + 
		        ' prjname=' + req.body.prjname +
		        ' prjstartdate=' + req.body.prjstartdate +
		        ' prjstopdate=' + req.body.prjstopdate +
		        ' tutorname=' + req.body.tutorname +
		        ' tutornumber=' + req.body.tutornumber +
		        ' tutorcellphone=' + req.body.tutorcellphone 
		        );

	//check parameters
	//...

	mgdb.DoModifyById(
		mgdb.ModelSysRecord, 
		req.body.modifyid, 
		{
			stuName:req.body.stuname, 
			stuNumber:req.body.stunumber,
			stuPhone:req.body.stucellphone, 
			prjName:req.body.prjname,
			prjStartDate:req.body.prjstartdate,
			prjStopDate:req.body.prjstopdate,
			tutorNumber:req.body.tutornumber,
			tutorName:req.body.tutorname,
			tutorPhone:req.body.tutorcellphone
	    },
		function(err, stu){
			if(err)
			{
			  console.log('err=' + err.message);
			  res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.viewmembers,
		      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error,
		      		breadtext: comutil.bread.super_viewmembers_text,
                                                                breadhref: comutil.bread.super_viewmembers_href, 
		      		newpage:'/super_viewmembers', 
		      		timeout:comutil.redirect_timeout
			  	});
			}
			else
			{
			  res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.viewmembers,
		      		msg: comutil.msg.msg_ok_modifymember,
		      		title: comutil.msg.title_ok, 
		      		smalltitle: comutil.msg.stitle_ok, 
		      		breadtext: comutil.bread.super_viewmembers_text,
                                                                breadhref: comutil.bread.super_viewmembers_href,
		      		newpage:'/super_viewmembers', 
		      		timeout:comutil.redirect_timeout
			  	});
			}
		}
	);
};

exports.DbDump = function(req, res) {
	var timeString = comutil.GetTimeString(1);
	console.log('GetTimeString=' + timeString);
	//dump database
	//var cmdStr =  comutil.dump_dumpbin + ' -d ' + comutil.dump_dbname + ' -o ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + timeString;
	//dump collection
	var cmdStr =  comutil.dump_dumpbin + ' -d ' + comutil.dump_dbname + ' -c ' + comutil.sysrecord_collection_name + ' -o ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + timeString;
	console.log('cmdStr' + cmdStr);

	comutil.ExecCmd(cmdStr, function(err, stdout, stderr){
		if(err)
		{
			console.log('DbDump error: ' + err);
			res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatabackup,
			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
			      		title: comutil.msg.title_sysdump, 
			      		smalltitle: comutil.msg.stitle_sysdump,
			      		breadtext: comutil.bread.super_sysdatabackup_text,
                                                                	breadhref: comutil.bread.super_sysdatabackup_href, 
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
		}			
		else
		{
			if(stderr)
			{
				console.log('DbDump stderr: ' + stderr);
				res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatabackup,
			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
			      		title: comutil.msg.title_sysdump, 
			      		smalltitle: comutil.msg.stitle_sysdump, 
			      		breadtext: comutil.bread.super_sysdatabackup_text,
                                                                	breadhref: comutil.bread.super_sysdatabackup_href, 
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
			}				
			else
			{
				console.log('DbDump ok! ' + stdout);
				res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatabackup,
			      		msg: comutil.msg.msg_ok,
			      		title: comutil.msg.title_sysdump, 
			      		smalltitle: comutil.msg.stitle_sysdump, 
			      		breadtext: comutil.bread.super_sysdatabackup_text,
                                                                	breadhref: comutil.bread.super_sysdatabackup_href, 
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
			}
		}
	});
};

exports.ShowDbRestore = function(req, res) {
	
	var dirs = comutil.GetDirectories(comutil.dump_dir);
	var times = [];

	for(var i=0; i<dirs.length; i++)
	{
		var str = comutil.TimeStringToFormat(dirs[i]);
		times.push(str);
	}

	res.render('super_view_restore', 
      	{
      		act: comutil.sidebaract.super.sysdatarestore,
      		dirids: dirs,
      		dirs: times,
      		mbtn: comutil.mbtn_id_superrestorelog,
      		msg: comutil.msg.msg_viewrestore, 
      		title: comutil.msg.title_viewrestore, 
      		smalltitle: comutil.msg.stitle_viewrestore,
      		breadtext: comutil.bread.super_sysdatarestore_text,
            breadhref: comutil.bread.super_sysdatarestore_href
      	});
}

exports.DoDbRestore = function(req, res) {

	//need drop database first
	mgdb.RemoveDatabase(function(err, result){
		if(err)
		{
			console.log('RemoveDatabase error: ' + err);
			res.render('super_redirect_delay', 
	      	{
	      		act: comutil.sidebaract.super.sysdatarestore,
	      	    msg: comutil.msg.msg_error_abnormal + ' ' + err, 
	      	    title: comutil.msg.title_error, 
	      	    smalltitle: comutil.msg.stitle_error, 
	      	    breadtext: comutil.bread.super_sysdatarestore_text,
                breadhref: comutil.bread.super_sysdatarestore_href,
	      	    newpage: '/super_sysdatarestore', 
	      	    timeout: comutil.redirect_timeout
	      	});
		}
		else
		{
			console.log('DoDbRestore result: ' + result);
			dbRestore(req, res);
		}
	});
};

exports.DoDbCollectionRestore = function(req, res) {

	//need drop database first
	mgdb.RemoveCollection(comutil.sysrecord_collection_name, function(err, result){
		if(err)
		{
			console.log('RemoveCollections error: ' + err);
			res.render('super_redirect_delay', 
	      	{
	      		act: comutil.sidebaract.super.sysdatarestore,
	      	    msg: comutil.msg.msg_error_abnormal + ' ' + err, 
	      	    title: comutil.msg.title_error, 
	      	    smalltitle: comutil.msg.stitle_error, 
	      	    breadtext: comutil.bread.super_sysdatarestore_text,
                breadhref: comutil.bread.super_sysdatarestore_href,
	      	    newpage: '/super_sysdatarestore', 
	      	    timeout: comutil.redirect_timeout
	      	});
		}
		else
		{
			console.log('DoDbCollectionRestore result: ' + result);
			dbCollectionRestore(req, res);
		}
	});
};

var dbRestore = function(req, res){
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('DoDbRestore id= ' + idStr);

	var cmdStr =  comutil.dump_restorebin + ' -d ' + comutil.dump_dbname + ' --directoryperdb ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + idStr + '/' + comutil.dump_dbname;
	console.log('cmdStr' + cmdStr);

	comutil.ExecCmd(cmdStr, function(err, stdout, stderr){
		if(err)
		{
			console.log('DbRestore error: ' + err);
			res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatarestore,
			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
			      		title: comutil.msg.title_error, 
			      		smalltitle: comutil.msg.stitle_error, 
			      		breadtext: comutil.bread.super_sysdatarestore_text,
                                    			breadhref: comutil.bread.super_sysdatarestore_href,
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
		}			
		else
		{
			if(stderr)
			{
				console.log('DbRestore stderr: ' + stderr);
				res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatarestore,
			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
			      		title: comutil.msg.title_error, 
			      		smalltitle: comutil.msg.stitle_error, 
			      		breadtext: comutil.bread.super_sysdatarestore_text,
                                    			breadhref: comutil.bread.super_sysdatarestore_href,
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
			}				
			else
			{
				console.log('DbRestore ok! ' + stdout);
				res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatarestore,
			      		msg: comutil.msg.msg_ok,
			      		title: comutil.msg.title_ok, 
			      		smalltitle: comutil.msg.stitle_ok, 
			      		breadtext: comutil.bread.super_sysdatarestore_text,
                                    			breadhref: comutil.bread.super_sysdatarestore_href,
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
			}
		}
	});
};

var dbCollectionRestore = function(req, res){
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('dbCollectionRestore id= ' + idStr);

	var cmdStr =  comutil.dump_restorebin + ' -d ' + comutil.dump_dbname + ' -c ' + comutil.sysrecord_collection_name +
	 ' --drop ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + idStr + '/' + comutil.dump_dbname + '/' +
	  comutil.sysrecord_collection_name + '.bson';
	console.log('cmdStr' + cmdStr);

	comutil.ExecCmd(cmdStr, function(err, stdout, stderr){
		if(err)
		{
			console.log('dbCollectionRestore error: ' + err);
			res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatarestore,
			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
			      		title: comutil.msg.title_error, 
			      		smalltitle: comutil.msg.stitle_error, 
			      		breadtext: comutil.bread.super_sysdatarestore_text,
                                    			breadhref: comutil.bread.super_sysdatarestore_href,
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
		}			
		else
		{
			if(stderr)
			{
				console.log('dbCollectionRestore stderr: ' + stderr);
				res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatarestore,
			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
			      		title: comutil.msg.title_error, 
			      		smalltitle: comutil.msg.stitle_error, 
			      		breadtext: comutil.bread.super_sysdatarestore_text,
                                    			breadhref: comutil.bread.super_sysdatarestore_href,
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
			}				
			else
			{
				console.log('dbCollectionRestore ok! ' + stdout);
				res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatarestore,
			      		msg: comutil.msg.msg_ok,
			      		title: comutil.msg.title_ok, 
			      		smalltitle: comutil.msg.stitle_ok, 
			      		breadtext: comutil.bread.super_sysdatarestore_text,
                                    			breadhref: comutil.bread.super_sysdatarestore_href,
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
			}
		}
	});
};

exports.RemoveDatabase = function(req, res) {

	console.log('RemoveDatabase!');

	mgdb.RemoveDatabase(function(err, result){
		if(err)
		{
			console.log('RemoveDatabase error: ' + err);
			res.render('super_redirect_delay', 
	      	{
	      		act: comutil.sidebaract.super.sysdatarestore,
	      	    msg: comutil.msg.msg_error + ': ' + err, 
	      	    title: comutil.msg.title_error, 
	      	    smalltitle: comutil.msg.stitle_sysinit,
	      	    breadtext: comutil.bread.super_sysdatarestore_text,
		        breadhref: comutil.bread.super_sysdatarestore_href, 
	      	    newpage: '/super_sysdatarestore', 
	      	    timeout: comutil.redirect_timeout
	      	});
		}
		else
		{
			console.log('RemoveDatabase result: ' + result);
			res.render('super_redirect_delay', 
	      	{
	      		act: comutil.sidebaract.super.sysdatarestore,
	      	    msg: comutil.msg.msg_ok, 
	      	    title: comutil.msg.title_ok, 
	      	    smalltitle: comutil.msg.stitle_ok,
	      	    breadtext: comutil.bread.super_sysdatarestore_text,
		        breadhref: comutil.bread.super_sysdatarestore_href, 
	      	    newpage: '/super_sysdatarestore', 
	      	    timeout: comutil.redirect_timeout
	      	});
		}
	});

};

exports.RemoveCollection = function(req, res) {

	console.log('RemoveCollection!');

	mgdb.RemoveCollection(comutil.sysrecord_collection_name, function(err, result){
		if(err)
		{
			console.log('RemoveCollection error: ' + err);
			res.render('super_redirect_delay', 
	      	{
	      		act: comutil.sidebaract.super.sysdatarestore,
	      	    msg: comutil.msg.msg_error + ': ' + err, 
	      	    title: comutil.msg.title_error, 
	      	    smalltitle: comutil.msg.stitle_sysinit,
	      	    breadtext: comutil.bread.super_sysdatarestore_text,
		        breadhref: comutil.bread.super_sysdatarestore_href, 
	      	    newpage: '/super_sysdatarestore', 
	      	    timeout: comutil.redirect_timeout
	      	});
		}
		else
		{
			console.log('RemoveCollection result: ' + result);
			res.render('super_redirect_delay', 
	      	{
	      		act: comutil.sidebaract.super.sysdatarestore,
	      	    msg: comutil.msg.msg_ok, 
	      	    title: comutil.msg.title_ok, 
	      	    smalltitle: comutil.msg.stitle_ok,
	      	    breadtext: comutil.bread.super_sysdatarestore_text,
		        breadhref: comutil.bread.super_sysdatarestore_href, 
	      	    newpage: '/super_sysdatarestore', 
	      	    timeout: comutil.redirect_timeout
	      	});
		}
	});

};

exports.DeleteSysRecord = function(req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('DeleteSysRecord id= ' + idStr);

	mgdb.DeleteById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
		  console.log('remove error!');
		  res.render('super_redirect_delay', 
		  	{
		  		act: comutil.sidebaract.super.viewmembers,
				msg: comutil.msg.msg_error_abnormal, 
				title: comutil.msg.title_error, 
				smalltitle: comutil.msg.stitle_error,
				breadtext: comutil.bread.super_viewmembers_text,
                                    		breadhref: comutil.bread.super_viewmembers_href,
				newpage:'/super_viewmembers',
				timeout:comutil.redirect_timeout
		  	});
		}
		else
		{
		  res.redirect('/super_viewmembers');
		}		
	});
};

exports.querytutor = function(req, res){
	console.log('query all!');
	
	mgdb.DoQueryAll(mgdb.ModelTutor, function(err, docs){
		if(!err)
		{
			console.log(docs);
			//for(stu, index in docs)
			for(i=0; i<docs.length;i++)
			{
				console.log('username= ' + docs[i].username);
			}
			res.render('super_querytutorresult', 
				{tutors:docs, 
				act:2, 
				title:'Query Tutors', 
				smalltitle:'supervisor may query tutors here'});
		}
		else
		{
			throw err;
			res.render('super_redirect_delay', {msg:'query tutor error!', newpage:'/supervisor_admin', timeout:3000});
		}
	})
};

exports.doquery = function(req, res){
	//var query = Student.findOne({'name':'p1'});
	/*
	var query = Student.find();
	query.exec(function(err, stus){
		if(err) 
		    console.log('findOne error!');
		else
		{
		    for (i=0; i<stus.length;i++)
		    {
		        console.log('name= ' + stus[i].name);	
		    }		        
		}
	})
	//*/
	/*
	Student.find(
		{},
		function(err, docs){
			if(!err)
			{
				console.log(docs);
				//for(stu, index in docs)
				for(i=0; i<docs.length;i++)
				{
					console.log('name= ' + docs[i].name);
				}
				res.render('querystudentresult', {students:docs});
			}
			else
			{
				throw err;
				res.send('not found!');
			}
		});
	//*/

    if(req.body.cellphone!="")
    {
    	console.log('cellphone not empty!');

    	Student.find({'cellphone':req.body.cellphone})
    	.where('name').equals(req.body.name)
    	.exec(function(err, docs){
    		if(!err)
    		{
    			console.log('not error docs.length=' + docs.length);

    			if(docs.length==0)
    			{
    				res.send('not found!');
    			}
    			else
    			{
    				console.log('found!');
    				console.log(docs);
    				//for(stu, index in docs)
					for(i=0; i<docs.length;i++)
					{
						console.log('name= ' + docs[i].name);
					}
					res.render('querystudentresult', {students:docs});

    			}				
    		}
    		else
			{
				console.log('error! not found?');
				res.send('not found!');
				throw err;				
			}
    	})
    }
    else
    {
    	console.log('cellphone empty!');
/*
    	Student.find(
		{},
		function(err, docs){
			if(!err)
			{
				console.log(docs);
				//for(stu, index in docs)
				for(i=0; i<docs.length;i++)
				{
					console.log('name= ' + docs[i].name);
				}
				res.render('querystudentresult', {students:docs});
			}
			else
			{
				throw err;
				res.send('not found!');
			}
		});
*/
	mgdb.DoQueryAll(mgdb.ModelStudent, function(err, docs){
		if(!err)
		{
			console.log(docs);
			//for(stu, index in docs)
			for(i=0; i<docs.length;i++)
			{
				console.log('name= ' + docs[i].name);
			}
			res.render('querystudentresult', {students:docs});
		}
		else
		{
			throw err;
			res.send('not found!');
		}
	})
    }
};
