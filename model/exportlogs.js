/*******************************************************************************************
Filename    : xlsx.js
Summary     :  excell file with xlsx format read and write interface, using node-xlsx library
Version     :1.0
Created     :2015-02-07
Author      :Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/
var xlsxwriter = require('xlsx-writestream');
var fs = require('fs');
var path = require('path');

var mgdb = require('./mgdb');
var xlsx = require('./xlsx');
var comutil = require('./commonutils');


var MakeDownloadDir = function (docs, bArchive) {

	var submitCount = docs.workRecords.length;
	var downDir  = "";

	//mkdir prjName
	if(bArchive)
	{
		var fsPrjDir =  comutil.subhtml_absolutewebroot + '/' +comutil.export_dir + '/' + docs.prjName;
		if(!fs.existsSync(fsPrjDir))
		{
			console.log('mkdir ' + fsPrjDir);
			fs.mkdirSync(fsPrjDir, 0755);
		}	
	}


	if(!bArchive)
		downDir = docs.stuNumber + '_' + docs.prjName;
	else
		downDir = docs.prjName + '/' + docs.stuNumber + '_' + docs.prjName;

	//mkdir
	//var path = require('path');
	var fsDir = comutil.subhtml_absolutewebroot + '/' +comutil.export_dir + '/' + downDir;
	console.log('fsDir=' + fsDir);
	if(!fs.existsSync(fsDir))
	{
		console.log('mkdir');
		fs.mkdirSync(fsDir, 0755);
	}		

	//copy
	for(var i=0; i<submitCount; i++)
	{
		//location
		var locationFsAbsPath = comutil.subhtml_absolutewebroot + docs.workRecords[i].logLocation;		
		var strFilename = path.basename(locationFsAbsPath);
		var destFile = fsDir + '/' + strFilename;
		
		console.log('locationFsAbsPath=' + locationFsAbsPath + ' destFile=' + destFile);

		comutil.CopyFile(locationFsAbsPath, destFile);

		for(var j=0; j<docs.workRecords[i].logPicPath.length; j++)
		{
			//logPic
			var picFsAbsPath = comutil.subhtml_absolutewebroot + docs.workRecords[i].logPicPath[j];		
			strFilename = path.basename(picFsAbsPath);
			destFile = fsDir + '/' + strFilename;
			
			console.log('picFsAbsPath=' + picFsAbsPath + ' destFile=' + destFile);

			comutil.CopyFile(picFsAbsPath, destFile);
		}
	}

	return fsDir;
};

// var ExportXlsx = function (docs, file_name, sheet_name, callback) {

// 	var data = [];
// 	var i = 0;
// 	var j = 0;
// 	var k = 0;

// 	data[0] = new Array();
// 	data[0].push(comutil.exceltitle.index);
// 	data[0].push(comutil.exceltitle.stuName);
// 	data[0].push(comutil.exceltitle.stuNumber);
// 	data[0].push(comutil.exceltitle.prjName);
// 	data[0].push(comutil.exceltitle.tutorName);

// 	data[0].push(comutil.exceltitle.seq);
// 	data[0].push(comutil.exceltitle.location);
// 	data[0].push(comutil.exceltitle.time);
// 	data[0].push(comutil.exceltitle.logText);
// 	data[0].push(comutil.exceltitle.logPic);

// 	var number = 0;
// 	for(var m=0; m<docs.workRecords.length; m++)
// 	{
// 		var n = docs.workRecords[m].logText.length;
// 		var p = docs.workRecords[m].logPicPath.length;
// 		if(n>p)
// 			number += n;
// 		else
// 			number += p;
// 	}

// 	console.log('number=' + number);

// 	for(i=1; i<=number; i++)
// 		data[i] = new Array();

// 	k = 1;

// 	for(i=0; i<docs.workRecords.length; i++)
// 	{
// 		number = docs.workRecords[i].logText.length;
// 		if(number<docs.workRecords[i].logPicPath.length)
// 	 		number = docs.workRecords[i].logPicPath.length;

// 	 	console.log('i=' + i + ' number=' + number + 'k=' + k);

// 	 	for(j=0; j<number; j++)
// 	 	{
// 	 		console.log('j=' + j);

// 	 		data[k+j].push(i+1);
// 	 		data[k+j].push(docs.stuName);
// 	 		data[k+j].push(docs.stuNumber);
// 	 		data[k+j].push(docs.prjName);
// 	 		data[k+j].push(docs.tutorName);

// 	 		data[k+j].push(j+1);

// 	 		var logLocation = ' ';
// 	 		if(docs.workRecords[i].logLocation!=undefined)
// 	 			logLocation = path.basename(docs.workRecords[i].logLocation);

// 	 		data[k+j].push(logLocation);
			
// 			var strTime = ''
// 			if(docs.workRecords[i].startTime!=undefined)
// 				strTime += docs.workRecords[i].startTime;
// 			else
// 				strTime += ' ';

// 			strTime += '  --  ';

// 			if(docs.workRecords[i].stopTime!=undefined)
// 				strTime += docs.workRecords[i].stopTime;
// 			else
// 				strTime += ' ';

// 			data[k+j].push(strTime);

// 			var logText = ' ';
// 			if(docs.workRecords[i].logText[j]!=undefined)
// 				logText = path.basename(docs.workRecords[i].logText[j]);
			
// 			data[k+j].push(logText);

// 			var logPic = ' ';
// 			if(docs.workRecords[i].logPicPath[j]!=undefined)
// 				logPic = path.basename(docs.workRecords[i].logPicPath[j]);

// 			data[k+j].push(logPic);
// 	 	}

// 	 	k += number;
// 	}

// 	console.log(data);

// 	xlsx.SaveToFile(file_name, sheet_name, data, function(err){
// 		callback(err);		
// 	});
// };

var ExportXlsx = function (docs, file_name, sheet_name, callback) {

	var data = [];
	var i = 0;
	var j = 0;
	var k = 0;

	data[0] = new Array();
	data[0].push(comutil.exceltitle.index);
	data[0].push(comutil.exceltitle.stuName);
	data[0].push(comutil.exceltitle.stuNumber);
	data[0].push(comutil.exceltitle.prjName);
	data[0].push(comutil.exceltitle.tutorName);

	data[0].push(comutil.exceltitle.seq);
	data[0].push(comutil.exceltitle.location);
	data[0].push(comutil.exceltitle.time);
	data[0].push(comutil.exceltitle.logText);
	data[0].push(comutil.exceltitle.logPic);

	var number = 0;
	for(var m=0; m<docs.workRecords.length; m++)
	{
		var n = docs.workRecords[m].logText.length;
		var p = docs.workRecords[m].logPicPath.length;
		if(n>p)
			number += n;
		else
			number += p;
	}

	console.log('number=' + number);

	for(i=1; i<=number; i++)
		data[i] = new Array();

	k = 1;

	for(i=0; i<docs.workRecords.length; i++)
	{
		number = docs.workRecords[i].logText.length;
		if(number<docs.workRecords[i].logPicPath.length)
	 		number = docs.workRecords[i].logPicPath.length;

	 	console.log('i=' + i + ' number=' + number + 'k=' + k);

	 	for(j=0; j<number; j++)
	 	{
	 		console.log('j=' + j);

	 		data[k+j].push(i+1);
	 		data[k+j].push(docs.stuName);
	 		data[k+j].push(docs.stuNumber);
	 		data[k+j].push(docs.prjName);
	 		data[k+j].push(docs.tutorName);

	 		data[k+j].push(j+1);

	 		var logLocation = ' ';
	 		if(docs.workRecords[i].logLocation!=undefined)
	 			logLocation = path.basename(docs.workRecords[i].logLocation);

	 		if(logLocation=="")
	 		{
	 			console.log('logLocation is empty!!');
	 		}
	 		else
	 		{
	 			console.log('logLocation is ' + logLocation);
	 			data[k+j].push(logLocation);
	 		}	 			
			
			var strTime = ''
			if(docs.workRecords[i].startTime!=undefined)
				strTime += docs.workRecords[i].startTime;
			else
				strTime += ' ';

			strTime += '  --  ';

			if(docs.workRecords[i].stopTime!=undefined)
				strTime += docs.workRecords[i].stopTime;
			else
				strTime += ' ';

			data[k+j].push(strTime);

			var logText = ' ';
			if(docs.workRecords[i].logText[j]!=undefined)
				logText = path.basename(docs.workRecords[i].logText[j]);
			
			data[k+j].push(logText);

			var logPic = ' ';
			if(docs.workRecords[i].logPicPath[j]!=undefined)
				logPic = path.basename(docs.workRecords[i].logPicPath[j]);

			data[k+j].push(logPic);
	 	}

	 	k += number;
	}

	console.log(data);

	// xlsx.SaveToFile(file_name, sheet_name, data, function(err){
	// 	callback(err);		
	// });

	SaveToFile(file_name, sheet_name, data, function(err){
		callback(err);		
	});
};

//data[0] is collumn name, and the number of collumns must be fixed
var SaveToFile = function(file_name, sheet_name, data, callback) {

	try
	{
		var writer = new xlsxwriter(file_name, {} /* options */);

		writer.getReadStream().pipe(fs.createWriteStream(file_name));

		writer.defineColumns([
		    { width: 10 }, // width is in 'characters'
		    { width: 12 },
		    { width: 20 },
		    { width: 25 },
		    { width: 12 },
		    { width: 10 },
		    { width: 60 },
		    { width: 45 },
		    { width: 50 },
		    { width: 50 }
		]);

		// var index = comutil.exceltitle.index; 
		// var stuName = comutil.exceltitle.stuName;
		// var stuNumber = comutil.exceltitle.stuNumber;
		// var prjName = comutil.exceltitle.prjName;
		// var tutorName = comutil.exceltitle.tutorName;
		// var seq = comutil.exceltitle.seq;
		// var location = comutil.exceltitle.location;
		// var time = comutil.exceltitle.time;
		// var logText = comutil.exceltitle.logText;
		// var logPic = comutil.exceltitle.logPic;

		for(var i=1; i<data.length; i++)
		{
			console.log('logText:' + data[i][8]);
			console.log('logLocation:' + data[i][6]);

			var logLocation = data[i][6];

			if(logLocation=="")
				logLocation = 'not_found';

			//add rows
			writer.addRow({
			    "提交序号": data[i][0],
			    "学生姓名": data[i][1],
			    "学号": data[i][2],
			    "项目名称": data[i][3],
			    "教师姓名": data[i][4],
			    "序号": data[i][5],
			    //交地点": {value:data[i][6], hyperlink:'./'+data[i][6]},
			    "提交地点": {value:logLocation, hyperlink:+logLocation},
			    "时间": data[i][7],
			    "文本日志": '' + data[i][8],
			    "图片日志": {value:data[i][9], hyperlink:'./'+data[i][9]},
			});
			// writer.addRow({
			//     index: data[i][0],
			//     stuName: data[i][1],
			//     stuNumber: data[i][2],
			//     prjName: data[i][3],
			//     tutorName: data[i][4],
			//     seq: data[i][5],
			//     location: {value:data[i][6], hyperlink:'./'+data[i][6]},
			//     time: data[i][7],
			//     logText: data[i][8],
			//     logPic: {value:data[i][9], hyperlink:'./'+data[i][9]},
			// });
		}

		// Finalize the spreadsheet. If you don't do this, the readstream will not end.
		writer.finalize();

		callback(null);

	}
	catch(err)
	{
		callback(err);
	}

};


