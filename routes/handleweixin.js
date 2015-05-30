
/*
 * GET home page.
 */

var mgdb = require('../model/mgdb');
var comutil = require('../model/commonutils');
var crypto = require('crypto');
var url = require('url');

var wechat = require('../model/wechatleo/wechat/wechat.js');
var usrMsgHandler = require('../model/wechatleo/johnnyMsgHandler.js');



exports.handle = function(req, res){

	var path = url.parse(req.url).pathname;
	
	if (path.indexOf('/wechat') == 0)
	{
		console.log("wechat");
		wechat.process(req, res, usrMsgHandler);
	}
	else
	{
		console.log("else");
	}
};

exports.WeixinRegister = function(req, res) {

	
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('WeiXinRegister id= ' + idStr);

	mgdb.GetPrjUniqueName(mgdb.ModelSysRecord, function(prjs){

		console.log('prjNames=');
		console.log(prjs);

		res.render('student_wx_reg',
		  	{
		  		weixin_id: idStr,
		  		prjNames: prjs
		  	}
		  );
	});
};

exports.StuSubscribe = function(req, res){
	
	var stuNumber = req.body.stunumber.trim();
	//var nowDate = Date.now();

	console.log('StuSubscribe:\n' +
		'stunumber=' + stuNumber + '\n' +
		'prjName=' + req.body.selectedPrjName + '\n' +
		'weixin_id=' + req.body.weixinid);

	if(stuNumber=='')
	{
		//res.send('学号不能为空!');
		res.render('subscribe_result',
		  	{resultMsg:'学号不能为空!'}
		  );
	}
	else if(req.body.selectedPrjName=='')
	{
		res.render('subscribe_result',
		  	{resultMsg:'项目名称为空，可能您当前不属于任何一个未归档的项目!'}
		  );
	}
	else if(req.body.weixinid=='')
	{
		//res.send('微信号异常!');
		res.render('subscribe_result',
		  	{resultMsg:'微信号异常!'}
		  );
	}
	else
	{
	    mgdb.ModelSysRecord.find({'stuNumber':'101'},function(err,docs){
		  if(err)
		    console.log(err);
		  else
		  {
		    //console.log(docs);
		    console.log(docs[0].prjName);
		    if(docs[0].prjName==req.body.selectedPrjName.trim())
		      console.log('docs[0].prjName==selectedPrjName');
		    else
		      console.log('docs[0].prjName!=selectedPrjName');
		  }

		});		

		mgdb.DoModifyOneByCondition(
			mgdb.ModelSysRecord, 
			//{'stuNumber':stuNumber},
			{'stuNumber':stuNumber, 'prjName':req.body.selectedPrjName}, 
			{
			    stuWeixinBind: true,
			    stuWeixin_id: req.body.weixinid,
			    subDate: Date.now()
		    },
			function(err, docs){
				if(err)
				{
				  console.log('StuSubscribe err=' + err.message);
				  //res.send('注册失败! ' + err);
				  res.render('subscribe_result',
				  	{resultMsg:comutil.subscribe_resultmsg_error + ' ' + err}
				  );
				}
				else
				{
				  //res.send('注册成功!');
				  res.render('subscribe_result',
				  	{resultMsg:comutil.subscribe_resultmsg_ok}
				  );
				}
		});
	}
};

//test
// exports.testsubscriberesult = function(req, res) {
// 	res.render('subscribe_result',
// 		{resultMsg:'success!'});
// };

var SaveWorklog = function(weixin_id, create_time, info_tosave, callback) {
	var newWorklog = new mgdb.ModelWorklog();
	
	newWorklog.weixin_id = weixin_id;
	newWorklog.createdtime = create_time;
	newWorklog.created = Date.now();

	if(info_tosave[0]=='text')
	{
		newWorklog.logtext = info_tosave[1];
		newWorklog.logpicpath = "";
	}
	else if(info_tosave[0]=='image')
	{
		newWorklog.logtext = "";
		newWorklog.logpicpath = info_tosave[1];
	}

	mgdb.AddWorklog(newWorklog, function(msg) {
		callback(msg);
	});
};

exports.testuploadworklog = function(req, res){
	var infoToSave = [];
	infoToSave[0] = 'text';
	infoToSave[1] = req.body.logtext;
	SaveWorklog(req.body.weixin_id, Date.now(), infoToSave, function(msg){
		res.send(msg.msg);
	});
	console.log('save text:' + req.body.logtext);

	infoToSave[0] = 'image';
	infoToSave[1] = req.body.logpicpath;
	SaveWorklog(req.body.weixin_id, Date.now(), infoToSave, function(msg){
		res.send(msg.msg);
	});
	console.log('save image:' + req.body.logpicpath);
};

exports.WeixinQuery = function (req, res) {

	var weixin_id = req.params.id.substr(1, req.params.id.length-1);
	console.log('WeixinQuery id= ' + weixin_id);

	mgdb.FindOneByOption(mgdb.ModelSysRecord, {'stuWeixin_id':weixin_id}, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.send('abnormal error!');
		}
		else
		{
			if(docs)
			{
				console.log('docs.length=' + docs.length);
				console.log('docs.stuName=' + docs.stuName);
				console.log('docs.stuNumber=' + docs.stuNumber);

				res.render('weixin_query_worklog_detail_result',
				  	{
				  		//act: comutil.sidebaract.super.viewsyslog,
				  		worklogs: docs.workRecords, 
				  		stuname: docs.stuName,
				  		stunumber: docs.stuNumber,
				  		prjname: docs.prjName,
						//msg: comutil.msg.msg_modifymember, 
				  		title: comutil.msg.title_viewsysworklog, 
				  		smalltitle: '', 
				  		breadtext: comutil.bread.super_viewsyslog_text,
                        breadhref: comutil.bread.super_viewsyslog_href,
				  		//id:idStr
				  	});
			}
		}
	});
};

exports.weixinquerytext = function(req, res){
	var weixin_id = req.params.id.substr(1, req.params.id.length-1);
	console.log('weixinquerytext id= ' + weixin_id);

	mgdb.FindDocsByWinxinId(
		mgdb.ModelSysRecord, 
		weixin_id,
		function(err, docs){
			if(err)
			{
				console.log('weixinquerytext abnormal err=' + err.message);
				res.send('abnormal error!');
			}
			else
			{
				if(docs)
				{
					res.render('weixin_querytext_result', 
						{
							texts:docs, 
						});
				}
				else
				{
					res.send('text empty!');
				}
			}
		});
};

exports.weixinqueryimage = function(req, res){
	var weixin_id = req.params.id.substr(1, req.params.id.length-1);
	console.log('weixinqueryimage id= ' + weixin_id);

	mgdb.FindDocsByWinxinId(
		mgdb.ModelWorklog, 
		weixin_id,
		function(err, docs){
			if(err)
			{
				console.log('weixinqueryimage abnormal err=' + err.message);
				res.send('abnormal error!');
			}
			else
			{
				if(docs)
				{
					res.render('weixin_queryimage_result', 
						{
							worklogs:docs, 
						});
				}
				else
				{
					res.send('image empty!');
				}
			}
		});
};
