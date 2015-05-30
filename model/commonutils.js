/*******************************************************************************************
Filename    : commonutils.js
Summary     : common and const defines
Version     : 1.0
Created     : 2015-02-07
Author      : Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/

var crypto = require('crypto');
var fs = require('fs');
var http = require('http');
//var path = require('path');
var mgdb = require('./mgdb');
var xlsx = require('./xlsx');
var schedule = require('node-schedule');
var path = require('path');

//
// exports variants
//

exports.redirect_timeout = 3000;
exports.webserver_port = 3000;
//exports.webserver_port = 80;
// in file: johnnyMsgHandler.js : getMedia.GetAccessToken();


//
// database backup and restore
//

//709
// exports.dump_dir = '/home/johnny/js/dbbackup';
// exports.dump_dbname = 'worklogsys';
// exports.dump_dumpbin = '/home/johnny/js/mongodb/mongodb-linux-i686-2.6.0/bin/mongodump';
// exports.dump_restorebin = '/home/johnny/js/mongodb/mongodb-linux-i686-2.6.0/bin/mongorestore';

//hq
exports.dump_dir = '/home/johnny/test/web/dbbackup';
exports.dump_dbname = 'worklogrecord';
exports.dump_dumpbin = '/home/johnny/mongodb/mongodb-linux-x86_64-2.6.6/bin/mongodump';
exports.dump_restorebin = '/home/johnny/mongodb/mongodb-linux-x86_64-2.6.6/bin/mongorestore';
exports.LocationArrayFile = '/home/johnny/test/web/wis_v2/wis/locArray.json';

//qingcloud
// exports.dump_dir = '/home/web/dbbackup';
// exports.dump_dbname = 'worklogrecord';
// exports.dump_dumpbin = '/home/software/mongodb/mongodb-linux-x86_64-2.6.6/bin/mongodump';
// exports.dump_restorebin = '/home/software/mongodb/mongodb-linux-x86_64-2.6.6/bin/mongorestore';
// //exports.LocationArrayFile = '/home/web/wis/locInfoArray.json';
// exports.LocationArrayFile = '/home/web/wis_v2/wisv2/locInfoArray.json';


//
// database collection name
exports.sysrecord_collection_name = 'sysrecords';

//
// subhtml generate
exports.subhtml_templatehtmlname = 'reg.html';
exports.subhtml_errorhtmlname = 'suberror.html';
//exports.subhtml_absolutewebroot = '/home/johnny/js/test/wis/public';   //709
exports.subhtml_absolutewebroot = '/home/johnny/test/web/wis/public';  //hq
//exports.subhtml_absolutewebroot = '/home/web/wis/public';                //qingcloud
//exports.subhtml_absolutewebroot = '/home/web/wis_v2/wisv2/public';                //qingcloud




//------------------------------------------------------------------------------------------------------

exports.subhtml_subdir = 'subhtmls';
exports.subhtml_newprefix = 'register_';
exports.subhtml_stringtoreplace = 'weixin_id_here';
//exports.globleip = '121.201.13.217';
exports.globleip = 'wx.hanqtech.com';
exports.location_suffix = '_location.jpg';

//
// const
//
exports.dbname = 'mongodb://localhost/worklogrecord';
exports.uploadDir = './public/upload/';

exports.supUser = 'johnny';
exports.supPassword = '123';
exports.supSessionRole = 'supervisor';
exports.supLoginPage = '/supervisor_login.html';

exports.userLoginPage = '/user_login.html';

exports.adminUser = 'administrator';


//
// submit 
exports.submit_img_dir = 'incomingimg';
exports.submit_location_trycount = 2;

//export
exports.export_dir = 'download';
exports.export_xlsx_filename = 'worklog.xlsx';
exports.export_xlsx_sheetname = 'exported_worklog';

//
// subscribe result msg
exports.subscribe_resultmsg_ok = '注册成功!';
exports.subscribe_resultmsg_error = '注册失败!';
exports.subscribe_resultmsg_error_prjerror = '您不属于这个项目!';

//
// subscribe state
exports.substate_start = 1;
exports.substate_stop = 0;

//
// modal confirm btn 
exports.mbtn_id_superdeletelog = 'mbtnSuperDeleteSyslog';  //to delete sys worklog
exports.mbtn_id_tutordeletelog = 'mbtnTutorDeleteSyslog';

exports.mbtn_id_superrestorelog = 'mbtnSuperRestoreSyslog';  //to restore sys worklog
//exports.id_removedatabase = 'removedatabase';

//
// subscribe tip message
exports.submsg_start = '您现在可以开始提交文字和图片，完毕后请选择“信息提交”->“结束提交”来完成一次工作提交，否则提交内容不会被保存!';
exports.submsg_stop = '本次工作日志已提交';
exports.submsg_tip1 = '请先选择“信息提交”->“开始提交”';
//exports.submsg_resubscribe = '系统数据已经重置，您需要重新关注本微信号';
exports.submsg_resubscribe = '您尚未成功注册，或系统管理员重置了系统数据，请重新关注微信号后，正确的填写注册信息';
exports.submsg_abnormal = '系统异常错误，请联系管理员!';
//exports.submsg_location_tryagain = '微信定位服务器繁忙，请退出并重新进入公众号界面';
exports.submsg_location_tryagain = '微信定位服务器繁忙，请稍等或再次选择“信息提交”->“开始提交”';

exports.default_weixinid = 'default_weixin_id';

//
// const defined msg
//

//
// role
exports.userrole = {};
exports.userrole.student = 'student';
exports.userrole.tutor = 'tutor';
exports.userrole.super = 'administrator';

exports.modifytype = {};
exports.modifytype.info = 'info';
exports.modifytype.password = 'password';

//
// sidebar激活索引
exports.sidebaract = {};

exports.sidebaract.super = {};
exports.sidebaract.super.sysinit        = 1; //系统初始化
exports.sidebaract.super.viewmembers    = 2; //成员信息查看
exports.sidebaract.super.addnewstudent  = 3; //新增学生记录
exports.sidebaract.super.viewsyslog     = 4; //系统日志查看
exports.sidebaract.super.sysdatabackup  = 5; //系统数据备份
exports.sidebaract.super.sysdatarestore = 6; //系统数据恢复
exports.sidebaract.super.modifypass     = 7; //修改密码
exports.sidebaract.super.logout         = 8; //退出登录
exports.sidebaract.super.viewprjs       = 9; //项目信息查看

//exports.sidebaract.tutor = 'tutor';
exports.sidebaract.tutor = {};
exports.sidebaract.tutor.viewstudents   = 1; //管理学生信息
exports.sidebaract.tutor.modifyselfinfo = 2; //修改个人信息
exports.sidebaract.tutor.modifyselfpass = 3; //修改个人密码
exports.sidebaract.tutor.viewworklog    = 4; //管理工作日志
exports.sidebaract.tutor.queryworklog   = 5; //查询工作日志
exports.sidebaract.tutor.logout         = 6; //退出登录

//exports.sidebaract.student = 'student';
exports.sidebaract.student = {};
exports.sidebaract.student.modifyselfinfo     = 1; //修改个人信息
exports.sidebaract.student.modifyselfpassword = 2; //修改个人密码
exports.sidebaract.student.viewworklog        = 3; //管理工作日志
exports.sidebaract.student.logout             = 4; //退出登录

//
// breadcrumb text and href
//l
exports.bread = {};

exports.bread.tip_text = '信息提示';

exports.bread.super_sysinit_text = '系统初始化';
exports.bread.super_sysinit_href = '/super_sysinit';
exports.bread.super_viewmembers_text = '成员信息查看';
exports.bread.super_viewmembers_href = '/super_viewmembers';
exports.bread.super_viewprjs_text = '项目信息查看';
exports.bread.super_viewprjs_href = '/super_viewprjs';
exports.bread.super_addnewstudent_text = '新增学生记录';
exports.bread.super_addnewstudent_href = '/super_addnewstudent';
exports.bread.super_viewsyslog_text = '系统日志查看';
exports.bread.super_viewsyslog_href = '/super_viewsyslog';
exports.bread.super_sysdatabackup_text = '系统数据备份';
exports.bread.super_sysdatabackup_href = '/super_sysdatadump';
exports.bread.super_sysdatarestore_text = '系统数据恢复';
exports.bread.super_sysdatarestore_href = '/super_sysdatarestore';
exports.bread.super_logout_text = '退出登录';
exports.bread.super_logout_href = '/super_logout';
exports.bread.super_modifyselfpass_text = '修改密码';
exports.bread.super_modifyselfpass_href = '/super_modifyselfpassword';

exports.bread.tutor_viewstudents_text = '管理学生信息';
exports.bread.tutor_viewstudents_href = '/tutor_viewstudents';
exports.bread.tutor_modifyselfinfo_text = '修改个人信息';
exports.bread.tutor_modifyselfinfo_href = '/tutor_modifyselfinfo';
exports.bread.tutor_modifyselfpass_text = '修改个人密码';
exports.bread.tutor_modifyselfpass_href = '/tutor_modifyselfpass';
exports.bread.tutor_viewworklog_text = '管理工作日志';
exports.bread.tutor_viewworklog_href = '/tutor_viewworklog';
//exports.bread.tutor_queryworklog_text = '查询工作日志';
//exports.bread.tutor_queryworklog_href = '/tutor_queryworklog';
exports.bread.tutor_logout_text = '退出登录';
exports.bread.tutor_logout_href = '/tutor_logout';

exports.bread.student_modifyselfinfo_text = '修改个人信息';
exports.bread.student_modifyselfinfo_href = '/student_modifyselfinfo';
exports.bread.student_modifyselfpassword_text = '修改个人密码';
exports.bread.student_modifyselfpassword_href = '/student_modifyselfpass';
exports.bread.student_viewworklog_text = '管理工作日志';
exports.bread.student_viewworklog_href = '/student_viewworklog';
exports.bread.student_logout_text = '退出登录';
exports.bread.student_logout_href = '/student_logout';

//
// link
//
exports.link = {};
exports.link.super_queryresult_delete = 'super_deletesyslog';
exports.link.super_queryresult_detail = 'super_syslogdetails';
exports.link.super_queryresult_export = 'super_syslogexport';

exports.link.tutor_queryresult_delete = 'tutor_deletesyslog';
exports.link.tutor_queryresult_detail = 'tutor_syslogdetails';
exports.link.tutor_queryresult_export = 'tutor_syslogexport';

exports.link.student_queryresult_delete = 'student_deletesyslog';
exports.link.student_queryresult_detail = 'student_syslogdetails';
exports.link.student_queryresult_export = 'student_syslogexport';

exports.link.tutor_queryworklog = 'tutor_queryworklog';
exports.link.super_queryworklog = 'super_queryworklog';

//
// export title in excel
//

exports.exceltitle = {};
exports.exceltitle.index = '提交序号';
exports.exceltitle.stuName = '学生姓名';
exports.exceltitle.stuNumber = '学号';
exports.exceltitle.prjName = '项目名称';
exports.exceltitle.tutorName = '教师姓名';
exports.exceltitle.seq = '序号';
exports.exceltitle.location = '提交地点';
exports.exceltitle.time = '时间';
exports.exceltitle.logText = '文本日志';
exports.exceltitle.logPic = '图片日志';

//
// 提示信息
//

exports.msg = {};

//
// 通用成功信息
exports.msg.title_ok = '成功';
exports.msg.stitle_ok = '\t您的操作已经成功！';
exports.msg.msg_ok = '操作成功！';

exports.msg.msg_ok_modify = '修改成功！';

//
// 通用错误信息
exports.msg.title_error = '错误';
exports.msg.stitle_error = '\t操作返回错误';
exports.msg.msg_error = '操作失败！';
exports.msg.msg_error_abnormal = '异常错误，请联系管理员！';

//
// supervisor
//

//
// 登录提示信息字符串
exports.msg.msg_accessdeny = '请登录';
exports.msg.title_accessdeny = '拒绝访问';
exports.msg.stitle_accessdeny = '\t未经授权的访问';

exports.msg.msg_error_userorpass = '用户名或密码错误';
exports.msg.msg_error_role = '请选择学生或教师登录';



//
// 系统初始化
//exports.msg.msg_sysinit = '请选择系统初始化文件（xlsx格式）';
exports.msg.title_sysinit = '系统初始化';
//exports.msg.stitle_sysinit = '\t请谨慎操作，系统初始化后，以前的数据将不可恢复！';
exports.msg.stitle_sysinit = '\t数据可追加导入，请保证格式匹配、内容正确！';

exports.msg.msg_error_xlsxfile = '初始化文件格式错误';
//exports.msg.msg_error_sysinit = '系统初始化错误！';
exports.msg.msg_error_sysinit = '数据导入错误！';


//
// 查看成员信息
exports.msg.title_viewmembers = '查看成员信息列表';
exports.msg.stitle_viewmembers = '\t可以进行查看、修改、删除、重置成员记录信息等操作';

//
// 查看项目信息
exports.msg.title_viewprjs = '查看项目信息列表';
exports.msg.stitle_viewprjs = '\t可以进行查看、修改、归档项目记录信息等操作';

//
// 增加学生信息
exports.msg.title_addnewstudent = '增加新成员信息';
exports.msg.stitle_addnewstudent = '\t请填写新成员信息';
exports.msg.msg_addnewstudent = '请注意，学生学号与教师工号是唯一的登录名，登录密码默认为手机号，登录后可修改';
exports.msg.msg_ok_addnewstudent = '增加新成员信息成功！';
exports.msg.msg_error_addnewstudent = '增加新成员信息失败！';

//
// 重置密码
exports.msg.msg_error_resetpassword = '重置密码失败！';
exports.msg.msg_error_savepassword = '保存失败！';
exports.msg.msg_error_notfound = '数据记录未发现！';

//
// 修改成员信息
exports.msg.msg_modifymember = '修改成员信息！';
exports.msg.msg_ok_modifymember = '修改成员信息成功 ';

//
// 修改项目信息
exports.msg.msg_modifyprj = '修改项目信息！';
exports.msg.msg_ok_modifyprj = '修改项目信息成功 ';

//
// 查看日志信息
exports.msg.title_viewsysworklog = '管理工作日志信息列表';
exports.msg.stitle_viewsysworklog = '\t可以进行查看、删除工作日志信息等操作';

//
// 备份系统
exports.msg.title_sysdump = '系统数据备份';
exports.msg.stitle_sysdump = '\t系统数据将按日期进行备份';
exports.msg.msg_sysdump = '系统数据备份';

//
// 恢复系统
exports.msg.title_viewrestore = '系统数据恢复';
exports.msg.stitle_viewrestore = '\t请选择需要恢复的备份数据，之前的数据将被覆盖';
exports.msg.msg_viewrestore = '系统数据恢复';

exports.msg.title_modifyadminselfpass = '修改管理员密码';
exports.msg.stitle_modifyadminselfpass = '\t请牢记管理员密码';
exports.msg.msg_modifyadminselfpass = '请修改管理员密码';

//
// tutor
//

//
// 管理学生信息
exports.msg.title_tutorviewstudents = '管理学生信息';
exports.msg.stitle_tutorviewstudents = '\t您可以查看、修改、删除学生记录信息';
exports.msg.msg_tutorviewstudents = '学生信息如下';
exports.msg.msg_error_tutorviewstudents = '学生信息为空';

//
// 修改学生信息
exports.msg.title_modifystudents = '修改学生信息';
exports.msg.stitle_modifystudents = '\t您可以查看、修改、删除学生记录信息';
exports.msg.msg_modifystudents = '学生信息如下';
exports.msg.msg_error_modifystudents = '学生信息为空';
exports.msg.msg_ok_modifystudents = '修改学生信息成功！';

//
// 修改学生密码
exports.msg.msg_ok_modifystudentspass = '重置学生密码成功，密码已经重置为学生手机号';


//
// 修改教师信息/密码

exports.msg.title_modifytutorselfinfo = '修改教师信息';
exports.msg.stitle_modifytutorselfinfo = '\t请注意，教师工号是唯一的登录名，登录密码默认为手机号，登录后可修改';
exports.msg.msg_modifytutorselfinfo = '请修改教师信息';
exports.msg.title_modifytutorselfpass = '修改教师密码';
exports.msg.stitle_modifytutorselfpass = '\t请注意，教师工号是唯一的登录名，登录密码默认为手机号，登录后可修改';
exports.msg.msg_modifytutorselfpass = '请修改教师密码';

//
//
exports.msg.title_viewstudents = '管理系统备份恢复信息';
exports.msg.stitle_viewstudents = '\t您可以恢复系统备份记录';

//
// student
//

exports.msg.title_modifystuselfinfo = '修改学生信息';
exports.msg.stitle_modifystuselfinfo = '\t请注意，学生学号是唯一的登录名，登录密码默认为手机号，登录后可修改';
exports.msg.msg_modifystuselfinfo = '请修改学生信息';
exports.msg.title_modifystuselfpass = '修改学生密码';
exports.msg.stitle_modifystuselfpass = '\t请注意，学生学号是唯一的登录名，登录密码默认为手机号，登录后可修改';
exports.msg.msg_modifystuselfpass = '请修改学生密码';



//
// exports functions
//

exports.CodedPassword = function (plainpass) {
	var sh256 = crypto.createHash('sha256');
	sh256.update(plainpass);
	var codedpass = sh256.digest('base64');
	console.log(codedpass);
	return codedpass;
};

exports.ExecCmd = function (cmd_str,  callback) {
	var exec = require('child_process').exec;
	exec(cmd_str, function(err, stdout, stderr){
		callback(err, stdout, stderr);
	});
};

exports.GetTimeString = function (format_flag) {
	var now = new Date();
	
	var y = now.getFullYear();
	//console.log('year=' + y);

	var m = now.getMonth()+1;
	//console.log('month=' + m);
	if(m<10)
		m = '0' + m;
	//console.log('now month=' + m);

	var d = now.getDate();
	//console.log('day=' + d);
	if(d<10)
		d = '0' + d;
	//console.log('now day=' + d);
	var h = now.getHours();
	//console.log('hour=' + h);
	if(h<10)
		h = '0' + h;
	//console.log('now hour=' + h);
	var n = now.getMinutes();
	//console.log('n=' + n);
	if(n<10)
		n = '0' + n;
	//console.log('now n=' + n);
	var s = now.getSeconds();
	//console.log('s=' + s);
	if(s<10)
		s = '0' + s;
	//console.log('now s=' + s);
    
    if(format_flag==1)
    	return (y+m+d+h+n+s);
    else
    	return (y+'-'+m+'-'+d+' '+h+':'+n+':'+s);
};

exports.GetDirectories = function (root) {
	var result = [];
	var dirs = fs.readdirSync(root);

	dirs.forEach( function(dir){
		//if root end with '/', if not
		//...
		var pathName = root +'/' + dir;
		var stat = fs.lstatSync(pathName);
		if(stat===undefined)
			return;

		if(stat.isDirectory())
		{
			var timeStr = pathName.split('_');
			result.push(timeStr[1]);
		}
	});

	return result;
};

String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

// 20150308170822 --> 2015-03-08 17:08:22
exports.TimeStringToFormat = function (str_time) {
	
	//check input and output?
	var str = str_time.trim();
	if(str.length!=14)
		return null;
	
	//check if all numbers
	//...

	var outStr = [str.slice(0,4), '-', str.slice(4,6), '-', str.slice(6,8), ' ', str.slice(8,10), ':', str.slice(10,12), ':', str.slice(12,14)].join('');
	return outStr;
};

// date --> yyyy-mm-dd
exports.DateToString = function (date_time) {

    try
    {
    	var y = date_time.getFullYear();
		//console.log('year=' + y);

		var m = date_time.getMonth()+1;
		//console.log('month=' + m);
		if(m<10)
			m = '0' + m;
		//console.log('now month=' + m);

		var d = date_time.getDate();
		//console.log('day=' + d);
		if(d<10)
			d = '0' + d;

    }
    catch(error)
    {
    	console.log('DateToString error:' + error);
    	return 'error';
    }

	return y + '/' + m + '/' + d;
};

// not good!
exports.HttpGetFile = function (file_url, file_local, callback) {
	
	//check input and output?
	//...

	http.get(file_url, function(response){

		var chunks = [];
		var size = 0;
		
		response.on('data', function (chunk)
		{
			chunks.push(chunk);
			size += chunk.length;
		});
		//能否优化，直接把chunk写文件？
		response.on('end', function ()
		{
			var data = new Buffer(size);
			for (var i = 0, pos = 0, l = chunks.length; i < l; i++)
			{
				var chunk = chunks[i];
				chunk.copy(data, pos);
				pos += chunk.length;
			}
			fs.writeFile(file_local, data, function (err){
				callback(err);
			});
		});

	});
};

// not good
// exports.HttpGetFile = function (file_url, file_local, callback) {

// 	//check input and output?
// 	//...

// 	var file = fs.createWriteStream(file_local);

// 	var request = http.get(file_url, function(response){
// 		response.pipe(file);
// 		file.on('finish', function(){
// 			file.close(callback);
// 		});
// 	});
// };


// even worse
// exports.HttpGetFile = function (file_url, file_local, callback) {

// 	//check input and output?
// 	//...

// 	var file = fs.createWriteStream(file_local);
	
// 	http.get(file_url, function(res){

// 		res.on('data', function(data){
// 			file.write(data);
// 		}).on('end', function(){
// 			file.end();
// 			callback();
// 		});
// 	});
// };

// 3/5
// exports.HttpGetFile = function (file_url, file_local, callback) {
	
// 	//check input and output?
// 	//...

// 	http.get(file_url, function(response){

// 		var chunks = [];
// 		var size = 0;
// 		var file = fs.createWriteStream(file_local);

// 		response.on('data', function (chunk)
// 		{
// 			chunks.push(chunk);
// 			//size += chunk.length;
// 		});

// 		//能否优化，直接把chunk写文件？
// 		response.on('end', function ()
// 		{
// 			//var file = fs.createWriteStream(file_local);

// 			for (var i = 0; i < chunks.length; i++)
// 			{
// 				file.write(chunks[i]);

// 				// file.write(chunks[i], function(){
// 				// 	if(i==chunks.length-1)
// 				// 	{
// 				// 		callback();
// 				// 	}
// 				// });

// 			}

// 			file.end();
// 			callback();
// 		});

// 	});
// };

exports.DirToZip = function (dir_path, zip_file) {

	//check dir existed
	//...

	//var next = _.after(2, callback);

	var fstream = require('fstream');
	var tar = require('tar');
	var zlib = require('zlib');

	fstream.Reader({'path': dir_path, 'type':'Directory'})
	.pipe(tar.Pack())
	.pipe(zlib.Gzip())
	.pipe(fstream.Writer({'path': zip_file}));

	// w.on('end', function(){
	// 	console.log('w end!');
	// });
	// w.on('finish', function(){
	// 	console.log('w finish!');
	// });

	// r.on('end', function(){
	// 	console.log('r end!');
	// });
	// r.on('finish', function(){
	// 	console.log('r finish!');
	// });

	// console.log('start to download!');
 //    res.download(zip_file);

};

exports.CopyFile = function (src_file, dest_file) {

	console.log('CopyFile:' + src_file + ' to:' + dest_file);

	//if not exists
	try
	{
		var fileData = fs.readFileSync(src_file);
	    fs.writeFileSync(dest_file, fileData);
	}
	catch(e)
	{
		console.log('CopyFile error:' + e);
	}
	
};

// exports.CopyFile = function (src_file, dest_file) {
// 	var readable = fs.createReadStream(src_file);
// 	var writable = fs.createWriteStream(dest_file);
// 	readable.pipe(writable);
// };

var GetRegHtmls = function (reghtml_dir, reg_prefix) {

	console.log('reghtml_dir=' + reghtml_dir);
	console.log('reg_prefix=' + reg_prefix);

	var regHtmls = [];
	var files = fs.readdirSync(reghtml_dir);

	files.forEach(function(file){
		var pathName = reghtml_dir + '/' + file;
		var stat = fs.lstatSync(pathName);

		//console.log('pathName=' + pathName);

		if(stat===undefined) return;

		if(!stat.isDirectory())
		{
			var fileName = path.basename(pathName);
			//console.log('fileName=' + fileName);
			//console.log('subhtml_newprefix=' + reg_prefix);
			if(fileName.indexOf(reg_prefix)==0)
			{
				regHtmls.push(pathName);
			}
		}
	});

	console.log('regHtmls:')
	for(var i=0; i<regHtmls.length; i++)
	{
		console.log(regHtmls[i]);
	}

	return regHtmls;

};

var RemoveFiles = function (reg_htmls) {

	try
	{
		for(var i=0; i<reg_htmls.length; i++)
		{
			fs.unlinkSync(reg_htmls[i]);
		}

	}
	catch(e)
	{
		console.log('RemoveFiles error:' + e);
	}
	
};

CleanRegHtmls = function () {
	var regHtmls = GetRegHtmls(this.subhtml_absolutewebroot + '/' + this.subhtml_subdir, this.subhtml_newprefix);
	RemoveFiles(regHtmls);
};

exports.RunCleanSchedule = function () {

    console.log('RunCleanSchedule');

	//run schedule job
	var rule = new schedule.RecurrenceRule();
	var trigTime = [];
	trigTime.push(4);
	//trigTime.push(50);
	rule.hour = trigTime;
	var job = schedule.scheduleJob(rule, function(){
	  console.log('start to cleanup');
	  CleanRegHtmls();
	});

};


var EARTH_RADIUS = 6378137.0;    //单位 m
var PI = Math.PI;

function getRad(d){
    return d*PI/180.0;
}


/**

 * approx distance between two points on earth ellipsoid  (return value is meter!)

 * @param {Object} lat1

 * @param {Object} lng1

 * @param {Object} lat2

 * @param {Object} lng2

 */

