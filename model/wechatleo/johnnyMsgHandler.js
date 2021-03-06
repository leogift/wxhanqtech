/*******************************************************************************************
Filename    : johnnyMsgHandler.js
Summary     : handle weixin msg
Version     : 1.0
Created     : 2015-02-07
Author      : Johnny from leo.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/


var msgResponser = require('./wechat/msgResponser');
var http = require('http');
//var JSON = require('JSON');
var base64Code = require('./base64Code/base64Code');
var fs = require('fs');
var schedule = require('node-schedule');

//johnny
var getMedia = require('./wechat/accessToken');
var mgdb = require('../mgdb');
var comutil = require('../commonutils');
var schedule = require('node-schedule');


//
// class of submition in one time 

var OneSubmit = function (weixin_id) {

	// member variants
	this.wid = weixin_id;
	this.logText = [];
	this.logPicPath = [];
	this.logLocation = '';
	this.logLocationDesc = '';
	this.startTime = '';
	this.stopTime = '';

	//sub state. seems useless now
	//this.SubState = comutil.substate_stop;

	// member functions
	this.AddLogText = function(log_text){
		this.logText.push(log_text);
	};

	this.AddLogPicPath = function(log_picpath){
		this.logPicPath.push(log_picpath);
	};

	this.SetStartTime = function(){
		//this.startTime = Date.now();
		this.startTime = comutil.GetTimeString(2);
	};

	this.SetStopTime = function(){
		//this.stopTime = Date.now();
		this.stopTime = comutil.GetTimeString(2);
	};

	//excute when new()
	this.SetStartTime();
};

//
// class of core submition worklog data 

var CoreSubmitData = function(){

	// member variants

	// student submit worklog array, core data
	this.SubmitDataArray = [];


	// member functions
	this.DebugPrint = function(wid){
		console.log('DebugPrint wid=' + wid);

		if(this.SubmitDataArray[wid]==undefined)
		{
			console.log('DebugPrint wid not existed!');
			return;
		}

		var i = 0;
		
		var len = this.SubmitDataArray[wid].logText.length;
		console.log('logText:' + len);
		for(i=0; i<len; i++)
		{
			console.log('logText[' + i + ']=' + this.SubmitDataArray[wid].logText[i]);
		}

		len = this.SubmitDataArray[wid].logPicPath.length;
		console.log('logPicPath:' + len);
		for(i=0; i<len; i++)
		{
			console.log('logPicPath[' + i + ']=' + this.SubmitDataArray[wid].logPicPath[i]);
		}

		console.log('logLocation=' + this.SubmitDataArray[wid].logLocation);
		console.log('startTime=' + this.SubmitDataArray[wid].startTime);
		console.log('stopTime=' + this.SubmitDataArray[wid].stopTime);
	};

	this.ClearOneSubmitData = function(wid){
		if(this.SubmitDataArray[wid]==undefined)
		{
			console.log('ClearOneSubmitData wid not existed!');
			return;
		}

		this.SubmitDataArray[wid] = undefined;
	};

};

//
// globle variant

// core submit data object
var coreSubmitData = new CoreSubmitData();


//
// class of location information

var LocationInfo = function (weixin_id) {

	// member variants
	this.wid = weixin_id;
	//this.binded = true;

	//location pic path, for save the weixin location picurl
	this.locPicPath = '';

	//location description
	this.logLocationDesc = '';

	//location try count
	this.locTryCount = 0;

	//location 
	this.longitude = 0;
	this.latitude = 0;
	this.precision = 0;


	// member functions
	// this.SetLocation = function(log, lat){
	// 	this.longitude = log;
	//     this.latitude = lat;
	// };
};

// location information is independent to submitData
var locInfoArray = [];

//read from json file
// var obj = ReadFileToObj(comutil.LocationArrayFile);
// if(obj==null)
// {
// 	console.log('read obj null');
// }
// else
// {
// 	locInfoArray = obj;
// 	console.log('locInfoArray=' + locInfoArray);
// }

comutil.LoadObjArray(comutil.LocationArrayFile, locInfoArray);
console.log('locInfoArray=');
console.log(locInfoArray);

function RunSaveLocArraySchedule () {

    console.log('RunSaveLocArraySchedule');

	//run schedule job
	var rule = new schedule.RecurrenceRule();
	var trigTime = [];
	trigTime.push(10);
	rule.second = trigTime;

	var job = schedule.scheduleJob(rule, function(){
	  console.log('start to save locArray:');
	  console.log(locInfoArray);
	  SaveObjToFile(locInfoArray, comutil.LocationArrayFile);
	});

};

//RunSaveLocArraySchedule();

//
//johnny defined functions
//

var GenerateSubHtml = function(abspath, templateHtml_name, new_prefix, weixin_id, globleip){
	var url = 'http://' + globleip + '/' + comutil.subhtml_subdir + '/' + comutil.subhtml_errorhtmlname;

	//read template file
	console.log('abspath=' + abspath);

	var templateFile = abspath + '/' + templateHtml_name;
	console.log('templatehtml file=' + templateFile);

	var data = fs.readFileSync(templateFile);
	if(!data)
	{
		console.log('GenerateHtml read file error:' + err);
		return url;
	}

	data = data.toString();
    data = data.replace(/weixin_id_here/gi, weixin_id);
	var newFileName = comutil.subhtml_newprefix + weixin_id + '.html';
	var newFile = abspath + '/' + newFileName;
	console.log('newFile=' + newFile);

	fs.writeFileSync(newFile, data, encoding='utf8');

	url = 'http://' + globleip + '/' + comutil.subhtml_subdir + '/' + newFileName;
	console.log('url=' + url);
	return url;

};

var OnStuUnSubscribe = function (weixin_id) {
	var wid = weixin_id.trim();
	console.log('OnStuUnSubscribe wid=' + wid);

	if(wid=='')
	{
		console.log('OnStuUnSubscribe wid is empty!');
		return;
	}

	//clear location info
	locInfoArray[wid] = undefined;

	//save to file
	comutil.SaveObjArray(locInfoArray, comutil.LocationArrayFile);

	mgdb.DoModifyByWeixinId(
		mgdb.ModelSysRecord, 
		wid, 
		{
		    stuWeixinBind: false,
		    stuWeixinBind_backup: false,
		    stuWeixin_id: comutil.default_weixinid,
		    stuWeixin_id_backup: comutil.default_weixinid,
		    unsubDate: Date.now()
	    },
		function(err, docs){
			if(err)
			{
			  console.log('OnStuUnSubscribe err=' + err);
			}
			else
			{
			  console.log('OnStuUnSubscribe ok');
			}
	});

};

// on user click weixin btn start submit
var OnSubmitStart = function(res, msg){
	console.log('OnSubmitStart msg.FromUserName=' + msg.FromUserName);

	//check if weixin_id existed, in case of system reset
	mgdb.FindAllbyOption(
		mgdb.ModelSysRecord,
		{stuWeixin_id: msg.FromUserName},
		function(err, docs){
			if(err)
			{
				msgResponser.responseText(res, msg, comutil.submsg_abnormal);
			}
			else
			{
				if(docs.length!=0)
				{
					//abnormal if not registered yet
					if(locInfoArray[msg.FromUserName]==undefined) // || locInfoArray[msg.FromUserName].binded==false)
					{
						// var locInfo = new LocationInfo(msg.FromUserName);
						// locInfoArray[msg.FromUserName] = locInfo;
						// console.log('abnormal!');
						msgResponser.responseText(res, msg, comutil.submsg_resubscribe);
						return;
					}

					//check location info exists or not
					if(locInfoArray[msg.FromUserName].locPicPath=='')
					{
						if(locInfoArray[msg.FromUserName].locTryCount < comutil.submit_location_trycount)
						{
							locInfoArray[msg.FromUserName].locTryCount = locInfoArray[msg.FromUserName].locTryCount + 1;
							//try again
							msgResponser.responseText(res, msg, comutil.submsg_location_tryagain);
							return;
						}
					}
					

					msgResponser.responseText(res, msg, comutil.submsg_start);

					//create one submit data
					var oneSubmit = new OneSubmit(msg.FromUserName);
					oneSubmit.SetStartTime();
					coreSubmitData.SubmitDataArray[msg.FromUserName] = oneSubmit;

				}
				else
				{
					msgResponser.responseText(res, msg, comutil.submsg_resubscribe);
				}
			}

		});

	// msgResponser.responseText(res, msg, comutil.submsg_start);

	// //create one submit data
	// var oneSubmit = new OneSubmit(msg.FromUserName);
	// oneSubmit.SetStartTime();
	// coreSubmitData.SubmitDataArray[msg.FromUserName] = oneSubmit;
};

// on user click weixin btn stop submit
var OnSubmitStop = function(res, msg){

	console.log('OnSubmitStop msg.FromUserName=' + msg.FromUserName);

	//check if existed
	if(coreSubmitData.SubmitDataArray[msg.FromUserName]==undefined)
	{
		msgResponser.responseText(res, msg, comutil.submsg_tip1);
		return;
	}

	//send back msg
	msgResponser.responseText(res, msg, comutil.submsg_stop);

	coreSubmitData.SubmitDataArray[msg.FromUserName].SetStopTime();

	//get location baidumap pic to local
	var picUrl = coreSubmitData.SubmitDataArray[msg.FromUserName].logLocation;
	
	//if location info can't get, use old one
	if(picUrl=='')
	{
		console.log('picUrl empty, use: ' + locInfoArray[msg.FromUserName].locPicPath);
		picUrl = locInfoArray[msg.FromUserName].locPicPath;
	}

	if(coreSubmitData.SubmitDataArray[msg.FromUserName].logLocationDesc=='')
	{
		console.log('location desc empty, use: ' + locInfoArray[msg.FromUserName].logLocationDesc);
		coreSubmitData.SubmitDataArray[msg.FromUserName].logLocationDesc = locInfoArray[msg.FromUserName].logLocationDesc;
	}

	var picWebAbsPathName = '/' + comutil.submit_img_dir + '/' + msg.FromUserName + '_' + comutil.GetTimeString(1) + comutil.location_suffix;
	var picFsAbsPathName = comutil.subhtml_absolutewebroot + picWebAbsPathName;

	console.log('picUrl=' + picUrl);
	console.log('picWebAbsPathName=' + picWebAbsPathName);
	console.log('picFsAbsPathName=' + picFsAbsPathName);


	comutil.HttpGetFile(picUrl, picFsAbsPathName, function(err){
		if(err)
		{
			console.log('comutil.HttpGetFile error!');			
		}
		else
		{
			coreSubmitData.SubmitDataArray[msg.FromUserName].logLocation = picWebAbsPathName;
		}

		//show debug
		coreSubmitData.DebugPrint(msg.FromUserName);
		//save to db
		OneSubmitDataToDatabase(msg.FromUserName);
		//clear, now do clear in OneSubmitDataToDatabase()
	    //coreSubmitData.ClearOneSubmitData(msg.FromUserName);
	});


 //    comutil.HttpGetFile(picUrl, picFsAbsPathName, function(){

	// 	coreSubmitData.SubmitDataArray[msg.FromUserName].logLocation = picWebAbsPathName;

	// 	//show debug
	// 	//coreSubmitData.DebugPrint(msg.FromUserName);
	// 	//save to db
	// 	OneSubmitDataToDatabase(msg.FromUserName);
	// });

    //reset locInfoArray state
    locInfoArray[msg.FromUserName].locTryCount = 0;

};

var OneSubmitDataToDatabase = function(weixin_id){

  var workLogRec = new mgdb.ModelWorkRecord();
  workLogRec.logText = coreSubmitData.SubmitDataArray[weixin_id].logText;
  workLogRec.logPicPath = coreSubmitData.SubmitDataArray[weixin_id].logPicPath;
  workLogRec.logLocation = coreSubmitData.SubmitDataArray[weixin_id].logLocation;
  workLogRec.logLocationDesc = coreSubmitData.SubmitDataArray[weixin_id].logLocationDesc;
  workLogRec.startTime = coreSubmitData.SubmitDataArray[weixin_id].startTime;
  workLogRec.stopTime = coreSubmitData.SubmitDataArray[weixin_id].stopTime;

  mgdb.ModelSysRecord.update({stuWeixin_id: weixin_id, prjExpired:false},  
      //{$pushAll:{'workRecords': workLogRec}}, function(err, data){
      // pushAll will push a array as a element into workRecords; 
      //upsert: if true, when not found, insert new, data is 1; if false, not insert if not found and data is 0
      {$push:{'workRecords':workLogRec}},{upsert:false}, function(err, data){
        if(err)
        {
          console.log('test submit data to db error: ' + err);
        }
        else
        {
          if(data==1)
            console.log('test submit data to db ok, data: ' + data);
          else if(data==0)
            console.log('test submit data to db error, wid not found? data: ' + data);
          else
            console.log('test submit data to db abnormal, data: ' + data);

          //clear
          coreSubmitData.ClearOneSubmitData(weixin_id);
          //keep the logPic not clean?
          //...
        }
  });
};

//
// timer to get ACCESS_TOKEN
//

//s/*
//get the first access_token
getMedia.GetAccessToken();

//run schedule job
var rule = new schedule.RecurrenceRule();
var trigTime = [];
trigTime.push(20);
trigTime.push(50);
rule.minute = trigTime;
var job = schedule.scheduleJob(rule, function(){
	getMedia.GetAccessToken();
});
//*/

