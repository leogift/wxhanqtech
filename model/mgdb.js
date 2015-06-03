/*******************************************************************************************
Filename    :mgdb.js
Summary     :mongodb database interface
Version     :1.0
Created     :2015-02-07
Author      :Johnny.

Update History:
001  2015-02-07   Johnny     Create new 
********************************************************************************************/

//
// packages required
//

var mongoose = require('mongoose');
var comutil = require('./commonutils');

//
// workrecord info
//
var WorkRecord = new mongoose.Schema({
    logText : [String],
    logPicPath: [String],
    logLocation: String,
    startTime: String,
    stopTime: String
});
var ModelWorkRecord = mongoose.model('WorkRecord', WorkRecord);

//
// sysrecord info
//
var SysRecord = new mongoose.Schema({
    stuNumber : {type:String, unique:false},
    stuName : String,
    stuPhone: String,
    stuPassword: String,
    stuWeixin_id: {type:String, unique:false},
    stuWeixin_id_backup: {type:String, unique:false},
    stuWeixinBind: Boolean,
    stuWeixinBind_backup: Boolean,
    stuLoginFlag: Boolean,
    prjName: String,
    prjDesc: String,
    prjLocation: String,
    prjExpired: Boolean,
    prjStartDate: String,
    prjStopDate: String,
    tutorNumber: {type:String, unique:false},
    tutorName: String,
    tutorPhone: String,
    tutorPassword: String,
    workRecords: [WorkRecord],
    created  : Date,
    subDate: String,
    unsubDate: String
});
var ModelSysRecord = mongoose.model('SysRecord', SysRecord);

//
// administrator password
//
var AdminPassword = new mongoose.Schema({
    adminUser: String,
    adminPass: String
});
var ModelAdminPassword = mongoose.model('AdminPassword', AdminPassword);

//
//project info db
//
var PrjInfo = new mongoose.Schema({
    prjName: String,
    prjExpired: Boolean,
    prjStartDate: String,
    prjStopDate: String,
    prjFilePath: String,
    created  : Date,
});
var ModelPrjInfo = mongoose.model('PrjInfo', PrjInfo);


//! this sentense should be before the GridFs defines!
mongoose.connect(comutil.dbname);

var mgdbConnection = mongoose.connection;

mgdbConnection.on('error', function(){
	console.error.bind(console, 'connection error!');
});

mgdbConnection.once('open', function(){
    console.log('connect ' + comutil.dbname + ' ok!');
});


//test
// ModelAdminPassword.distinct('adminUser', {}, function(err, docs){
//   if(err)
//     console.log(err);
//   else
//     console.log(docs);
// });


//
// Exports Var
//
exports.mgdb = mongoose;
exports.ModelSysRecord = ModelSysRecord;
exports.ModelWorkRecord = ModelWorkRecord;
exports.ModelAdminPassword = ModelAdminPassword;
exports.ModelPrjInfo = ModelPrjInfo;

//
// Exports Functions
//

//test 
exports.AddPerson = function(newPerson, callback){
	//check newTutor
	//...

	newPerson.save(function(err, entity){
		if(err) 
			callback(err);
		else
			callback(entity);
	});
};

//////////////////////////////////////////////////////////////////
//function: Add one new SysRecord, used in creating the dababase
//parameters:  
//    @newSysRec: a new sys record
//
//return:      null
//
//callback: mode.save's callback 
//    @err: if error, error; or null
//    @entity: if success, entity; or null
//
//remarks:     null
//////////////////////////////////////////////////////////////////
exports.AddOneSysRecord = function(newSysRec, callback){
	//check newSysRec?
	if(newSysRec==null)
	{
		console.log('newSysRec is null');
		callback('newSysRec', null);
		return;
	}

	try
	{
		newSysRec.save(function(err, entity){
			if(err) 
			{
				console.log(err);
				callback(err, null);
			}				
			else
			{
				console.log('save ok!');
				callback(null, entity);
			}				
		});
	}
	catch(e)
	{
		console.log(e.message);
		callback(e, null);
	}	
};