exports.CalcLatLonDistance = function (lat1,lng1,lat2,lng2) {

	//otherwise return NaN
	if(lat1==lat2 && lng1==lng2)
		return 0;

    var f = getRad((lat1 + lat2)/2);

    var g = getRad((lat1 - lat2)/2);

    var l = getRad((lng1 - lng2)/2);

    

    var sg = Math.sin(g);

    var sl = Math.sin(l);

    var sf = Math.sin(f);

    

    var s,c,w,r,d,h1,h2;

    var a = EARTH_RADIUS;

    var fl = 1/298.257;

    

    sg = sg*sg;

    sl = sl*sl;

    sf = sf*sf;

    

    s = sg*(1-sl) + (1-sf)*sl;

    c = (1-sg)*(1-sl) + sf*sl;

    

    w = Math.atan(Math.sqrt(s/c));

    r = Math.sqrt(s*c)/w;

    d = 2*w*a;

    h1 = (3*r -1)/2/c;

    h2 = (3*r +1)/2/s;

    var dis = d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    
    console.log('dis = ' + dis);
    if(isNaN(dis))
    {
    	return 8.8; //not very good
    }    	
    else
    	return dis;
};

// far distance of two point, 50m
exports.FarDistance = 50;

// if linux timestamp, should be multipled by 1000
exports.Time2Date = function (ms) {

	var date = new Date(ms);

	var Y = date.getFullYear() + '-';
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
	var D = date.getDate() + ' ';
	var h = date.getHours() + ':';
	var m = date.getMinutes() + ':';
	var s = date.getSeconds(); 
	
	return (Y+M+D+h+m+s);
};