//Text
exports.handleText = function (res, msg)
{
	//johnny
	console.log('msg.ToUserName=' + msg.ToUserName +
		' msg.FromUserName=' + msg.FromUserName +
		' msg.CreateTime' + msg.CreateTime +
		' msg.MsgType' + msg.MsgType +
		' msg.Content' + msg.Content);

	var keyword = msg.Content;

	// if(msg.Content=='#1')
	// {
	// 	console.log('command: #1');

	// 	var articles = [];
	// 	articles[0] = 
	// 	{
	// 	    Title : "Query Worklog Text",
	// 	    Description : "worklog text link",
	// 	    PicUrl : null,
	// 	    Url : 'http://121.201.13.217/weixinquerytext/:' + msg.FromUserName
	// 	};

	// 	msgResponser.responseNews(res, msg, articles);
	// }
	// else if(msg.Content=='#2')
	// {
	// 	console.log('command: #2');

	// 	var articles = [];
	// 	articles[0] = 
	// 	{
	// 	    Title : "Query Worklog Image",
	// 	    Description : "worklog image link",
	// 	    PicUrl : null,
	// 	    Url : 'http://121.201.13.217/weixinqueryimage/:' + msg.FromUserName
	// 	};

	// 	msgResponser.responseNews(res, msg, articles);
	// }
	// else if(msg.Content=='#3')
	// {
	// 	console.log('command: #3');
	// 	msgResponser.responseText(res, msg, "debug info console.log" );

	// 	coreSubmitData.DebugPrint(msg.FromUserName);
	// }
	// else
	{
		//what if the submit text is very long?
		//..

		//check if already started  
		if(coreSubmitData.SubmitDataArray[msg.FromUserName]==undefined)
		{
			msgResponser.responseText(res, msg, comutil.submsg_tip1);
		}
		else
		{
			msgResponser.responseText(res, msg, "谢谢您本次提交的文本，长度为：" + keyword.length);

			//add to core data
			coreSubmitData.SubmitDataArray[msg.FromUserName].AddLogText(keyword);
		}
	}
};

