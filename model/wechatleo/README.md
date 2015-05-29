1.目录wechat为库目录，包含defaultMsgHandler.js/msgResponser.js/wechat.js；使用时直接require；

2.package.json为npm依赖文件，直接npm install；

3.外面其它目录下为加入百度地图的example，包括app.js主程序例子，usrMsgHandler.js用户自定义响应程序例子，base64Code.js解码程序等；
	今后将把BaiduMapAPI也翻译成NodeJS版本

4.调用只需要模仿defaultMsgHandler.js，实现Text、Image、Voice、Video、Location、Event的响应，保存为“xxxx.js”（参见例程中的usrMsgHandler.js）;

5.微信回复方式在/wechat/msgResponser.js中，分别为：

	responseText = function(res,msg,contentStr)	//文字回复，（res,msg）直接传入，contentStr填写文字
	例子：
		msgResponser.responseText(res, msg, “hello world”);
	
	responseImage = function(res,msg,mediaId)		//图片回复，（res,msg）直接传入，mediaId为图片在微信服务器上的ID，该ID可有用户发图片时获得/服务器主动上传获得
	
	responseVoice = function(res,msg,mediaId)		//语音回复，（res,msg）直接传入，mediaId为语音在微信服务器上的ID，该ID可有用户发语音时获得/服务器主动上传获得
	
	responseNews = function(res,msg,articles)		//图文链接回复，（res,msg）直接传入，articles为结构体数组：
	例子：
		var articles = [];
		articles[0] = 
		{
		    Title : "地图0",
		    Description : "地理位置0",
		    PicUrl : “http://123.456.789”,
		    Url : "http://123.234.345"
		};
		articles[1] = 
		{
		    Title : "地图1",
		    Description : "地理位置1",
		    PicUrl : “http://123.456.789”,
		    Url : "http://123.234.345"
		};
		msgResponser.responseNews(res, msg, articles);

6.app.js中启用二级域名：
	http://121.201.13.217/wechat
	其它url过滤至else

7./wechat/accessToken.js为微信服务器操作，使用时直接require。启用微信服务器认证，需要由主程序每小时调用GetAccessToken一次获取accessToken；使用accessToken可以下载资源。

定时获取accessToken方法（以node-schedule模块为例）
var rule = new schedule.RecurrenceRule();
rule.minute = 30;
schedule.scheduleJob(rule, function()
{
	ACCESSTOKEN=accessToken.GetAccessToken(null, null);//使用默认appid和secret
});

下载media方法(mediaid为包含资源的微信消息发来的服务器唯一ID，filepath为包含文件名的完整保存路径)
accessToken.GetMedia(ACCESSTOKEN, "RW0TziDNrL5yYCODee7eAOp9CG7Vjb0fTPstPAGaYHWLab0NHVkRkd", "/home/leo/20140101.jpg");