// if linux timestamp, should be multipled by 1000
exports.Time2DateString = function (ms) {

	var date = new Date(ms);

	var Y = date.getFullYear();
	var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
	var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
	var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(); 
	
	return (Y+M+D+h+m+s);
};

function ArrayTransO2S(obj_array, str_array){

	// console.log('ArrayTransO2S');
	// console.log('obj_array:');
	// console.log(obj_array);

	//clear str_array
	//str_array = []; // this is very important! should be comment!!

	for(ele in obj_array){
		//var jsonText = JSON.stringify(obj_array[ele], null, 4);
		//console.log('jsonText=' + jsonText);
		str_array.push(obj_array[ele]);
	}

	//console.log('str_array:');
	//console.log(str_array);
};

function ArrayTransS2O(str_array, obj_array){

	// console.log('ArrayTransS2O');
	// console.log('str_array:');
	// console.log(str_array);

	//clear obj_array
	//obj_array = [];

	var len = str_array.length;
	//console.log('len=' + len);
	for(var i=0; i<len; i++)
	{
		//console.log('str_array[' + i + ']=' + str_array[i]);
		var obj = str_array[i];
		//console.log('obj=');
		//console.log(obj);
		if(obj==null)
			continue;
		
		obj_array[obj.wid] = obj;
	}

	//console.log('obj_array:');
	//console.log(obj_array);
};