//Image
exports.handleImage = function (res, msg)
{
	var PicUrl = msg.PicUrl;
	var MediaId = msg.MediaId;

	console.log("handleImage wid:" + msg.FromUserName);
	console.log("MediaId:"+MediaId + '\t' + "PicUrl:"+PicUrl);

	//check if existed
	if(coreSubmitData.SubmitDataArray[msg.FromUserName]==undefined)
	{
		msgResponser.responseText(res, msg, comutil.submsg_tip1);
		return;
	}

	var articles = [];
	articles[0] = 
	{
	    Title : "图片已上传",
	    Description : "您上传的图片链接",
	    PicUrl : PicUrl,
	    Url : PicUrl
	};

	//return the pic
	//msgResponser.responseNews(res, msg, articles);
	var index = (coreSubmitData.SubmitDataArray[msg.FromUserName].logPicPath.length +1);
	msgResponser.responseText(res, msg, "谢谢您本次提交的图片: " + index);
	
	var dateString = comutil.Time2DateString(1000*msg.CreateTime);
	//fetch and save the pic
	//if submit many imgs, createtime will be the same!!
	var picWebAbsPathName = '/' + comutil.submit_img_dir + '/' + msg.FromUserName + '_' + dateString + '_' + index + '.jpg';
	var picFsAbsPathName = comutil.subhtml_absolutewebroot + picWebAbsPathName;

	getMedia.GetMedia(null, MediaId, picFsAbsPathName);

	console.log('save img ' + picWebAbsPathName + '\tin ' + picFsAbsPathName);
	//add to core data
	coreSubmitData.SubmitDataArray[msg.FromUserName].AddLogPicPath(picWebAbsPathName);
};

