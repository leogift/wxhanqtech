/*******************************************************************************************
Filename    : xlsx.js
Summary     :  excell file with xlsx format read and write interface, using node-xlsx library
Version     :1.0
Created     :2015-02-07
Author      :Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/

var xlsx = require('node-xlsx');
var fs = require('fs');
var mgdb = require('./mgdb');
var comutil = require('./commonutils');

//
// exports variants
//

exports.xlsx = xlsx;



//
// exports functions
//


//////////////////////////////////////////////////////////////////
//function: print excel file
//parameters:  
//    @fileName: xlsx file
//
//return: null
//
//callback: yes
//
//remarks: filename or buffer also ok!
//////////////////////////////////////////////////////////////////
exports.PrintTable = function (filename) {

	console.log('filename=' + filename);

	var xlsxObj;
	try
	{
		xlsxObj = xlsx.parse(filename);
	}
	catch(ex)
	{
		console.log(ex.message);
		throw ex;
	}
	
	//for debug
	console.log(JSON.stringify(xlsxObj));
	console.log('obj.length=' + xlsxObj.length);
	console.log('title=' + xlsxObj[0]['data']);
	
	var a = xlsxObj[0]['data'];
	var rowNum = a.length;
	var colNum = a[0].length;

	console.log('rowNum=' + rowNum + '\t' + 'colNum=' + colNum);

	for(var i=0; i<rowNum; i++)
	{
		var line = (i+1) + '\t';
		for(var j=0; j<colNum; j++)
		{
			line += (a[i][j] + '\t');
		}
		console.log(line);

	}
};

//////////////////////////////////////////////////////////////////
//function: 数据导入
//parameters:  
//    @fileName: xlsx file name
//    @callback:
//
//return: null
//
//callback: yes
//
//remarks: if one line error, callback
//////////////////////////////////////////////////////////////////
exports.XlsxToDb = function (fileName, callback) {

	console.log('filename=' + fileName);

	var xlsxObj;
	try
	{
		xlsxObj = xlsx.parse(fileName);
	}
	catch(ex)
	{
		console.log(ex.message);
		throw ex;
	}
	
	//for debug
	console.log(JSON.stringify(xlsxObj));
	console.log('obj.length=' + xlsxObj.length);
	console.log('title=' + xlsxObj[0]['data']);
	
	var a = xlsxObj[0]['data'];
	var rowNum = a.length;
	var colNum = a[0].length;

	//maybe check the repeat student
	//...

	console.log('rowNum=' + rowNum + '\t' + 'colNum=' + colNum);

	for(var i=1; i<rowNum; i++) //start from 1, skip the title of datasheet
	{
		var line = (i+1) + '\t';
		for(var j=0; j<colNum; j++)
		{
			line += (a[i][j] + '\t');
		}
		console.log(line);
		var ret = LineToDb(line, function(err, entity){
			if(err)
			{
				callback(err);
				//return;
			}
				
		});
	}

	callback(null);

};

//////////////////////////////////////////////////////////////////
//function: 数据导入
//parameters:  
//    @rec_line: one line in xlsx file
//    @callback:
//
//return: null
//
//callback: yes
//
//remarks: null
//////////////////////////////////////////////////////////////////
var LineToDb = function(rec_line, callback) {

	//var rec = rec_line.split('\t', 10);
	var rec = rec_line.split('\t');
	for(var i=0; i<rec.length; i++)
	{
		console.log(rec[i]);
	}

	var newSysRec = new mgdb.ModelSysRecord();
	newSysRec.stuNumber = rec[2];
	newSysRec.stuName = rec[4];
	newSysRec.stuPhone = rec[3];
	var codedPassword = comutil.CodedPassword(rec[3]);
	newSysRec.stuPassword = codedPassword;

	newSysRec.stuWeixin_id = comutil.default_weixinid;
	newSysRec.stuWeixin_id_backup = comutil.default_weixinid;
	newSysRec.stuWeixinBind = false;
	newSysRec.stuWeixinBind_backup = false;
	newSysRec.stuLoginFlag = true;
	newSysRec.prjName = rec[5];
	//newSysRec.prjDesc = rec[1];
	//newSysRec.prjLocation = rec[1];
	
	newSysRec.prjExpired = false;

	newSysRec.prjStartDate = rec[6];//comutil.DateToString(date);
	newSysRec.prjStopDate = rec[7];//comutil.DateToString(date);

	newSysRec.tutorNumber = rec[9];
	newSysRec.tutorName = rec[8];
	newSysRec.tutorPhone = rec[10];
	codedPassword = comutil.CodedPassword('' + rec[10]);
	newSysRec.tutorPassword = codedPassword;

	newSysRec.workRecords = [];
	newSysRec.created = Date.now();

	mgdb.AddOneSysRecord(newSysRec, function(err, entity){
		callback(err, entity);
	});
};

//////////////////////////////////////////////////////////////////
//function: save export data to excel file
//parameters:  
//    @fileName: one line in xlsx file
//    @sheetName: sheet name
//    @xlsxData: data want to save
//    @callback:
//
//return: null
//
//callback: yes
//
//remarks: null
//////////////////////////////////////////////////////////////////
exports.SaveToFile = function (fileName, sheetName, xlsxData, callback) {

	// var data = [[1,2,3],[true, false, null, 'sheetjs'],['foo','bar',new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
	// data = xlsxData || data; 

	var buffer = xlsx.build([{name: sheetName, data: xlsxData}]); // returns a buffer
	fs.writeFile(fileName, buffer, function(error) {
	    if(error) 
	    {
	    	console.log(error);
	    	callback(error);
	    }
	    else
	    {
	    	console.log('SaveToFile ok!');
	    	callback(null);
	    }	    	
    });

}
