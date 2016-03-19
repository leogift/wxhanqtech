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




//////////////////////////////////////////////////////////////////
//function: show page for modification of the administratro password
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

//////////////////////////////////////////////////////////////////
//function: do the modification of the administratro password
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
		console.log('root password error:' + rootPass);

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
				//without administrator , then add new
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
						console.log('add administrator ok!');
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


//////////////////////////////////////////////////////////////////
//function: show page for password modification of the super own
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

//////////////////////////////////////////////////////////////////
//function: do password modification of the super own
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
exports.DoSuperModifyPassword = function(req, res) {
	
	var oldPass = req.body.oldpassword.trim();
	var newPass = req.body.password.trim();

	console.log('username:' + req.session.user);
	console.log('oldpassword:' + oldPass);
	console.log('newpassword:' + newPass);

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
				var codedPass = comutil.CodedPassword(oldPass);
				if(codedPass==docs.adminPass)
				{
					var newCodedPass = comutil.CodedPassword(newPass);

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

//////////////////////////////////////////////////////////////////
//function: click the menu to view worklog
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
exports.ViewSysWorklog = function(req, res) {

	mgdb.GetPrjUniqueName(mgdb.ModelSysRecord, {}, function(prjs){

		console.log('prjNames=');
		console.log(prjs);

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
	        prjNames: prjs,
      		LinkDelete: comutil.link.super_queryresult_delete,
      		LinkDetail: comutil.link.super_queryresult_detail,
      		LinkExport: comutil.link.super_queryresult_export
      	});

	});
	
};

//////////////////////////////////////////////////////////////////
//function: response for the query btn
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: 有条件与无条件竟然不能合一
//////////////////////////////////////////////////////////////////
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
					mgdb.GetPrjUniqueName(mgdb.ModelSysRecord, {}, function(prjs){

						console.log('prjNames=');
						console.log(prjs);

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
					        prjNames: prjs,
					        LinkDelete: comutil.link.super_queryresult_delete,
					        LinkDetail: comutil.link.super_queryresult_detail,
					        LinkExport: comutil.link.super_queryresult_export
				      	});

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

					mgdb.GetPrjUniqueName(mgdb.ModelSysRecord, {}, function(prjs){

						console.log('prjNames=');
						console.log(prjs);

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
					        prjNames: prjs,
					        LinkDelete: comutil.link.super_queryresult_delete,
					        LinkDetail: comutil.link.super_queryresult_detail,
					        LinkExport: comutil.link.super_queryresult_export
				      	});

					});

				}
		});
	}
};

//////////////////////////////////////////////////////////////////
//function: response for the view worklog details
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
				  		weixin_id: docs.stuWeixin_id,
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

//////////////////////////////////////////////////////////////////
//function: 归档按钮响应
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
exports.PrjArchive = function(req, res) {
	exportlogs.PrjArchive(req, res);
};