exports.FindAllbyOption = function(model, opt, callback)
{
	model.find(
		opt,
		null,
		{sort:[['stuNumber', 1]]},
		function(err, docs){
			callback(err, docs);
		});
};


exports.AddStudent = function(newStudent, callback){
	//check newTutor
	//...

	AddOneEngity(newStudent, function(msg){
		callback(msg);
	});
};

exports.AddSubStudent = function(newSubStudent, callback){
	//check newTutor
	//...

	AddOneEngity(newSubStudent, function(msg){
		callback(msg);
	});
};

exports.AddWorklog = function(newWorklog, callback){
	//check newWorklog
	//...

	AddOneEngity(newWorklog, function(msg){
		callback(msg);
	});
};

var AddOneEngity = function (OneEntity, callback) {
	try
	{
		OneEntity.save(function(err, entity, numberAffected){
			if(err)
			{
				console.log('AddOneEngity error ' + err + ' ' + numberAffected);
				callback({msg:'error'});
			}
			else
			{
				console.log('AddOneEngity ok ' + ' ' + numberAffected);
				callback({msg:'ok'});
			}
		})
	}
	catch(err)
	{
		console.log('AddOneEngity abnormal ' + err + ' ' + numberAffected);
		callback({msg:'abnormal'});
	}
}

exports.DoQueryAll = function(model, callback)
{
	model.find(
		{},
		null,
		{sort:[['stuNumber', 1]]},
		function(err, docs){
			callback(err, docs);
		});
};

exports.FindDocsByWeixinId = function(model, weixin_id, callback)
{
	model.find(
		{'weixin_id':weixin_id},
		function(err, docs){
			callback(err, docs);
		});
};

exports.DeleteById = function(model, idstr, callback)
{
	model.findOneAndRemove({'_id':idstr}, function(err, docs){
		callback(err, docs);
	});
};

exports.FindOneById = function(model, idstr, callback)
{
	model.findOne({'_id':idstr}, function(err, docs){
		callback(err, docs);
	});
};

exports.FindOneByUsername = function(model, username, callback)
{
	model.findOne({'username':username}, function(err, docs){
		callback(err, docs);
	});
};

exports.FindOneStudentByCellphone = function(model, cellphone, callback)
{
	model.findOne({'cellphone':cellphone}, function(err, docs){
		callback(err, docs);
	});
};

exports.FindOneStudentByWinxinId = function(model, weixin_id, callback)
{
	model.findOne({'weixin_id':weixin_id}, function(err, docs){
		callback(err, docs);
	});
};

exports.FindOneByOption = function(model, opt, callback)
{
	// model.findOne(opt, function(err, docs){
	// 	callback(err, docs);
	// });

	model.findOne(
		opt,
		null,
		{sort:[['stuNumber', 1]]},
		function(err, docs){
			callback(err, docs);
		});
};

exports.GetOneStudentByWinxinId = function(model, weixin_id)
{
	var docs = model.findOne({'weixin_id':weixin_id}, function(err, docs){
		return docs;
	});
	
	return docs;
};

exports.FindDocsByWinxinId = function(model, weixin_id, callback)
{
	model.find(
		{'weixin_id':weixin_id},
		function(err, docs){
			callback(err, docs);
		});
};

exports.DoModifyOneByCondition = function(model, condition, newjsonobj, callback){

	try
	{
		model.findOneAndUpdate(
			condition, 
			newjsonobj, 
			function(err, doc){
				callback(err, doc);
		});
	}
	catch(error)
	{
		console.log('DoModifyById error=' + error);
		callback(error, null);
	}

};

exports.DoModifyById = function(model, id, newjsonobj, callback){
	
	console.log('modify id= ' + id);
	
	try
	{
		model.findOneAndUpdate(
			{'_id' : id}, 
			newjsonobj, 
			function(err, doc){
				callback(err, doc);
		});
	}
	catch(error)
	{
		console.log('DoModifyById error=' + error);
		callback(error, null);
	}	
};