//Voice
exports.handleVoice = function (res, msg)
{
	var MediaId = msg.MediaId;
	var Format = msg.Format;
	var Recognition = msg.Recognition;
	
	console.log("MediaId:"+MediaId);

	if(!Recognition)//null
	{
		msgResponser.responseVoice(res, msg, MediaId);
	}
	else
	{
		msgResponser.responseText(res, msg, "usr 语音识别：" + Recognition );
	}
};

//Video
exports.handleVideo = function (res, msg)
{
	var MediaId = msg.MediaId;
	var ThumbMediaId = msg.ThumbMediaId;
	
	msgResponser.responseImage(res, msg, ThumbMediaId);
};

// wechat.js: location
//这个函数没有进来
exports.handleLocation = function (res, msg)
{
	var Latitude = msg.Location_X;
	var Longitude = msg.Location_Y;
	var Scale = msg.Scale;
	var Label = msg.Label;

	console.log('handleLocation: ' + msg.FromUserName);

	var convertUrl = "http://api.map.baidu.com/ag/coord/convert?x="+Longitude+"&y="+Latitude+"&from=2&to=4&mode=0";
	http.get(convertUrl, function(response)
	{
		var json = '';
		response.setEncoding('utf8');
		response.on('data', function (chunk)
		{
			json += chunk;
		});
		
		response.on('end', function ()
		{
			var data=JSON.parse(json);
			var xCode=data.x;
			var yCode=data.y;
			Longitude=base64Code.base64decode(xCode.toString());
			Latitude=base64Code.base64decode(yCode.toString());
			
			var renderUrl = "http://api.map.baidu.com/telematics/v3/reverseGeocoding?&location="+Longitude+","+Latitude+"&coord_type=bd09ll&output=json&ak=KmVaLtYGzplEZOk0Wvy3ZXHK";
			http.get(renderUrl, function(response1)
			{
				var json1 = '';
				response1.setEncoding('utf8');
				response1.on('data', function (chunk1)
				{
					json1 += chunk1;
				});
				
				response1.on('end', function ()
				{
					var data1=JSON.parse(json1);
					var description=data1.description;
					
					var mapPic = "http://api.map.baidu.com/staticimage?center="+Longitude+","+Latitude+"&width=360&height=640&zoom=16&scale=2&markers="+Longitude+","+Latitude+"&markerStyles=l,";
					var mapUrl = "http://api.map.baidu.com/marker?location="+Latitude+","+Longitude+"&title=手动上报位置&output=html&src=汉擎定位";
					
					var articles = [];
					articles[0] = 
					{
					    Title : "手动上报地理位置",
					    Description : description.toString(),
					    PicUrl : mapPic,
					    Url : mapUrl
					};
				
					msgResponser.responseNews(res, msg, articles);
				});
			});

		});
	});
};

