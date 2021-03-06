/*******************************************************************************************
Filename    :app.js
Summary     :dispatch url, express app.js
Version     :1.0
Created     :2015-02-07
Author      :Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/


//
// packages required
//


// database interface
var mgdb = require('./model/mgdb');

// self-defined const and functions
var comutil = require('./model/commonutils');
var schedule = require('node-schedule');
var exportlogs = require('./model/exportlogs');

var express = require('express')
  , handlesupervisor = require('./routes/handlesupervisor')
  , handletutor = require('./routes/handletutor')
  , handlestudent = require('./routes/handlestudent')
  , handleweixin = require('./routes/handleweixin')
  , superlogin = require('./routes/superlogin')
  , userlogin = require('./routes/userlogin')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || comutil.webserver_port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  //app.use(express.bodyParser());
  //app.use(express.json());
  //app.use(express.urlencoded());
  app.use(express.bodyParser({keepExtensions:true, uploadDir: comutil.uploadDir}));
  app.use(express.cookieParser('shhhh, very secret'));
  app.use(express.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


//
// handle weixin msg GET and POST
//
app.get('/wechat', handleweixin.handle);
app.post('/wechat', handleweixin.handle);
app.post('/studentsubscribe', handleweixin.StuSubscribe);
//app.post('/testuploadworklog', handleweixin.testuploadworklog);
app.get('/weixinquery/:id', handleweixin.WeixinQuery);
app.get('/wxreg/:id', handleweixin.WeixinRegister);
//app.get('/wxreg/:id', handleweixin.WeixinQuery);

//app.get('/weixinquerytext/:id', handleweixin.weixinquerytext);
//app.get('/weixinqueryimage/:id', handleweixin.weixinqueryimage);

//app.get('/testsubscriberesult', handleweixin.testsubscriberesult);

//
// handle supervisor administration
//
app.post('/postsuperlogin', superlogin.Check); // 超级用户登录验证
app.get('/super_logout', superlogin.SuperLogout);

app.get('/super_sysinit', superlogin.Restrict, handlesupervisor.SysInit);
app.post('/upload', superlogin.Restrict, handlesupervisor.OnUpload);
app.get('/super_viewmembers', superlogin.Restrict, handlesupervisor.ViewMembers);
app.get('/super_addnewstudent', superlogin.Restrict, handlesupervisor.ShowAddStudent);
app.post('/super_domodifymember', superlogin.Restrict, handlesupervisor.DoModifyMemberById);
app.get('/super_modifymember/:id', superlogin.Restrict, handlesupervisor.ModifyMemberById);

app.post('/super_domodifyprj', superlogin.Restrict, handlesupervisor.DoModifyPrjById);
app.get('/super_modifyprj/:id', superlogin.Restrict, handlesupervisor.ModifyPrjById);

// app.get('/super_viewsyslog', superlogin.restrict, handlesupervisor.ViewSyslog);
// app.get('/super_sysdatarestore', superlogin.restrict, handlesupervisor.SysdataRestore);
// app.get('/super_sysdatarecovery', superlogin.restrict, handlesupervisor.SysdataRecovery);
app.post('/superaddmember', superlogin.Restrict, handlesupervisor.AddMember);
app.get('/resettutorpassword/:id', superlogin.Restrict, handlesupervisor.ResetTutorPassword);
app.get('/resetstudentpassword/:id', superlogin.Restrict, handlesupervisor.ResetStudentPassword);
app.get('/super_sysdatadump', superlogin.Restrict, handlesupervisor.DbDump);
app.get('/super_sysdatarestore', superlogin.Restrict, handlesupervisor.ShowDbRestore);
//app.get('/dodbrestore/:id', superlogin.Restrict, handlesupervisor.DoDbRestore);
app.get('/dodbrestore/:id', superlogin.Restrict, handlesupervisor.DoDbCollectionRestore);
app.get('/deletesysrecord/:id', superlogin.Restrict, handlesupervisor.DeleteSysRecord);

app.get('/super_viewsyslog', superlogin.Restrict, handlesupervisor.ViewSysWorklog);
app.get('/super_syslogdetails/:id', superlogin.Restrict, handlesupervisor.ViewSysWorklogDetails);
app.get('/super_deletesyslog/:id', superlogin.Restrict, handlesupervisor.ClearSysWorklog);

app.post('/super_queryworklog', superlogin.Restrict, handlesupervisor.ViewSysWorklogQueryResult);
//app.get('/super_removedatabase', superlogin.Restrict, handlesupervisor.RemoveDatabase);
app.get('/super_removedatabase', superlogin.Restrict, handlesupervisor.RemoveCollection);
app.get('/super_syslogexport/:id', superlogin.Restrict, handlesupervisor.SyslogExport);

app.get('/hiddenadminresetpass123', handlesupervisor.ShowHiddenAdminResetPassword);
app.post('/dohiddenadminresetpass789', handlesupervisor.DoHiddenAdminResetPassword);
app.get('/super_modifyselfpassword', superlogin.Restrict, handlesupervisor.ShowSuperModifyPassword);
app.post('/super_domodifyselfpass', superlogin.Restrict, handlesupervisor.DoSuperModifyPassword);
app.get('/super_viewprjs', superlogin.Restrict, handlesupervisor.ViewPrjs);
app.get('/refresh_prjinfo', superlogin.Restrict, handlesupervisor.RefreshPrjInfo);
app.get('/super_prjarchive/:id', superlogin.Restrict, handlesupervisor.PrjArchive);
app.get('/super_prjunarchive/:id', superlogin.Restrict, handlesupervisor.PrjUnArchive);

// not used!
//app.get('/super_makearchive/:id', superlogin.Restrict, handlesupervisor.MakeArchive);

//
// handle tutor administration
//
app.post('/postuserlogin', userlogin.Check); // 用户登录验证
app.get('/tutor_logout', userlogin.Logout);

app.get('/tutor_viewstudents', userlogin.Restrict, handletutor.ViewStudents);
app.get('/modifystudent/:id', userlogin.Restrict, handletutor.ModifyStudentById);
app.post('/domodifystudent', userlogin.Restrict, handletutor.DoModifyStudentById);
app.get('/allowlogin/:id', userlogin.Restrict, handletutor.AllowLogin);
app.get('/notallowlogin/:id', userlogin.Restrict, handletutor.NotAllowLogin);
app.get('/resetstupass/:id', userlogin.Restrict, handletutor.ResetStuPassword);
app.get('/delstudent/:id', userlogin.Restrict, handletutor.DeleteStudentById);
app.get('/tutor_modifyselfinfo', userlogin.Restrict, handletutor.ModifySelfInfo);
app.post('/domodifyselfinfo', userlogin.Restrict, handletutor.DoModifySelfInfo);
app.get('/tutor_modifyselfpass', userlogin.Restrict, handletutor.ModifySelfPass);
app.post('/tutor_domodifyselfpass', userlogin.Restrict, handletutor.DoModifySelfPass);

app.get('/tutor_viewworklog', userlogin.Restrict, handletutor.ViewSysWorklog);
app.get('/tutor_syslogdetails/:id', userlogin.Restrict, handletutor.ViewSysWorklogDetails);
app.get('/tutor_deletesyslog/:id', userlogin.Restrict, handletutor.ClearSysWorklog);

app.post('/tutor_queryworklog', userlogin.Restrict, handletutor.ViewSysWorklogQueryResult);
app.get('/tutor_syslogexport/:id', userlogin.Restrict, handletutor.SyslogExport);

//
// handle student administration
//
app.get('/student_logout', userlogin.Logout);
app.get('/student_modifyselfinfo', userlogin.Restrict, handlestudent.ModifySelfInfo);
app.post('/student_domodifyselfinfo', userlogin.Restrict, handlestudent.DoModifySelfInfo);
app.get('/student_modifyselfpass', userlogin.Restrict, handlestudent.ModifySelfPass);
app.post('/student_domodifyselfpass', userlogin.Restrict, handlestudent.DoModifySelfPass);

app.get('/student_viewworklog', userlogin.Restrict, handlestudent.ViewSysWorklog);
app.get('/student_syslogdetails/:id', userlogin.Restrict, handlestudent.ViewSysWorklogDetails);
app.get('/student_deletesyslog/:id', userlogin.Restrict, handlestudent.ClearSysWorklog);

app.get('/student_syslogexport/:id', userlogin.Restrict, handlestudent.SyslogExport);

//app.post('/addstudent', handletutor.addstudent);
//app.get('/query_student', handletutor.querystudent);
//app.post('/query_cond_student', handletutor.querycondstudent);


//app.get('/studentunregister/:id', handletutor.unregstudent);
//app.get('/studentregister/:id', handletutor.regstudent);

//app.post('/dotutormodifyself', handletutor.dotutormodifyself);

//app.get('/query_log', handletutor.queryalllog);
//app.get('/worklogdelete/:id', handletutor.deletelogbyid);

console.log('WIS by HanqTech version 2.6');

// start listening
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  
  //show database connecting
  console.log('connecting to database...');
});


//remove temp files
//comutil.RunCleanSchedule();

//test
//comutil.CleanRegHtmls();

var RunBackupSchedule = function () {

  console.log('RunBackupSchedule');

  //run schedule job
  var rule = new schedule.RecurrenceRule();

  // var trigTime = [];
  // trigTime.push(42);
  // rule.minute = trigTime;

  rule.dayOfWeek = [0]; //sunday
  rule.hour = 4;        // am 4:00
  rule.minute = 0;

  var job = schedule.scheduleJob(rule, function(){

    console.log('doing Automatic Database Backup...');

    comutil.CheckAndRmBackupDir(comutil.dump_dir);

    console.log('CheckAndRmBackupDir over!');

    mgdb.DatabaseBackup(null, null, false);

  });

};


RunBackupSchedule();

//test
comutil.CheckAndRmBackupDir(comutil.dump_dir);


var RunAutoArchiveSchedule = function () {

  console.log('RunAutoArchiveSchedule');

  //run schedule job
  var rule = new schedule.RecurrenceRule();

  var trigTime = [];
  trigTime.push(1);
  trigTime.push(2);
  trigTime.push(3);
  trigTime.push(4);
  trigTime.push(5);
  trigTime.push(6);
  rule.hour = trigTime;
  rule.minute = 0;


  // rule.dayOfWeek = [0]; //sunday
  // rule.hour = 4;        // am 4:00
  // rule.minute = 0;

  var job = schedule.scheduleJob(rule, function(){

    console.log('doing Automatic Project Archive...');

    exportlogs.AutoPrjArchive();    

    console.log('RunAutoArchiveSchedule over!');


  });

};

RunAutoArchiveSchedule();


//exportlogs.AutoPrjArchive();



// var domain = require('domain');

// //引入一个domain的中间件，将每一个请求都包裹在一个独立的domain中
// //domain来处理异常
// app.use(function (req,res, next) {
//   var d = domain.create();
//   //监听domain的错误事件
//   d.on('error', function (err) {
//     console.log(err);
//     res.statusCode = 500;
//     res.json({sucess:false, messag: '服务器异常'});
//     d.dispose();
//   });
  
//   d.add(req);
//   d.add(res);
//   d.run(next);
// });


process.on('uncaughtException', function (err) {
  console.log(err);
});

// disable console output
//console.log = function(){};

//test distance
//var dis = comutil.CalcLatLonDistance(30.509258, 114.387520, 30.511774, 114.416618);
// var dis = comutil.CalcLatLonDistance(30.511774, 114.416618, 30.509258, 114.387520);
// console.log('dis=' + dis);