exports.DoModifyByStuNumber = function(model, stu_number, new_jsonobj, callback){
	
	console.log('DoModifyByStuNumber stu_number= ' + stu_number);
	
	try
	{
		model.findOneAndUpdate(
			{'stuNumber' : stu_number}, 
			new_jsonobj, 
			function(err, doc){
				callback(err, doc);
		});
	}
	catch(error)
	{
		console.log('DoModifyByStuNumber error=' + error);
		callback(error, null);
	}	
};

exports.DoModifyByWeixinId = function(model, weixin_id, new_jsonobj, callback){
	
	console.log('DoModifyByWeixinId weixin_id= ' + weixin_id);
	
	try
	{
		model.findOneAndUpdate(
			{'stuWeixin_id' : weixin_id}, 
			new_jsonobj, 
			function(err, doc){
				callback(err, doc);
		});
	}
	catch(error)
	{
		console.log('DoModifyByWeixinId error=' + error);
		callback(error, null);
	}	
};

exports.DoModifyByUsername = function(model, username, newjsonobj, callback){
	
	console.log('DoModifyByUsername username= ' + username);
	
	try
	{
		model.findOneAndUpdate(
			{'username' : username}, 
			newjsonobj, 
			function(err, doc){
				callback(err, doc);
		});
	}
	catch(error)
	{
		console.log('DoModifyByUsername error=' + error.message);
		callback(error, null);
	}	
};

exports.DoModifyStudentInfoByCellphone = function(model, cellphone, newjsonobj, callback){
	
	console.log('DoModifyStudentInfoByCellphone cellphone= ' + cellphone);
	
	try
	{
		model.findOneAndUpdate(
			{'cellphone' : cellphone}, 
			newjsonobj, 
			function(err, doc){
				callback(err, doc);
		});
	}
	catch(error)
	{
		console.log('DoModifyStudentInfoByCellphone error=' + error.message);
		callback(error, null);
	}	
};

//
exports.CheckPasswordByName = function(model, name, codedpass, callback){
	model.findOne({'username':name}, function(err,docs){
		if(err)
		{
			console.log('abnormal err=' + err.message);
			callback('error');
		}
		else
		{
			if(docs)
			{
				console.log('password in db:'+ docs.password + 'password in query:' + codedpass);
				if(docs.password!=codedpass)
				{
					console.log('password error!');
					callback('password error');
				}
				else
				{
					console.log('password ok!');
					callback('password ok');
				}
			}
			else
			{
				console.log('docs not exist!');
				callback('docs not exist');
			}
		}
	});
};

exports.CheckPassword = function(model, flag, number, codedpass, callback){
	var option;
	if(flag=='student')
		option = {'stuNumber':number};
	else if(flag=='tutor')
		option = {'tutorNumber':number};
	else
	{
		callback('error: flag');
		return;
	}

	//model.findOne({'username':name}, function(err,docs){
	model.findOne(option, function(err,docs){
		if(err)
		{
			console.log('abnormal err=' + err.message);
			callback('error: abnormal');
		}
		else
		{
			if(docs)
			{
				var dbPass;
				if(flag=='student')
				{
					dbPass = docs.stuPassword;
				}
				else
				{
					dbPass = docs.tutorPassword;
				}
				console.log('password in db:'+ dbPass + 'password in query:' + codedpass);

				if(dbPass!=codedpass)
				{
					console.log('password error!');
					callback('error: wrong password');
				}
				else
				{
					console.log('password ok!');
					callback('ok');
				}
			}
			else
			{
				console.log('docs not exist!');
				callback('error: number not exist');
			}
		}
	});
};

exports.CheckPasswordByCellphone = function(model, cellphone, codedpass, callback){
	model.findOne({'cellphone':cellphone}, function(err,docs){
		if(err)
		{
			console.log('abnormal err=' + err.message);
			callback('error');
		}
		else
		{
			if(docs)
			{
				console.log('password in db:'+ docs.password + 'password in query:' + codedpass);
				if(docs.password!=codedpass)
				{
					console.log('password error!');
					callback('password error');
				}
				else
				{
					console.log('password ok!');
					callback('password ok');
				}
			}
			else
			{
				console.log('docs not exist!');
				callback('docs not exist');
			}
		}
	});
};