//event
// exports.handleEvent_Subscribe = function (res, msg)
// {
// 	console.log('handleEvent_Subscribe');
// 	console.log('msg.FromUserName=' + msg.FromUserName);

// 	var absPath = comutil.subhtml_absolutewebroot + '/' + comutil.subhtml_subdir;
// 	var url = GenerateSubHtml(absPath, comutil.subhtml_templatehtmlname, comutil.subhtml_newprefix, msg.FromUserName, comutil.globleip);

// 	console.log('url=' + url);

// 	var articles = [];
// 	articles[0] = 
// 	{
// 	    Title : '请点击 "查看全文" 完成注册!',
// 	    Description : "欢迎订阅汉擎科技WIS服务",
// 	    //PicUrl : PicUrl,
// 	    PicUrl : '',
// 	    Url : url
// 	};

// 	msgResponser.responseNews(res, msg, articles);

// 	//record location info when subscribe
// 	var locInfo = new LocationInfo(msg.FromUserName);
// 	console.log('locInfo=' + locInfo);
// 	locInfoArray[msg.FromUserName] = locInfo;
// 	console.log('locInfoArray.length=' + locInfoArray.length);
// 	console.log(locInfoArray);

// 	//save to file
// 	comutil.SaveObjArray(locInfoArray, comutil.LocationArrayFile);
// };