exports.SysWorklogExport = function (req, res, role) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('SysWorklogExport id= ' + idStr);

	if(role==comutil.userrole.super)
	{
		actFlag = comutil.sidebaract.super.viewsyslog;
		breadText = comutil.bread.super_viewsyslog_text;
		breadHref = comutil.bread.super_viewsyslog_href;
		newPage = '/super_viewsyslog';
		redirectRender = 'super_redirect_delay';
	}
	else if(role==comutil.userrole.tutor)
	{
		actFlag = comutil.sidebaract.tutor.viewworklog;
		breadText = comutil.bread.tutor_viewworklog_text;
		breadHref = comutil.bread.tutor_viewworklog_href;
		newPage = '/tutor_viewworklog';
		redirectRender = 'tutor_redirect_delay';
	}
	else if(role==comutil.userrole.student)
	{
		actFlag = comutil.sidebaract.student.viewworklog;
		breadText = comutil.bread.student_viewworklog_text;
		breadHref = comutil.bread.student_viewworklog_href;
		newPage = '/student_viewworklog';
		redirectRender = 'student_redirect_delay';
	}
	else
	{
		console.log('SysWorklogExport role error:' + role);
		res.render('super_redirect_delay', 
	  	    {
	  	    	act: actFlag,
	      		msg: comutil.msg.msg_error_abnormal,
	      		title: comutil.msg.title_error, 
	      		smalltitle: comutil.msg.stitle_error, 
	      		breadtext: breadText,
	      		breadhref: breadHref,
	      		newpage:'/super_viewsyslog', 
	      		timeout:comutil.redirect_timeout
	  	    });

		return;
	}

	mgdb.FindOneById(mgdb.ModelSysRecord, idStr, function(err, docs){
		if(err)
		{
			console.log('abnormal error!');
			res.render(redirectRender, 
		  	    {
		  	    	act: actFlag,
		      		msg: comutil.msg.msg_error_abnormal,
		      		title: comutil.msg.title_error, 
		      		smalltitle: comutil.msg.stitle_error, 
		      		breadtext: breadText,
		      		breadhref: breadHref,
		      		newpage: newPage, 
		      		timeout:comutil.redirect_timeout
		  	    });
		}
		else
		{
			if(docs)
			{
				//make dir
				var dir = MakeDownloadDir(docs);
				if(dir==null)
				{
					console.log('MakeDownloadDir null!');
					res.render(redirectRender, 
				  	    {
				  	    	act: actFlag,
				      		msg: comutil.msg.msg_error_abnormal,
				      		title: comutil.msg.title_error, 
				      		smalltitle: comutil.msg.stitle_error, 
				      		breadtext: breadText,
				      		breadhref: breadHref,
				      		newpage: newPage, 
				      		timeout:comutil.redirect_timeout
				  	    });
					return;
				}

				//save xlsx
				var xlsxFile = dir + '/' + comutil.export_xlsx_filename;
				console.log('xlsxFile=' + xlsxFile);
				ExportXlsx(docs, xlsxFile, comutil.export_xlsx_sheetname, function(err){
					if(err)
					{
						console.log(err);

						res.render(redirectRender,
					  	    {
					  	    	act: actFlag,
					      		msg: comutil.msg.msg_error_abnormal,
					      		title: comutil.msg.title_error, 
					      		smalltitle: comutil.msg.stitle_error, 
					      		breadtext: breadText,
					      		breadhref: breadHref,
					      		newpage: newPage, 
					      		timeout:comutil.redirect_timeoutnewPage
					  	    });
					}
					else
					{
						console.log('SaveToFile ok!');

						//do zip
						var zipDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir;
						var zipSrcDir = zipDir + '/' + docs.stuNumber + '_' + docs.prjName;
						var zipFilename = docs.stuNumber + '_' + docs.prjName + '.tar.gz';
						//var zipFile = zipDir + '/' + zipFilename;
						var zipFile = './public/' + comutil.export_dir + '/' + zipFilename;

						console.log('zipDir=' + zipDir);
						console.log('zipSrcDir=' + zipSrcDir);
						console.log('zipFilename=' + zipFilename);
						console.log('zipFile=' + zipFile);

						//comutil.DirToZip(zipSrcDir, zipFile, res);
						comutil.DirToZip(zipSrcDir, zipFile);

						setTimeout(function(){
							fs.exists(zipFile, function(exists){
								if(exists)
								{
									console.log('start to download!');
									res.download(zipFile);
								}
								else
								{
									res.render(redirectRender, 
							  	    {
							  	    	act: actFlag,
							      		msg: comutiredirectRenderl.msg.msg_error_abnormal,
							      		title: comutil.msg.title_error, 
							      		smalltitle: comutil.msg.stitle_error + '  服务器繁忙，请重新尝试', 
							      		breadtext: breadText,
							      		breadhref: breadHref,
							      		newpage: newPage, 
							      		timeout:comutil.redirect_timeout
							  	    });

								}
							});

						}, 3000);
					}
				});
			}
			else
			{
				console.log('not found!');
				res.render(redirectRender, 
			  	    {
			  	    	act: actFlag,
			      		msg: comutil.msg.msg_error_abnormal,
			      		title: comutil.msg.title_error, 
			      		smalltitle: comutil.msg.stitle_error, 
			      		breadtext: breadText,
			      		breadhref: breadHref,
			      		newpage: newPage, 
			      		timeout:comutil.redirect_timeout
			  	    });
			}			
		}
	});
};