exports.GetPrjUniqueName = function (model, opt, callback) {

	model.distinct('prjName', opt, function(err, docs){
		if(err)
		{
			console.log('error:' + err);
			callback(null);
		}
		else
		{
			callback(docs);
		}
			
	});
};


//put local file into mongodb
exports.putFile = function(path, name, callback){
	var writestream = GridFs.createWriteStream({filename: name});
	writestream.on('close', function(file){
		callback(null, file);
	});
	fs.createReadStream(path).pipe(writestream);
};

exports.getFile = function(name, destPath, callback){
	try
	{
		//var readstream = GridFs.createReadStream({_id: '549aa3819bb8b17711000002'});
		var readstream = GridFs.createReadStream({filename: name}); // id and filename both ok!
		//readstream.pipe(res);
		var writestream = fs.createWriteStream(destPath);
		readstream.pipe(writestream);
		console.log('readed!');
		callback(null);
	}
	catch(err)
	{
		console.log('readed error!')
		callback(err);
		return next(errors.create(404, 'File Not Found'));
	}
};

exports.RemoveDatabase = function(callback){
	mgdbConnection.db.dropDatabase(function(err, result){
		callback(err, result);
	});
};

exports.RemoveCollection = function(collection_name, callback){
	mgdbConnection.db.dropCollection(collection_name, function(err, result){
		callback(err, result);
	});
};

exports.DatabaseBackup = function (req, res, bNeedWebResponse) {

	var timeString = comutil.GetTimeString(1);
	console.log('GetTimeString=' + timeString);
	
	//dump database
	//var cmdStr =  comutil.dump_dumpbin + ' -d ' + comutil.dump_dbname + ' -o ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + timeString;
	
	//now, dump collection
	var cmdStr =  comutil.dump_dumpbin + ' -d ' + comutil.dump_dbname + ' -c ' + comutil.sysrecord_collection_name + ' -o ' + comutil.dump_dir + '/' + comutil.dump_dbname + '_' + timeString;
	console.log('cmdStr' + cmdStr);

	comutil.ExecCmd(cmdStr, function(err, stdout, stderr){
		if(err)
		{
			console.log('DbDump error: ' + err);

			if(bNeedWebResponse)
			{
				res.render('super_redirect_delay', 
			  	{
			  		act: comutil.sidebaract.super.sysdatabackup,
			      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
			      		title: comutil.msg.title_sysdump, 
			      		smalltitle: comutil.msg.stitle_sysdump,
			      		breadtext: comutil.bread.super_sysdatabackup_text,
                        breadhref: comutil.bread.super_sysdatabackup_href, 
			      		newpage:'/super_sysdatarestore', 
			      		timeout:comutil.redirect_timeout
			  	});
			}			
		}			
		else
		{
			if(stderr)
			{
				console.log('DbDump stderr: ' + stderr);
				if(bNeedWebResponse)
				{
					res.render('super_redirect_delay', 
				  	{
				  		act: comutil.sidebaract.super.sysdatabackup,
				      		msg: comutil.msg.msg_error_abnormal + ' ' + err,
				      		title: comutil.msg.title_sysdump, 
				      		smalltitle: comutil.msg.stitle_sysdump, 
				      		breadtext: comutil.bread.super_sysdatabackup_text,
	                        breadhref: comutil.bread.super_sysdatabackup_href, 
				      		newpage:'/super_sysdatarestore', 
				      		timeout:comutil.redirect_timeout
				  	});
				}	
			}
			else
			{
				console.log('DbDump ok! ' + stdout);
				if(bNeedWebResponse)
				{
					res.render('super_redirect_delay', 
				  	{
				  		act: comutil.sidebaract.super.sysdatabackup,
				      		msg: comutil.msg.msg_ok,
				      		title: comutil.msg.title_sysdump, 
				      		smalltitle: comutil.msg.stitle_sysdump, 
				      		breadtext: comutil.bread.super_sysdatabackup_text,
	                        breadhref: comutil.bread.super_sysdatabackup_href, 
				      		newpage:'/super_sysdatarestore', 
				      		timeout:comutil.redirect_timeout
				  	});

				}
				
			}
		}
	});

};