//////////////////////////////////////////////////////////////////
//function: 解除归档按钮响应
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
exports.PrjUnArchive = function(req, res) {
	
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('PrjUnArchive id= ' + idStr);

	//get prj name by id
	mgdb.FindOneById(mgdb.ModelPrjInfo, idStr, function(err, data){
		if(err)
		{
			console.log('PrjArchive abnormal error!');
			res.render('super_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.super.viewprjs,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.super_viewprjs_text,
		      		breadhref: comutil.bread.super_viewprjs_href,
		      		newpage: '/super_viewprjs', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(data)
			{
				//set Expired flag and filepath
				data.prjExpired = false;
				data.prjFilePath = "";
				data.save();

				//get student numbers
				var prjName = data.prjName;
				console.log('prjName=' + prjName);

				mgdb.FindAllbyOption(mgdb.ModelSysRecord, {prjName:prjName}, function(err, docs){
					if(err)
					{
						console.log(err);
						res.render('super_redirect_delay', 
				  	    {
				  	    	act: comutil.sidebaract.super.viewprjs,
				      		msg: comutil.msg.msg_error_abnormal + err,
				      		title: comutil.msg.title_error, 
				      		smalltitle: comutil.msg.stitle_error, 
				      		breadtext: comutil.bread.super_viewprjs_text,
				      		breadhref: comutil.bread.super_viewprjs_href,
				      		newpage: '/super_viewprjs', 
				      		timeout:comutil.redirect_timeout
				  	    });
					}
					else
					{
						if(!docs)
						{
							console.log(err);
							res.render('super_redirect_delay', 
					  	    {
					  	    	act: comutil.sidebaract.super.viewprjs,
					      		msg: comutil.msg.msg_error_abnormal + ' ' + prjName + ' not found!',
					      		title: comutil.msg.title_error, 
					      		smalltitle: comutil.msg.stitle_error, 
					      		breadtext: comutil.bread.super_viewprjs_text,
					      		breadhref: comutil.bread.super_viewprjs_href,
					      		newpage: '/super_viewprjs', 
					      		timeout:comutil.redirect_timeout
					  	    });
						}
						else
						{
							var len = docs.length;
							console.log('len=' + len);
							for(var i=0; i<len; i++)
							{
								docs[i].prjExpired = false;
								docs[i].stuWeixinBind = docs[i].stuWeixinBind_backup;
								docs[i].stuWeixin_id = docs[i].stuWeixin_id_backup;
								docs[i].save();
							}

							res.render('super_redirect_delay', 
							  	{
							  		act: comutil.sidebaract.super.viewprjs,
							  	    msg: comutil.msg.msg_ok, 
							  	    title: comutil.msg.title_ok, 
							  	    smalltitle: comutil.msg.stitle_ok, 
							  	    breadtext: comutil.bread.super_viewprjs_text,
							        breadhref: comutil.bread.super_viewprjs_href,
							  	    newpage: '/super_viewprjs', 
							  	    timeout: comutil.redirect_timeout
							  	});

						}
					}
					
				});
            }
		
		}
	});

};

//////////////////////////////////////////////////////////////////
//function: 工作日志导出
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
exports.SyslogExport = function(req, res) {
	exportlogs.SysWorklogExport(req, res, comutil.userrole.super);
};

//////////////////////////////////////////////////////////////////
//function: 工作日志清除
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: 清除日志，而不删除该成员信息
//////////////////////////////////////////////////////////////////
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
//function: just show SysInit page (数据导入)
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

	// delete old data, now not delete but append
	// ...

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

//////////////////////////////////////////////////////////////////
//function: 数据导入
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: 支持多个文件，但测试有问题，只在前端限制，一次一个文件
//////////////////////////////////////////////////////////////////
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

	        //这个callback是在存入每一行就调用一次
			xlsx.XlsxToDb(target_path, function(err){ 
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
			        console.log('save ok!');
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

			        setTimeout(function(){AddPrjInfo();}, 10000);
			    }
			});
            
            //setTimeout(function(){AddPrjInfo();}, 10000);
            //AddPrjInfo();

	    }
	}

};

exports.MakeArchive = function(req, res) {
	
	var prjName = req.params.id.substr(1, req.params.id.length-1);
	console.log('MakeArchive prjName= ' + prjName);

	var prjSrcDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir + '/' + prjName;
	var prjArchiveFile = prjSrcDir + '.tar.gz';

	console.log('prjSrcDir=' + prjSrcDir + ' prjArchiveFile=' + prjArchiveFile);

	try
	{
		comutil.DirToZip('./public/download/prj1', './public/download/prj1.tar.gz');
	}
	catch(err)
	{
		res.render('super_redirect_delay', 
	      	{
	      		act: comutil.sidebaract.super.viewprjs,
	      	    msg: comutil.msg.msg_error + ': ' + err, 
	      	    title: comutil.msg.title_error, 
	      	    smalltitle: comutil.msg.stitle_viewprjs, 
	      	    breadtext: comutil.bread.super_viewprjs_text,
                breadhref: comutil.bread.super_viewprjs_href,
	      	    newpage: '/super_viewprjs', 
	      	    timeout: (comutil.redirect_timeout*2)
	      	});

		return;
	}

	res.render('super_redirect_delay', 
	  	{
	  		act: comutil.sidebaract.super.viewprjs,
	  	    msg: comutil.msg.msg_ok, 
	  	    title: comutil.msg.title_ok, 
	  	    smalltitle: comutil.msg.stitle_ok, 
	  	    breadtext: comutil.bread.super_viewprjs_text,
	        breadhref: comutil.bread.super_viewprjs_href,
	  	    newpage: '/super_viewprjs', 
	  	    timeout: comutil.redirect_timeout
	  	});

};

