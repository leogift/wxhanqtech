/*******************************************************************************************
Filename    :userlogin.js
Summary     :check student and tutor login
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



//////////////////////////////////////////////////////////////////
//function: show login page if get('/') or get('index.html')
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
exports.ShowLogin = function(req, res){
	res.redirect(comutil.userLoginPage);
}

//////////////////////////////////////////////////////////////////
//function: show login page if get('/') or get('index.html')
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
exports.Check = function(req, res){
	console.log('username= ' + req.body.username 
		+ ' password= ' + req.body.password 
		+ ' user role= ' + req.body.RoleRadios);

	var codedpass = comutil.CodedPassword(req.body.password);
	CheckLogin(req, res, req.body.RoleRadios, codedpass);
};

//////////////////////////////////////////////////////////////////
//function: show login page if get('/') or get('index.html')
//parameters:  
//    @req
//    @res
//    @flag: 'student' or 'tutor'
//    @codedpass: coded password
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
var CheckLogin = function(req, res, flag, codedpass) {
	console.log('in CheckLogin, flag=' + flag);

	//check flag
	var okPage;
	var errPage;
	var opt = {};

	if(flag==comutil.userrole.tutor)
	{
		okPage = 'tutor_viewstudents';
		errPage = 'tutor_redirect_delay';
		opt = {tutorNumber:req.body.username, prjExpired:false};
	}
	else if(flag==comutil.userrole.student)
	{
		okPage = 'student_modifyselfinfo';
		errPage = 'student_redirect_delay';
		opt = {stuNumber:req.body.username, prjExpired:false};
	}
	else
	{
		res.render('student_redirect_delay', 
			{
				msg: comutil.msg.msg_error_role,
				title: comutil.msg.title_error, 
				smalltitle: comutil.msg.stitle_error_abnormal, 
				newpage: comutil.userLoginPage, 
				timeout:comutil.redirect_timeout
			});

		return;
	}

	//get and check password
	mgdb.CheckPassword(mgdb.ModelSysRecord, flag, req.body.username, codedpass, function(err){
		console.log('query password result:' + err);		

		if(err=='ok')
		{
			//check prj expired or not

			mgdb.FindAllbyOption(mgdb.ModelSysRecord, opt, function(err, docs){

				if(err)
				{
					console.log(err);
					res.render(errPage, 
					{
						msg:err,
						title: comutil.msg.title_error, 
						smalltitle: comutil.msg.stitle_error_abnormal, 
						newpage: comutil.userLoginPage, 
						timeout:comutil.redirect_timeout
					});
				}
				else
				{
					if(docs.length>0)
					{
						console.log('docs exist!?');
						console.log(docs);

						req.session.regenerate(function(){
							req.session.role = flag; // 'tutor' or 'student'
							req.session.user = req.body.username;				
							res.redirect(okPage);
						});

					}
					else
					{
						res.render(errPage, 
						{
							msg:'可能您当前不属于任何一个未归档的项目',
							title: comutil.msg.title_error, 
							smalltitle: comutil.msg.stitle_error_abnormal, 
							newpage: comutil.userLoginPage, 
							timeout:comutil.redirect_timeout*2
						});
					}
				}

			});
			
		}
		else
		{
			res.render(errPage, 
				{
					msg:err,
					title: comutil.msg.title_error, 
					smalltitle: comutil.msg.stitle_error_abnormal, 
					newpage: comutil.userLoginPage, 
					timeout:comutil.redirect_timeout
				});
		}
	});
};

//////////////////////////////////////////////////////////////////
//function: check if has been login or not
//parameters:  
//    @req
//    @res
//    @next: message passed to next
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.Restrict = function (req, res, next){
	if(req.session.user && (req.session.role==comutil.userrole.tutor || req.session.role==comutil.userrole.student) )
	{
		next();
	}
	else
	{
		req.session.error = 'Access Denied!';
		res.render('student_redirect_delay', 
			{
				msg: comutil.msg.msg_accessdeny,
				title: comutil.msg.title_accessdeny, 
				smalltitle: comutil.msg.stitle_accessdeny, 
				newpage: comutil.userLoginPage,
				timeout:comutil.redirect_timeout
			});
	}
}

//////////////////////////////////////////////////////////////////
//function: logout
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
exports.Logout = function (req, res){
	req.session.destroy(function(){
		res.redirect(comutil.userLoginPage);
	});
};