function ArrayToFile(str_array, file) {
	//check
	if(str_array==null || str_array.length==0)
	{
		console.log('ArrayToFile str_array is null');
		return false;
	}

	//console.log('SaveObjToFile obj=');
	//console.log(obj);

	//transform obj to string
	var jsonText = JSON.stringify(str_array, null, 4);
	//console.log('jsonText=' + jsonText + ' file=' + file);

	fs.writeFileSync(file, jsonText);
	return true;
};

function FileToArray (file) {

	//console.log('file=' + file);

	//check
	// if(!fs.exists(file))
	// {
	// 	console.log('file: ' + file + ' not exists!');
	// 	return null;
	// }

	var fileData;

	try
	{
		fileData = fs.readFileSync(file);
	}
	catch(e)
	{
		console.log(e);
		return null;
	}
    
	//console.log('fileData=' + fileData);
	var str_array = [];
	str_array = JSON.parse(fileData);
	//console.log('str_array in function:');
	//console.log(str_array);
	return str_array;
};

// function FileToArray (file, callback) {

// 	//console.log('file=' + file);

// 	//check
// 	fs.exists(file, function(exists){
// 		if(!exists)
// 		{
// 			console.log('file: ' + file + ' not exists!');
// 			callback(false, null);
// 		}
// 		else
// 		{
// 			var fileData = fs.readFileSync(file);
// 			//console.log('fileData=' + fileData);
// 			var str_array = [];
// 			str_array = JSON.parse(fileData);
// 			//console.log('str_array in function:');
// 			//console.log(str_array);
// 			callback(true, str_array);
// 		}
// 	});    
// };

exports.SaveObjArray = function (obj_array, file) {

	var strArray = [];
	ArrayTransO2S(obj_array, strArray);
	ArrayToFile(strArray, file);
};

exports.LoadObjArray = function (file, obj_array) {

	var strArray = [];
	strArray = FileToArray(file);
	//var objArray = [];
	if(strArray!=null)
		ArrayTransS2O(strArray, obj_array);
	else
		obj_array = null;

	//return objArray;
}
