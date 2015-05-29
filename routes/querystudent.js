
/*
 * GET home page.
 */

var mongoose = require('mongoose');
var Student = mongoose.model('Student');

var mgdb = require('../model/mgdb');


exports.index = function(req, res){
  res.render('querystudent', 'QueryStudent');
};

exports.doquery = function(req, res){
	//var query = Student.findOne({'name':'p1'});
	/*
	var query = Student.find();
	query.exec(function(err, stus){
		if(err) 
		    console.log('findOne error!');
		else
		{
		    for (i=0; i<stus.length;i++)
		    {
		        console.log('name= ' + stus[i].name);	
		    }		        
		}
	})
	//*/
	/*
	Student.find(
		{},
		function(err, docs){
			if(!err)
			{
				console.log(docs);
				//for(stu, index in docs)
				for(i=0; i<docs.length;i++)
				{
					console.log('name= ' + docs[i].name);
				}
				res.render('querystudentresult', {students:docs});
			}
			else
			{
				throw err;
				res.send('not found!');
			}
		});
	//*/

    if(req.body.cellphone!="")
    {
    	console.log('cellphone not empty!');

    	Student.find({'cellphone':req.body.cellphone})
    	.where('name').equals(req.body.name)
    	.exec(function(err, docs){
    		if(!err)
    		{
    			console.log('not error docs.length=' + docs.length);

    			if(docs.length==0)
    			{
    				res.send('not found!');
    			}
    			else
    			{
    				console.log('found!');
    				console.log(docs);
    				//for(stu, index in docs)
					for(i=0; i<docs.length;i++)
					{
						console.log('name= ' + docs[i].name);
					}
					res.render('querystudentresult', {students:docs});

    			}				
    		}
    		else
			{
				console.log('error! not found?');
				res.send('not found!');
				throw err;				
			}
    	})
    }
    else
    {
    	console.log('cellphone empty!');
/*
    	Student.find(
		{},
		function(err, docs){
			if(!err)
			{
				console.log(docs);
				//for(stu, index in docs)
				for(i=0; i<docs.length;i++)
				{
					console.log('name= ' + docs[i].name);
				}
				res.render('querystudentresult', {students:docs});
			}
			else
			{
				throw err;
				res.send('not found!');
			}
		});
*/
	mgdb.DoQueryAll(mgdb.ModelStudent, function(err, docs){
		if(!err)
		{
			console.log(docs);
			//for(stu, index in docs)
			for(i=0; i<docs.length;i++)
			{
				console.log('name= ' + docs[i].name);
			}
			res.render('querystudentresult', {students:docs});
		}
		else
		{
			throw err;
			res.send('not found!');
		}
	})
    }
};

exports.deletebyid = function(req, res){
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('delete id= ' + idStr);
	
	/*
	// after delete name is unavailable!
	Student.findOneAndRemove({'_id':idStr}, function(err, docs){
		if(err)
		{
		  console.log('remove error!');
		}
		else
		{
		  res.send('deleted: ok!');
		}		
	});	
	*/

	mgdb.DeleteById(mgdb.ModelStudent, idStr, function(err, docs){
		if(err)
		{
		  console.log('remove error!');
		}
		else
		{
		  res.send('deleted: ok!');
		}		
	});	
};

exports.modifybyid = function(req, res){
	var idStr = req.params.id.substr(1, req.params.id.length-1);
	console.log('modify id= ' + idStr);
	/*
	Student.findOne({'_id':idStr}, function(err, doc){
		if(err)
		{
		  console.log('not found!');
		  res.send('not found!');
		}
		else
		{
		  res.render('modifystudent',{student:doc, id:idStr});
		}
	});	
	*/

	mgdb.FindOneById(mgdb.ModelStudent, idStr, function(err, docs){
		if(err)
		{
		  console.log('not found!');
		  res.send('not found!');
		}
		else
		{
		  res.render('modifystudent',{student:docs, id:idStr});
		}
	});
};

exports.domodify = function(req, res){
	
	console.log('modify id= ' + req.body.modifyid);
	
	Student.findOneAndUpdate(
		{'_id':req.body.modifyid}, 
		{name:req.body.name, cellphone:req.body.cellphone, email:req.body.email}, 
		function(err, doc){
			if(err)
			{
			  res.send('not found!');
			}
			else
			{
			  res.send('Update ok! name= ' + doc.name);
			}
	});	
};