exports.handleEvent_Subscribe = function (res, msg)
{
	console.log('handleEvent_Subscribe');
	console.log('msg.FromUserName=' + msg.FromUserName);

	var url = 'http://' + comutil.globleip + '/wxreg/:' + msg.FromUserName;

	console.log('url=' + url);

	var articles = [];
	articles[0] = 
	{
	    Title : '请点击 "查看全文" 完成注册!',
	    Description : "欢迎订阅汉擎科技WIS服务",
	    //PicUrl : PicUrl,
	    PicUrl : '',
	    Url : url
	};

	msgResponser.responseNews(res, msg, articles);

	//record location info when subscribe
	var locInfo = new LocationInfo(msg.FromUserName);
	console.log('locInfo=' + locInfo);
	locInfoArray[msg.FromUserName] = locInfo;
	console.log('locInfoArray.length=' + locInfoArray.length);
	console.log(locInfoArray);

	//save to file
	comutil.SaveObjArray(locInfoArray, comutil.LocationArrayFile);
};


exports.handleEvent_UnSubscribe = function (res, msg)
{
	console.log('handleEvent_UnSubscribe');
	console.log('msg.FromUserName=' + msg.FromUserName);

	var articles = [];
	articles[0] = 
	{
	    Title : "您已退订汉擎科技WIS服务!",
	    Description : "谢谢您对本系统的使用",
	    //PicUrl : PicUrl,
	    PicUrl : '',
	    Url : null
	};

	//退订没有给用户反馈消息!
	msgResponser.responseNews(res, msg, articles);

    //unsubscribe
	OnStuUnSubscribe(msg.FromUserName);
};

exports.handleEvent_Scan = function (res, msg)
{
	var EventKey = msg.EventKey;
	msgResponser.responseText(res, msg, "扫描二维码："+EventKey);
};