//////////////////////////////////////////////////////////////////
//function: 将数组中的prjName，入库
//parameters:  
//    @prj_names: array of prjNames
//
//return: null
//
//callback: null
//
//remarks: 递归函数，这是保证同步的办法，用for循环的方式不行，传递给函数时，i早就变成最后一个了
//////////////////////////////////////////////////////////////////
var RescursiveFind = function (prj_names) {

	var len = prj_names.length;

	if(len==0)
	{
		console.log('recursive end!');
		return;
	}

	var prjName = prj_names.pop();
	console.log('len=' + len + ' prjName=' + prjName);

	mgdb.ModelSysRecord.findOne({'prjName': prjName}, function(err, data){
		if(err)
		{
			console.log('error=' + err);
		}
		else
		{
			if(data)
			{
				console.log('prjName=' + prjName);
				console.log('len=' + len);
				console.log('prjStartDate' + data.prjStartDate);
				console.log('prjStopDate' + data.prjStopDate);

				//add to db
				AddPrjInfoToDb(prjName, data.prjStartDate, data.prjStopDate);

				//recursive
				RescursiveFind(prj_names);
			}
		}

	});

};

//////////////////////////////////////////////////////////////////
//function: 数据导入后，查询数据库，获取prjName信息，并加入到prjInfo数据表中
//parameters:  
//    @null
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
var AddPrjInfo = function(){

	console.log('AddPrjInfo start!');

	//mgdb.ModelSysRecord.distinct('prjName', {prjExpired:false}, function(err, docs){
	mgdb.ModelSysRecord.distinct('prjName', {}, function(err, docs){

		if(err)
		{
			console.log(err);
		}
		else
		{
			if(docs)
			{
				var len = docs.length;
				console.log('distinct prjName is ' + docs.length);
				console.log(docs);

				RescursiveFind(docs);

			}
		}
	});

	
};

//////////////////////////////////////////////////////////////////
//function: 项目信息入库
//parameters:  
//    @prjName: prj name
//    @prjStartDate: prj start date
//    @prjStopDate: prj stop date
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
var AddPrjInfoToDb = function(prjName, prjStartDate, prjStopDate){

	var newPrjInfo = new mgdb.ModelPrjInfo();
	newPrjInfo.prjName = prjName;
	newPrjInfo.prjStartDate = prjStartDate;
	newPrjInfo.prjStopDate = prjStopDate;
	newPrjInfo.prjExpired = false;
	newPrjInfo.prjFilePath = '';
	newPrjInfo.created = Date.now();

	//function name is SysRecord, but the function is ok!
	mgdb.AddOneSysRecord(newPrjInfo, function(err, entity){
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log('AddPrjInfoToDb ok:' + entity); 	
		}
	});

};