exports.PrjArchive = function (req, res) {

	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('PrjArchive id= ' + idStr);

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
					      		msg: comutil.msg.msg_error_abnormal + ' prjName not found!',
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
							var stuNumbers = [];
							var len = docs.length;
							console.log('docs found! len=' + len);
							for(i=0; i<len; i++)
							{
								stuNumbers[i] = docs[i].stuNumber;
							}
							console.log(stuNumbers);

							MakePrjArchive(req, res, prjName, docs);

						}
					}
					
				});
            }
		
		}
	});
}

var testtest = function(prj_name) {
	console.log('testtest prj_name = ' + prj_name);

	//send msg to router
	setTimeout(function(){
		//res.redirect('/super_makearchive/:' + prj_name);
		console.log('setTimeout prj_name = ' + prj_name);
		var prjSrcDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir + '/' + prj_name;
		var prjArchiveFile = prjSrcDir + '.tar.gz';

		console.log('prjSrcDir=' + prjSrcDir);
		console.log('prjArchiveFile=' + prjArchiveFile);

		comutil.DirToZip(prjSrcDir, prjArchiveFile);

	}, 5000);
};

//recursive do exports
var MakePrjArchive = function(req, res, prj_name, sys_records){

	var len = sys_records.length;

	if(len==0)
	{
		console.log('recursive MakePrjArchive end!');
		
		//comutil.DirToZip() can't be called in recursive function, it is suck!!

		//testtest(prj_name);

		//send msg to router
		setTimeout(function(){
			//res.redirect('/super_makearchive/:' + prj_name);
			var prjSrcDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir + '/' + prj_name;
			var prjArchiveFile = prjSrcDir + '.tar.gz';

			console.log('prjSrcDir=' + prjSrcDir);
			console.log('prjArchiveFile=' + prjArchiveFile);

			try
			{
				comutil.DirToZip(prjSrcDir, prjArchiveFile);
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

			try
			{
				//set db Expired flag
				mgdb.ModelPrjInfo.findOneAndUpdate(
					{prjName:prj_name}, 
					{prjExpired: true, prjFilePath: comutil.export_dir + '/' + prj_name + '.tar.gz'}, 
					function(err, doc){
						if(err)
						{
							console.log(err);
							res.render('super_redirect_delay', 
					      	{
					      		act:comutil.sidebaract.super.viewprjs,
					      	    msg: comutil.msg.msg_error + ': ' + err, 
					      	    title: comutil.msg.title_error, 
					      	    smalltitle: comutil.msg.stitle_viewprjs, 
					      	    breadtext: comutil.bread.super_viewprjs_text,
				                breadhref: comutil.bread.super_viewprjs_href,
					      	    newpage: '/super_viewprjs', 
					      	    timeout: (comutil.redirect_timeout*2)
					      	});
						}
						else
						{
							// batch modify expired in sysrecords
							console.log('batch modify');

							//归档后，设置归档标志，解除微信绑定
							mgdb.ModelSysRecord.update(
						    	{prjName:prj_name}, 
						    	{prjExpired: true, stuWeixinBind: false, stuWeixin_id: comutil.default_weixinid},
						    	{multi: true},
						    	function(err, numberAffected, raw){
						    		if(err)
						    			console.log(err);
						    		else
						    			console.log('numberAffected=' + numberAffected);
					    	});
						}
				});
			}
			catch(error)
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

		}, 10000);
		
		//res.redirect('/super_makearchive/:' + prj_name);

		return;
	}

	var docs = sys_records.pop();
	console.log('len=' + len + ' data.stuNumber=' + docs.stuNumber);

	//make dir
	var dir = MakeDownloadDir(docs, true);
	if(dir==null)
	{
		console.log('MakeDownloadDir null!');
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
		return;
	}

	//save xlsx
	var xlsxFile = dir + '/' + comutil.export_xlsx_filename;
	console.log('xlsxFile=' + xlsxFile);
	ExportXlsx(docs, xlsxFile, comutil.export_xlsx_sheetname, function(err){
		if(err)
		{
			console.log(err);

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
			console.log('SaveToFile ok!');

			//do zip
			// var zipDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir;
			// var zipSrcDir = zipDir + '/' + docs.stuNumber + '_' + docs.prjName;
			// var zipFilename = docs.stuNumber + '_' + docs.prjName + '.tar.gz';
			// //var zipFile = zipDir + '/' + zipFilename;
			// var zipFile = './public/' + comutil.export_dir + '/' + zipFilename;

			// console.log('zipDir=' + zipDir);
			// console.log('zipSrcDir=' + zipSrcDir);
			// console.log('zipFilename=' + zipFilename);
			// console.log('zipFile=' + zipFile);

			//comutil.DirToZip(zipSrcDir, zipFile, res);
			//comutil.DirToZip(zipSrcDir, zipFile);
			//comutil.DirToZip('/home/johnny/test/web/wis_v2/wis/public/download/prj1', '/home/johnny/test/web/wis_v2/wis/public/download/prj1.tar.gz');

            MakePrjArchive(req, res, prj_name, sys_records);

		}
	});

	
};
