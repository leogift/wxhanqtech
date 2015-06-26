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


//////////////////////////////////////////////////////////////////
//function: 创建供下载的文件夹以及拷贝文件进去
//parameters:  
//    @docs: 主表集合
//    @bArchive: 是否是归档的标志
//    @tmp_dir: 归档时，为避免中文文件夹名，产生的随机英文数字名称
//
//return: null
//
//callback: null
//
//remarks: null
//////////////////////////////////////////////////////////////////
var MakeDownloadDir = function (docs, bArchive, tmp_dir) {

	var submitCount = docs.workRecords.length;
	var downDir  = "";

	//mkdir prjName
	if(bArchive)
	{
		var fsPrjDir =  comutil.subhtml_absolutewebroot + '/' +comutil.export_dir + '/' + tmp_dir;
		if(!fs.existsSync(fsPrjDir))
		{
			console.log('mkdir ' + fsPrjDir);
			fs.mkdirSync(fsPrjDir, 0755);
		}	
	}

	if(!bArchive)
		downDir = docs.stuNumber;
	else
	    downDir = tmp_dir + '/' + docs.stuNumber;

	//mkdir
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

//////////////////////////////////////////////////////////////////
//function: 导出数据到excel文件
//parameters:  
//    @docs: 主表集合
//    @file_name: 导出的excel文件名
//    @sheet_name: excel文件中的数据表名，没有什么重要作用
//    @role: 角色，学生还是管理员或教师
//    @callback: callback function
//
//return: null
//
//callback: null
//
//remarks: 管理员和教师导出的文件中能看到微信号，学生的看不到
//////////////////////////////////////////////////////////////////
var ExportXlsx = function (docs, file_name, sheet_name, role, callback) {

	var data = [];
	var i = 0;
	var j = 0;
	var k = 0;

	var dataCount = 0; //整个数据表的行数
	for(var m=0; m<docs.workRecords.length; m++)
	{
		var n = docs.workRecords[m].logText.length;
		var p = docs.workRecords[m].logPicPath.length;
		if(n>p)
			dataCount += n;
		else
			dataCount += p;

		//既没有提交文字，也没有提交图片，也是一次提交，data数组也要留一个给他
		if(n==0 && p==0) 
			dataCount++;
	}

	for(i=0; i<dataCount; i++)
		data[i] = new Array();

	console.log(' dataCount=' + dataCount + 
		        ' docs.workRecords.length=' + docs.workRecords.length + 
		        ' data.length=' + data.length);

	k = 0;
	var subCount = 0; //每次提交的行数

	for(i=0; i<docs.workRecords.length; i++)
	{
		flag = 0;

		subCount = docs.workRecords[i].logText.length;
		if(subCount<docs.workRecords[i].logPicPath.length)
	 		subCount = docs.workRecords[i].logPicPath.length;

	 	if(subCount==0) 
	 	{
	 		subCount = 1;
	 	}

	 	console.log('i=' + i + ' subCount=' + subCount + ' k=' + k);

	 	for(j=0; j<subCount; j++)
	 	{
	 		console.log('j=' + j);

	 		data[k+j].push(i+1);
	 		data[k+j].push(docs.stuName);
	 		data[k+j].push(docs.stuNumber);
	 		if(role!=comutil.userrole.student)
	 			data[k+j].push(docs.stuWeixin_id);
	 		data[k+j].push(docs.prjName);
	 		data[k+j].push(docs.tutorName);

	 		data[k+j].push(j+1);

	 		var logLocation = ' ';
	 		if(docs.workRecords[i].logLocation!=undefined)
	 			logLocation = path.basename(docs.workRecords[i].logLocation);

	 		if(logLocation==null || logLocation=="" || logLocation.trim()=="")
	 		{
	 			console.log('logLocation is empty!!');
	 			data[k+j].push('empty');
	 		}
	 		else
	 		{
	 			console.log('logLocation not empty and is ' + logLocation);
	 			data[k+j].push(logLocation);
	 		}

	 		var logLocationDesc = ' ';
	 		if(docs.workRecords[i].logLocationDesc!=undefined)
	 			logLocationDesc = docs.workRecords[i].logLocationDesc;

	 		if(logLocationDesc==null || logLocationDesc=="" || logLocationDesc.trim()=="")
	 		{
	 			console.log('logLocationDesc is empty!!');
	 			if(role!=comutil.userrole.student)
	 				data[k+j].push('empty');
	 		}
	 		else
	 		{
	 			console.log('logLocation not empty and is ' + logLocationDesc);
	 			if(role!=comutil.userrole.student)
	 				data[k+j].push(logLocationDesc);
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
			
			//data[k+j].push(logText);
			if(logText==null || logText=="" || logText.trim()=='')
			{
	 			console.log('logText is empty!!');
	 			data[k+j].push('empty');
	 		}
	 		else
	 		{
	 			console.log('logText not empty and is ' + logText);
	 			data[k+j].push(logText);
	 		}	 

			var logPic = ' ';
			if(docs.workRecords[i].logPicPath[j]!=undefined)
				logPic = path.basename(docs.workRecords[i].logPicPath[j]);

			//data[k+j].push(logPic);
			if(logPic==null || logPic=="" || logPic.trim()=='')
	 		{
	 			console.log('logPic is empty!!');
	 			data[k+j].push('empty');
	 		}
	 		else
	 		{
	 			console.log('logPic not empty and is ' + logPic);
	 			data[k+j].push(logPic);
	 		}	 
	 	}

	 	k += subCount;
	}

	console.log(data);

	SaveToFile(file_name, sheet_name, data, role, function(err){
		callback(err);		
	});
};

//////////////////////////////////////////////////////////////////
//function: 导出数据到excel文件
//parameters:  
//    @file_name: 导出的excel文件名
//    @sheet_name: excel文件中的数据表名，没有什么重要作用
//    @data: 放置好的二维数组
//    @role: 角色，学生还是管理员或教师
//    @callback: callback function
//
//return: null
//
//callback: null
//
//remarks: 管理员和教师导出的文件中能看到微信号，学生的看不到
//////////////////////////////////////////////////////////////////
var SaveToFile = function(file_name, sheet_name, data, role, callback) {

	console.log('SaveToFile: file_name=' + file_name + ' sheet_name=' + sheet_name);
	console.log(data);

	try
	{
		var writer = new xlsxwriter(file_name, {} /* options */);

		writer.getReadStream().pipe(fs.createWriteStream(file_name));

		if(role==comutil.userrole.student)
		{
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
		}
		else
		{
			writer.defineColumns([
			    { width: 10 }, // width is in 'characters'
			    { width: 12 },
			    { width: 20 },
			    { width: 30 },
			    { width: 25 },
			    { width: 12 },
			    { width: 10 },
			    { width: 60 },
			    { width: 50 },
			    { width: 45 },
			    { width: 50 },
			    { width: 50 }
			]);
		}

		//test
		if(data.length==0)
		{
			data[0] = new Array();
			for(var j=0; j<11; j++)
				data[0].push('empty');
		}

		for(var i=0; i<data.length; i++)
		{
			if(role==comutil.userrole.student)
			{
				console.log('logLocation:' + data[i][6]);
				console.log('logPic:' + data[i][9]);

				//add rows
				writer.addRow({
				    "提交序号": data[i][0],
				    "学生姓名": data[i][1],
				    "学号": data[i][2],
				    "项目名称": data[i][3],
				    "教师姓名": data[i][4],
				    "序号": data[i][5],
				    "提交地点": {value:data[i][6], hyperlink:'./'+data[i][6]},
				    "时间": data[i][7],
				    "文本日志": data[i][8],
				    "图片日志": {value:data[i][9], hyperlink:'./'+data[i][9]}
				});

			}
			else
			{
				console.log('logLocation:' + data[i][7]);
				console.log('logPic:' + data[i][10]);

				//add rows
				writer.addRow({
				    "提交序号": data[i][0],
				    "学生姓名": data[i][1],
				    "学号": data[i][2],
				    "微信号": data[i][3],
				    "项目名称": data[i][4],
				    "教师姓名": data[i][5],
				    "序号": data[i][6],
				    "提交地点": {value:data[i][7], hyperlink:'./'+data[i][7]},
				    "地点信息": data[i][8],
				    "时间": data[i][9],
				    "文本日志": data[i][10],
				    "图片日志": {value:data[i][11], hyperlink:'./'+data[i][11]}
				});
			}
			
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

//////////////////////////////////////////////////////////////////
//function: 响应导出请求
//parameters:  
//    @req:
//    @res:
//
//return: null
//
//callback: null
//
//remarks: 为了共用函数，判别用户角色，进行不同的显示，核心函数可共用
//////////////////////////////////////////////////////////////////
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
		downloadPage = 'super_expert_worklog';
	}
	else if(role==comutil.userrole.tutor)
	{
		actFlag = comutil.sidebaract.tutor.viewworklog;
		breadText = comutil.bread.tutor_viewworklog_text;
		breadHref = comutil.bread.tutor_viewworklog_href;
		newPage = '/tutor_viewworklog';
		redirectRender = 'tutor_redirect_delay';
		downloadPage = 'tutor_expert_worklog';
	}
	else if(role==comutil.userrole.student)
	{
		actFlag = comutil.sidebaract.student.viewworklog;
		breadText = comutil.bread.student_viewworklog_text;
		breadHref = comutil.bread.student_viewworklog_href;
		newPage = '/student_viewworklog';
		redirectRender = 'student_redirect_delay';
		downloadPage = 'student_expert_worklog';
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
				var dir = MakeDownloadDir(docs, false);
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
				ExportXlsx(docs, xlsxFile, comutil.export_xlsx_sheetname, role, function(err){
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
						//var zipSrcDir = zipDir + '/' + docs.stuNumber + '_' + docs.prjName;
						var zipSrcDir = zipDir + '/' + docs.stuNumber;
						var zipFilename = docs.stuNumber + '_' + docs.prjName + '.tar.gz';
						//var zipFile = zipDir + '/' + zipFilename;
						var zipFile = './public/' + comutil.export_dir + '/' + zipFilename;
						var zipFileForDownload = '/' + comutil.export_dir + '/' + zipFilename;

						console.log('zipDir=' + zipDir);
						console.log('zipSrcDir=' + zipSrcDir);
						console.log('zipFilename=' + zipFilename);
						console.log('zipFile=' + zipFile);

						// zip!
						comutil.DirToZip(zipSrcDir, zipFile);

						setTimeout(function(){
							fs.exists(zipFile, function(exists){
								if(exists)
								{
									console.log('start to download!');
									//res.download(zipFile);

									res.render(downloadPage, 
							  	    {
							  	    	act: comutil.sidebaract.super.viewsyslog,
							      		SysRecords: null,
							      		mbtn: comutil.mbtn_id_superdeletelog,
							      		title: comutil.msg.title_viewsysworklog, 
							      		smalltitle: ('   ' + comutil.msg.stitle_viewsysworklog), 
							      		breadtext: comutil.bread.super_viewsyslog_text,
								        breadhref: comutil.bread.super_viewsyslog_href,
								        action: comutil.link.super_queryworklog,
							      		LinkDelete: comutil.link.super_queryresult_delete,
							      		LinkDetail: comutil.link.super_queryresult_detail,
							      		LinkExport: comutil.link.super_queryresult_export,
							      		downloadfile: zipFileForDownload
							  	    });

							  	    setTimeout(function(){

							  	    	//delete dir
								  	    if(fs.existsSync(dir))
										{
											comutil.RmDir(dir, function(err){
												if(err)
												{
													console.log(err);
												}				
												else
												{
													console.log('rm dir ' + dir + ' ok!');
												}
											});
										}

							  	    }, 30000);							  	    	

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

//////////////////////////////////////////////////////////////////
//function: 响应项目归档请求
//parameters:  
//    @req:
//    @res:
//
//return: null
//
//callback: null
//
//remarks: 获取项目名称，然后递归归档
//////////////////////////////////////////////////////////////////
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
							var len = docs.length;
							console.log('docs found! len=' + len);

							//generate random tmp dir
							var tmpDir = Math.random().toString(36).substr(2);
							console.log('random tmp dir: ' + tmpDir);

							MakePrjArchive(req, res, prjName, docs, tmpDir);
						}
					}
					
				});
            }
		
		}
	});
}


//////////////////////////////////////////////////////////////////
//function: 递归归档
//parameters:  
//    @req:
//    @res:
//    @prj_name: prj name
//    @sys_records: 含该项目名称的主表集合
//    @tmp_dir: temporary dir
//
//return: null
//
//callback: null
//
//remarks: 压缩每个学生的日志，设置主表标志，项目表标志，最后打包整个文件夹，压缩后删除项目文件夹
//////////////////////////////////////////////////////////////////
var MakePrjArchive = function(req, res, prj_name, sys_records, tmp_dir){

	var len = sys_records.length;

	if(len==0)
	{
		console.log('recursive MakePrjArchive end!');

		//send msg to router
		setTimeout(function(){

			var prjSrcDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir + '/' + prj_name;
			var tmpSrcDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir + '/' + tmp_dir;
			var prjArchiveFile = prjSrcDir + '.tar.gz';

			console.log('prjSrcDir=' + prjSrcDir);
			console.log('tmpSrcDir=' + tmpSrcDir);
			console.log('prjArchiveFile=' + prjArchiveFile);

			try
			{
				//comutil.DirToZip(prjSrcDir, prjArchiveFile);
				comutil.DirToZip(tmpSrcDir, prjArchiveFile);
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

			setTimeout(function(){

	  	    	//delete dir
	  	    	console.log('tmpdir=' + tmp_dir + ' tmpSrcDir=' + tmpSrcDir);
		  	    if(fs.existsSync(tmpSrcDir))
				{
					comutil.RmDir(tmpSrcDir, function(err){
						if(err)
						{
							console.log(err);
						}				
						else
						{
							console.log('rm dir ' + tmpSrcDir + ' ok!');
						}
					});
				}
				else
				{
					console.log('not existed? ' + tmpSrcDir);
				}

	  	    }, 30000);

		}, 3000);
		
		//res.redirect('/super_makearchive/:' + prj_name);

		return;
	}

	var docs = sys_records.pop();
	console.log('len=' + len + ' data.stuNumber=' + docs.stuNumber);

	//make dir
	var dir = MakeDownloadDir(docs, true, tmp_dir);
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
	ExportXlsx(docs, xlsxFile, comutil.export_xlsx_sheetname, comutil.userrole.super, function(err){
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
            MakePrjArchive(req, res, prj_name, sys_records, tmp_dir);

		}
	});

	
};

//////////////////////////////////////////////////////////////////
//function: 自动归档
//parameters:  
//    @null:
//
//return: null
//
//callback: null
//
//remarks: 发现超期的项目，找到其项目名称，根据项目名称，找到主表集合，然后递归归档
//         有一个问题是，这里一次只能归档一个项目，因为本身就是递归函数，如果超期项目数组再传进来，
//         就太复杂了，搞不定，所以业务上是每晚1-6点检查6次，每次检查一个项目
//////////////////////////////////////////////////////////////////
exports.AutoPrjArchive = function () {

	console.log('AutoPrjArchive!');

	//find all stop date
	mgdb.FindAllbyOption(mgdb.ModelPrjInfo, {}, function(err, docs){
		if(err)
		{
			console.log(err);
		}
		else
		{
			if(!docs || docs.length<=0)
			{
				console.log('docs==null or docs.length=' + docs.length);
			}
			else
			{
				//var expiredPrj = [];
				var expiredPrj = undefined;
				var len = docs.length;
				console.log('docs found! len=' + len);
				for(var i=0; i<len; i++)
				{
					//stopTime[i] = docs[i].prjStopDate;
					//console.log('stopTime[' + i +']=' + docs[i].prjStopDate);
					//console.log(stopTime[i]);

					var id = docs[i]._id;
					var expired = docs[i].prjExpired;
					var stopDate = new Date(docs[i].prjStopDate);
					var now = Date.now();
					var date = new Date(now);
					//var year = date.getFullYear();
					//console.log('year=' + year);
					var nowDate = comutil.DateToString(date);
					var currentDate = new Date(nowDate);

					console.log('stopDate=' + stopDate);
					console.log('currentDate=' + currentDate);
					console.log('id=' + id);
					console.log('expired=' + expired);

					if(stopDate.getTime()<currentDate.getTime() && expired==false)
					{
						console.log('expired:' + docs[i].prjName);
						//expiredPrj.push(docs[i].prjName);
						expiredPrj = docs[i].prjName;
						break;
					}
				}

				console.log('expiredPrj=' + expiredPrj);
				if(expiredPrj==undefined)
				{
					console.log('no expiredPrj, return!');
					return;
				}

				mgdb.FindAllbyOption(mgdb.ModelSysRecord, {prjName:expiredPrj}, function(err, records){
					if(err)
					{
						console.log(err);
					}
					else
					{
						if(!records)
						{
							console.log(err);
						}
						else
						{
							//generate random tmp dir
							var tmpDir = Math.random().toString(36).substr(2);
							console.log('random tmp dir: ' + tmpDir);

							AutoMakePrjArchive(expiredPrj, records, tmpDir);
						}
					}
					
				});

			}
		}
		
	});

};

//////////////////////////////////////////////////////////////////
//function: 自动递归归档
//parameters:  
//    @prj_name: prj name
//    @sys_records: 含该项目名称的主表集合
//    @tmp_dir: temporary dir
//
//return: null
//
//callback: null
//
//remarks: 压缩每个学生的日志，设置主表标志，项目表标志，最后打包整个文件夹，压缩后删除项目文件夹
//////////////////////////////////////////////////////////////////
var AutoMakePrjArchive = function(prj_name, sys_records, tmp_dir){

	var len = sys_records.length;

	if(len==0)
	{
		console.log('recursive AutoMakePrjArchive end!');

		//send msg to router
		setTimeout(function(){
			//res.redirect('/super_makearchive/:' + prj_name);
			var prjSrcDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir + '/' + prj_name;
			var tmpSrcDir = comutil.subhtml_absolutewebroot + '/' + comutil.export_dir + '/' + tmp_dir;
			var prjArchiveFile = prjSrcDir + '.tar.gz';

			console.log('prjSrcDir=' + prjSrcDir);
			console.log('tmpSrcDir=' + tmpSrcDir);
			console.log('prjArchiveFile=' + prjArchiveFile);

			try
			{
				//comutil.DirToZip(prjSrcDir, prjArchiveFile);
				comutil.DirToZip(tmpSrcDir, prjArchiveFile);
			}
			catch(err)
			{
				console.log(err);
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
				console.log(error);
				return;
			}

			console.log('AutoMakePrjArchive OK!');

			setTimeout(function(){

	  	    	//delete dir
	  	    	console.log('tmpdir=' + tmp_dir + ' tmpSrcDir=' + tmpSrcDir);
		  	    if(fs.existsSync(tmpSrcDir))
				{
					comutil.RmDir(tmpSrcDir, function(err){
						if(err)
						{
							console.log(err);
						}				
						else
						{
							console.log('rm dir ' + tmpSrcDir + ' ok!');
						}
					});
				}
				else
				{
					console.log('not existed? ' + tmpSrcDir);
				}

	  	    }, 30000);



		}, 10000);

		return;
	}

	var docs = sys_records.pop();
	console.log('len=' + len + ' data.stuNumber=' + docs.stuNumber);

	//make dir
	var dir = MakeDownloadDir(docs, true, tmp_dir);
	if(dir==null)
	{
		console.log('MakeDownloadDir null!');
		return;
	}

	//save xlsx
	var xlsxFile = dir + '/' + comutil.export_xlsx_filename;
	console.log('xlsxFile=' + xlsxFile);
	ExportXlsx(docs, xlsxFile, comutil.export_xlsx_sheetname, comutil.userrole.super, function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log('SaveToFile ok!');
            AutoMakePrjArchive(prj_name, sys_records, tmp_dir);
		}
	});
	
};

