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
// filename or buffer also ok!
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
			callback(err, entity);
		});
	}

};

var LineToDb = function(rec_line, callback) {

	//var rec = rec_line.split('\t', 10);
	var rec = rec_line.split('\t');
	for(var i=0; i<rec.length; i++)
	{
		console.log(rec[i]);
	}

	//var newWorkRec = new mgdb.ModelWorkRecord();

	var newSysRec = new mgdb.ModelSysRecord();
	newSysRec.stuNumber = rec[2];
	newSysRec.stuName = rec[4];
	newSysRec.stuPhone = rec[3];
	var codedPassword = comutil.CodedPassword(rec[3]);
	newSysRec.stuPassword = codedPassword;

	newSysRec.stuWeixin_id = comutil.default_weixinid;
	newSysRec.stuWeixinBind = false;
	newSysRec.stuLoginFlag = true;
	newSysRec.prjName = rec[5];
	//newSysRec.prjDesc = rec[1];
	//newSysRec.prjLocation = rec[1];
	
	newSysRec.prjExpired = false;
	
	//console.log('rec[6]=' + rec[6]);
	//console.log('rec[6]=' + rec[6]);

	//var date = new Date(rec[6]);
	//console.log('date=' + date);
	newSysRec.prjStartDate = rec[6];//comutil.DateToString(date);
	//date = new Date(rec[7]);
	newSysRec.prjStopDate = rec[7];//comutil.DateToString(date);

	newSysRec.tutorNumber = rec[9];
	newSysRec.tutorName = rec[8];
	newSysRec.tutorPhone = rec[10];
	//console.log('rec[10]='+ rec[10])
	codedPassword = comutil.CodedPassword('' + rec[10]);
	newSysRec.tutorPassword = codedPassword;
	//newSysRec.workRecords = newWorkRec;
	newSysRec.workRecords = [];
	newSysRec.created = Date.now();

	mgdb.AddOneSysRecord(newSysRec, function(err, entity){
		callback(err, entity);
	});
};

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

//
// test2 is error!
//
exports.test2 = function (filename) {
	var obj = xlsx.parse(filename);

	var data = obj.worksheets.data;
	var maxCol = obj.worksheets.maxCol;
	var maxRow = obj.worksheets.maxRow;

	for(var i=0; i<maxRow; i++)
	{
		console.log('' + (i+1) + '\t');
		for(var j=0; j<maxCol; j++)
		{
			console.log(data[i][j].value + '\t');
		}
		console.log('\n');
	}

};