exports.handleEvent_Location = function (res, msg)
{
	var Latitude = msg.Latitude;
	var Longitude = msg.Longitude;
	var Precision = msg.Precision;

	//log out time interval:
	var date = comutil.Time2Date(1000*msg.CreateTime);
	console.log('location: ' + date + ' user: ' + msg.FromUserName);
	console.log('handleEvent_Location\n from weixin Latitude:' + Latitude + '\tLongitude:' + Longitude + '\tPrecision:' + Precision);

	if(locInfoArray[msg.FromUserName]!=undefined)// && locInfoArray[msg.FromUserName].binded!=false)
	{
		// Longitude = 114.387520;
		// Latitude = 30.509258;
		//oldLong = 114.416641;
		//oldLat = 30.511812;
		var oldLong = parseFloat(locInfoArray[msg.FromUserName].longitude);
		var oldLat = parseFloat(locInfoArray[msg.FromUserName].latitude);
		var wxLong = parseFloat(Longitude);
		var wxLat = parseFloat(Latitude);
		// oldLong = locInfoArray[msg.FromUserName].longitude;
		// oldLat = locInfoArray[msg.FromUserName].latitude;

		console.log('old Lat: ' + oldLat + '\told Lon: ' + oldLong);

		//var dis = comutil.CalcLatLonDistance(locInfoArray[msg.FromUserName].latitude, locInfoArray[msg.FromUserName].longitude, Latitude, Longitude);
		//var dis = comutil.CalcLatLonDistance(oldLat, oldLong, Latitude, Longitude);
		var dis = comutil.CalcLatLonDistance(oldLat, oldLong, wxLat, wxLong);
		
		if(dis>comutil.FarDistance) // when far from old point
		{
			console.log('dis>far : ' + dis + ' > ' + comutil.FarDistance);

			locInfoArray[msg.FromUserName].longitude = msg.Longitude;
			locInfoArray[msg.FromUserName].latitude = msg.Latitude;
		    locInfoArray[msg.FromUserName].precision = msg.Precision;

		    //save to file
		    comutil.SaveObjArray(locInfoArray, comutil.LocationArrayFile);

		    console.log('locInfoArray[' + msg.FromUserName + '].locPicPath=' + locInfoArray[msg.FromUserName].locPicPath);
		}
		else
		{
			console.log('dis<far : ' + dis + ' < ' + comutil.FarDistance);
			console.log('locInfoArray[' + msg.FromUserName + '].locPicPath=' + locInfoArray[msg.FromUserName].locPicPath);

			if(locInfoArray[msg.FromUserName].locPicPath!='' && locInfoArray[msg.FromUserName].logLocationDesc!='')
			{
				console.log('use old non-empty logPicPath and logLocationDesc');
				return;
			}			
		}
	}
	else
	{

		console.log('handleEvent_Location user unregistered! ' + msg.FromUserName);
		return;
	}

	var convertUrl = "http://api.map.baidu.com/ag/coord/convert?x="+Longitude+"&y="+Latitude+"&from=0&to=4&mode=0";

	http.get(convertUrl, function(response)
	{
		var json = '';
		response.setEncoding('utf8');
		response.on('data', function (chunk)
		{
			json += chunk;
		});
		
		response.on('end', function ()
		{
			var data=JSON.parse(json);
			var xCode=data.x;
			var yCode=data.y;
			Longitude=base64Code.base64decode(xCode.toString());
			Latitude=base64Code.base64decode(yCode.toString());
			
			var renderUrl = "http://api.map.baidu.com/telematics/v3/reverseGeocoding?&location="+Longitude+","+Latitude+"&coord_type=bd09ll&output=json&ak=KmVaLtYGzplEZOk0Wvy3ZXHK";
			http.get(renderUrl, function(response1)
			{
				var json1 = '';
				response1.setEncoding('utf8');
				response1.on('data', function (chunk1)
				{
					json1 += chunk1;
				});
				
				response1.on('end', function ()
				{
					var data1=JSON.parse(json1);
					var description=data1.description;
					console.log('data1.description=' + data1.description);
					
					var mapPic = "http://api.map.baidu.com/staticimage?center="+Longitude+","+Latitude+"&width=360&height=640&zoom=16&scale=2&markers="+Longitude+","+Latitude+"&markerStyles=l,";
					var mapUrl = "http://api.map.baidu.com/marker?location="+Latitude+","+Longitude+"&title=自动上报位置&output=html&src=汉擎定位";
					
					if(coreSubmitData.SubmitDataArray[msg.FromUserName]!=undefined)
					{
						coreSubmitData.SubmitDataArray[msg.FromUserName].logLocation = mapPic;
						coreSubmitData.SubmitDataArray[msg.FromUserName].logLocationDesc = description;
					}						

					if(locInfoArray[msg.FromUserName]!=undefined)
					{
						locInfoArray[msg.FromUserName].locPicPath = mapPic;
						locInfoArray[msg.FromUserName].logLocationDesc = description;
					}

				});
			});

		});
	});
};

