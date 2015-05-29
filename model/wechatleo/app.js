var http = require('http');
var url = require('url');
var wechat = require('./wechat/wechat');
var usrMsgHandler = require('./johnnyMsgHandler');

http.createServer(function (req, res)
{	
	var path = url.parse(req.url).pathname;
	
	if (path.indexOf('/wechat') == 0)
	{
		console.log("wechat");
		wechat.process(req, res, usrMsgHandler);
		return;
	}
	else
	{
		console.log("else");
	}

}).listen(process.env.PORT || 80, null);