//////////////////////////////////////////////////////////////////
//function: view prj info
//parameters:  
//    @req: 
//    @res: 
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
exports.ViewPrjs = function(req, res) {

	//mgdb.ModelPrjInfo.find({}, null, {sort:[['prjName', 1]]}, function(err, docs){
	mgdb.ModelPrjInfo.find({}, null, {sort:[['created', 1]]}, function(err, docs){
		if(err)
		{
			res.render('super_redirect_delay', 
		      	{
		      		act: comutil.sidebaract.super.viewprjs,
		      		msg: comutil.msg.msg_error_abnormal, 
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
			res.render('super_query_prj_result', 
		      	{
		      		act: comutil.sidebaract.super.viewprjs,
		      		prjs: docs,
		      		msg: comutil.msg.msg_result, 
		      		title: comutil.msg.title_viewprjs, 
		      		smalltitle: ('   ' + comutil.msg.stitle_viewprjs), 
		      		breadtext: comutil.bread.super_viewprjs_text,
			        breadhref: comutil.bread.super_viewprjs_href,
		      		//newpage: '/super_sysinit', 
		      		//timeout: comutil.redirect_timeout
		      	});
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: response the click of refresh data in restore menu
//parameters:  
//    @req: 
//    @res: 
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
exports.RefreshPrjInfo = function(req, res) {

	RefreshPrjInfoCollection();

	res.render('super_redirect_delay', 
  	{
  		act: comutil.sidebaract.super.viewprjs,
  		msg: comutil.msg.msg_wait, 
  		title: comutil.msg.msg_wait, 
  		smalltitle: comutil.msg.msg_wait, 
  		breadtext: comutil.bread.super_viewprjs_text,
        breadhref: comutil.bread.super_viewprjs_href,
  		newpage: '/super_viewprjs', 
  		timeout: comutil.redirect_timeout*2
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
		      		msg: comutil.msg.msg_error_abnormal, 
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
	newSysRec.stuNumber = req.body.stunumber.trim();
	newSysRec.stuName = req.body.stuname.trim();
	newSysRec.stuPhone = req.body.stucellphone.trim();
	var codedPassword = comutil.CodedPassword(req.body.stucellphone.trim());
	newSysRec.stuPassword = codedPassword;

	newSysRec.stuWeixin_id = comutil.default_weixinid;
	newSysRec.stuWeixin_id_backup = comutil.default_weixinid;
	newSysRec.stuWeixinBind = false;
	newSysRec.stuWeixinBind_backup = false;
	newSysRec.stuLoginFlag = true;
	newSysRec.prjName = req.body.prjname;

	newSysRec.prjExpired = false;
	newSysRec.prjStartDate = req.body.prjstartdate;
	newSysRec.prjStopDate = req.body.prjstopdate;
	
	//newSysRec.prjDesc = rec[1];
	//newSysRec.prjLocation = rec[1];
	newSysRec.tutorNumber = req.body.tutornumber.trim();
	newSysRec.tutorName = req.body.tutorname.trim();
	newSysRec.tutorPhone = req.body.tutorcellphone.trim();
	codedPassword = comutil.CodedPassword(req.body.tutorcellphone.trim());
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
			stuName:req.body.stuname.trim(), 
			stuNumber:req.body.stunumber.trim(),
			stuPhone:req.body.stucellphone.trim(), 
			prjName:req.body.prjname.trim(),
			prjStartDate:req.body.prjstartdate.trim(),
			prjStopDate:req.body.prjstopdate.trim(),
			tutorNumber:req.body.tutornumber.trim(),
			tutorName:req.body.tutorname.trim(),
			tutorPhone:req.body.tutorcellphone.trim()
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

//////////////////////////////////////////////////////////////////
//function: show modify prjinfo information
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
exports.ModifyPrjById = function(req, res){

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('modify id= ' + idStr);
	
	mgdb.FindOneById(mgdb.ModelPrjInfo, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render('super_redirect_delay', 
		  	    {
		  	    	act: comutil.sidebaract.super.viewprjs,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: comutil.bread.super_viewprjs_text,
                    breadhref: comutil.bread.super_viewprjs_href,
		      		newpage:'/super_viewprjs', 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				res.render('super_modify_prj',
				  	{
				  		act: comutil.sidebaract.super.viewprjs,
				  		prj:docs, 
						msg: comutil.msg.msg_modifyprj, 
				  		title: comutil.msg.title_ok, 
				  		smalltitle: comutil.msg.stitle_ok,
				  		breadtext: comutil.bread.super_viewprjs_text,
                        breadhref: comutil.bread.super_viewprjs_href,
				  		id:idStr
				  	});
			}
			else
			{
				console.log('not found!');
				res.render('super_redirect_delay', 
			  	    {
			  	    	act: comutil.sidebaract.super.viewprjs,
						msg: comutil.msg.msg_error_notfound, 
				  		title: comutil.msg.title_error, 
				  		smalltitle: comutil.msg.stitle_error_abnormal, 
				  		breadtext: comutil.bread.super_viewprjs_text,
                        breadhref: comutil.bread.super_viewprjs_href,
				  		newpage: '/super_viewprjs', 
				  		timeout: comutil.redirect_timeout
			  	    });
			}			
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: do modify prj information
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
exports.DoModifyPrjById = function(req, res) {

	var newPrjName = req.body.prjnewname.trim();

	console.log('id=' + req.body.modifyid + 
		        ' prjoldname=' + req.body.prjoldname +
		        ' prjnewname=' + req.body.prjnewname +
		        ' prjstartdate=' + req.body.prjstartdate +
		        ' prjstopdate=' + req.body.prjstopdate
		        );

	//check date error, stop < start
	//...

	mgdb.DoModifyById(
		mgdb.ModelPrjInfo, 
		req.body.modifyid, 
		{
			prjName:newPrjName,
			prjStartDate:req.body.prjstartdate,
			prjStopDate:req.body.prjstopdate,
	    },
		function(err, prjInfo){
			if(err)
			{
			  console.log('err=' + err);
			  res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.viewprjs,
		      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error,
		      		breadtext: comutil.bread.super_viewprjs_text,
                    breadhref: comutil.bread.super_viewprjs_href, 
		      		newpage:'/super_viewprjs', 
		      		timeout:comutil.redirect_timeout
			  	});

			  return;
			}
			else
			{
			  res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.viewprjs,
		      		msg: comutil.msg.msg_ok_modifyprj,
		      		title: comutil.msg.title_ok, 
		      		smalltitle: comutil.msg.stitle_ok, 
		      		breadtext: comutil.bread.super_viewprjs_text,
                    breadhref: comutil.bread.super_viewprjs_href,
		      		newpage:'/super_viewprjs', 
		      		timeout:comutil.redirect_timeout
			  	});
			}
		}
	);
    
    //multiple update
    console.log('batch update...');
    mgdb.ModelSysRecord.update(
    	{prjName:req.body.prjoldname}, 
    	{prjName: newPrjName, prjStartDate: req.body.prjstartdate, prjStopDate: req.body.prjstopdate},
    	{multi: true},
    	function(err, numberAffected, raw){
    		if(err)
    			console.log(err);
    		else
    			console.log('numberAffected=' + numberAffected);
    	});


};

// var DatabaseBackup = function (req, res, bNeedWebResponse) {

// 	var timeString = comutil.GetTimeString(1);
// 	console.log('GetTimeString=' + timeString);
	
// 	//dump database
// 	//var cmdStr =  comutil.dump_dumpbin + ' -d ' + comutil.dump_dbname + ' -o ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + timeString;
	
// 	//now, dump collection
// 	var cmdStr =  comutil.dump_dumpbin + ' -d ' + comutil.dump_dbname + ' -c ' + comutil.sysrecord_collection_name + ' -o ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + timeString;
// 	console.log('cmdStr' + cmdStr);

// 	comutil.ExecCmd(cmdStr, function(err, stdout, stderr){
// 		if(err)
// 		{
// 			console.log('DbDump error: ' + err);

// 			if(bNeedWebResponse)
// 			{
// 				res.render('super_redirect_delay', 
// 			  	{
// 			  		act: comutil.sidebaract.super.sysdatabackup,
// 			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
// 			      		title: comutil.msg.title_sysdump, 
// 			      		smalltitle: comutil.msg.stitle_sysdump,
// 			      		breadtext: comutil.bread.super_sysdatabackup_text,
//                         breadhref: comutil.bread.super_sysdatabackup_href, 
// 			      		newpage:'/super_sysdatarestore', 
// 			      		timeout:comutil.redirect_timeout
// 			  	});
// 			}			
// 		}			
// 		else
// 		{
// 			if(stderr)
// 			{
// 				console.log('DbDump stderr: ' + stderr);
// 				if(bNeedWebResponse)
// 				{
// 					res.render('super_redirect_delay', 
// 				  	{
// 				  		act: comutil.sidebaract.super.sysdatabackup,
// 				      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
// 				      		title: comutil.msg.title_sysdump, 
// 				      		smalltitle: comutil.msg.stitle_sysdump, 
// 				      		breadtext: comutil.bread.super_sysdatabackup_text,
// 	                        breadhref: comutil.bread.super_sysdatabackup_href, 
// 				      		newpage:'/super_sysdatarestore', 
// 				      		timeout:comutil.redirect_timeout
// 				  	});
// 				}	
// 			}
// 			else
// 			{
// 				console.log('DbDump ok! ' + stdout);
// 				if(bNeedWebResponse)
// 				{
// 					res.render('super_redirect_delay', 
// 				  	{
// 				  		act: comutil.sidebaract.super.sysdatabackup,
// 				      		msg: comutil.msg.msg_ok,
// 				      		title: comutil.msg.title_sysdump, 
// 				      		smalltitle: comutil.msg.stitle_sysdump, 
// 				      		breadtext: comutil.bread.super_sysdatabackup_text,
// 	                        breadhref: comutil.bread.super_sysdatabackup_href, 
// 				      		newpage:'/super_sysdatarestore', 
// 				      		timeout:comutil.redirect_timeout
// 				  	});

// 				}
				
// 			}
// 		}
// 	});

// };

//////////////////////////////////////////////////////////////////
//function: backup data
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
exports.DbDump = function(req, res) {
	
	mgdb.DatabaseBackup(req, res, true);
};

//////////////////////////////////////////////////////////////////
//function: show data restore page
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
exports.ShowDbRestore = function(req, res) {
	
	//it is bugs here! the dir in dump_dir must has strict format
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

//////////////////////////////////////////////////////////////////
//function: recover database
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: remove db and restore it
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
//function: recover data collection
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: remove collection and restore it
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
//function: recover database
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
//function: recover data collection
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
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

			  	//reset prjInfo collection
			  	RefreshPrjInfoCollection();
			}
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: refresh prjinfo collection
//parameters:  
//    @null:  
//
//return: null
//
//callback: null
//
//remarks: remove collection then fill it by sysworklogs collection
//////////////////////////////////////////////////////////////////
var RefreshPrjInfoCollection = function(){

	//clear prjInfo collection
  	console.log('reset prjInfo collection!');
  	mgdb.RemoveCollection(comutil.prjinfo_collection_name, function(err, result){
  		if(err)
  			console.log(err);
  		else
  		{
  			//restore prjInfo db
  			AddPrjInfo();
  		}
  	});
}; 

//////////////////////////////////////////////////////////////////
//function: remove database
//parameters:  
//    @req: 
//    @res: 
//
//return: null
//
//callback: null
//
//remarks: remove database contains all collections
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
//function: remove collection
//parameters:  
//    @req: 
//    @res: 
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
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

//////////////////////////////////////////////////////////////////
//function: delete sysrecord
//parameters:  
//    @req: 
//    @res: 
//
//return: null
//
//callback: null
//
//remarks: 
//////////////////////////////////////////////////////////////////
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