exports.handleEvent_Menu = function (res, msg)
{
	var EventKey = msg.EventKey;
	
	if(EventKey=="Event_Upload_Begin")
	{
		//msgResponser.responseText(res, msg, comutil.submsg_start);
		OnSubmitStart(res, msg);
	}
	else if(EventKey=="Event_Upload_Process")
	{
		msgResponser.responseText(res, msg, "usr Event_Upload_Process" );
	}
	else if(EventKey=="Event_Upload_End")
	{
		//msgResponser.responseText(res, msg, comutil.submsg_stop);
		OnSubmitStop(res, msg);
	}
	else if(EventKey=="Event_Opt_Query")
	{
		//msgResponser.responseText(res, msg, "usr Event_Sort_Project" );

		console.log('Event_Opt_Query');

		var articles = [];
		articles[0] = 
		{
		    Title : "查询工作日志",
		    Description : "查询自己成功提交的工作日志",
		    PicUrl : null,
		    Url : 'http://' + comutil.globleip + '/weixinquery/:' + msg.FromUserName
		};

		msgResponser.responseNews(res, msg, articles);
	}
	else if(EventKey=="Event_Opt_Login")
	{
		//msgResponser.responseText(res, msg, "usr Event_Sort_Name" );

		console.log('Event_Opt_Login');

		//var url = 'http://121.201.13.217/supervisor_login.html';
		var url = 'http://' + comutil.globleip + '/user_login.html';

		var articles = [];
		articles[0] = 
		{
		    Title : "汉擎科技WIS服务!",
		    Description : "请先登录",
		    //PicUrl : PicUrl,
		    PicUrl : '',
		    Url : url
		};

		msgResponser.responseNews(res, msg, articles);
	}
	else if(EventKey=="Event_Opt_Reg")
	{
		var url = 'http://' + comutil.globleip + '/wxreg/:' + msg.FromUserName;

		console.log('url=' + url);

		var articles = [];
		articles[0] = 
		{
	    		Title : '请点击 "查看全文" 完成注册!',
	    		Description : "欢迎订阅注册WIS服务",
	    		//PicUrl : PicUrl,
	    		PicUrl : '',
	    		Url : url
		};

		msgResponser.responseNews(res, msg, articles);

		//record location info when subscribe
		var locInfo = new LocationInfo(msg.FromUserName);
		console.log('locInfo=' + locInfo);
		locInfoArray[msg.FromUserName] = locInfo;
		console.log('locInfoArray.length=' + locInfoArray.length);
		console.log(locInfoArray);

		//save to file
		comutil.SaveObjArray(locInfoArray, comutil.LocationArrayFile);
	}
	else
	{
		msgResponser.responseText(res, msg, "usr 按键：这是个什么按键..." );
	}

};

// function SaveObjToFile (obj, file) {

// 	//check
// 	if(obj==null)
// 	{
// 		console.log('SaveObjToFile obj is null');
// 		return false;
// 	}

// 	console.log('SaveObjToFile obj=');
// 	console.log(obj);

// 	//transform obj to string
// 	var jsonText = JSON.stringify(obj, null, 4);
// 	console.log(jsonText);
// 	console.log('jsonText=' + jsonText + ' file=' + file);

// 	fs.writeFileSync(file, jsonText);
// 	return true;
// };

// function ReadFileToObj (file) {

// 	//check
// 	fs.exists(file, function(exists){
// 		if(!exists)
// 		{
// 			return null;
// 		}
// 		else
// 		{
// 			//transform obj to string
// 			try
// 			{
// 				var fileData = fs.readFileSync(file);
// 				var obj = JSON.parse(fileData);
// 				console.log('obj=' + obj);
// 				return obj;
// 			}
// 			catch(e)
// 			{
// 				console.log(e);
// 				return null;
// 			}
// 		}
// 	});
// };



// for(var i=0; i<5; i++)
// {
// 	var locInfo = new LocationInfo(i);
// 	locInfo.longitude = i;
// 	locInfo.latitude = i;
//     locInfoArray[i] = locInfo;
// }

//var jsonText = JSON.stringify(locInfoArray, null, 4);
// var jsonText = JSON.stringify(locInfoArray);
// //var jsonText = JSON.stringify([], null, 4);
// console.log('Array=' + jsonText);


//test

// var locInfo1 = new LocationInfo('adfa');
// locInfo1.longitude = 1;
// locInfo1.latitude = 1;
// locInfoArray['adfa'] = locInfo1;

// var locInfo2 = new LocationInfo('xxcsdf');
// locInfo2.longitude = 2;
// locInfo2.latitude = 2;
// locInfoArray['xxcsdf'] = locInfo2;

// var locInfo3 = new LocationInfo('3eadfxvxv');
// locInfo3.longitude = 3;
// locInfo3.latitude = 3;
// locInfoArray['3eadfxvxv'] = locInfo3;

// comutil.SaveObjArray(locInfoArray, comutil.LocationArrayFile);

// var objArray3 = [];
// //objArray2 = LoadObjArray('./locInfoArray2.json');
// comutil.LoadObjArray(comutil.LocationArrayFile, objArray3);
// console.log('objArray3:');
// console.log(objArray3);
