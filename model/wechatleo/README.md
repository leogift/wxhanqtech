1.Ŀ¼wechatΪ��Ŀ¼������defaultMsgHandler.js/msgResponser.js/wechat.js��ʹ��ʱֱ��require��

2.package.jsonΪnpm�����ļ���ֱ��npm install��

3.��������Ŀ¼��Ϊ����ٶȵ�ͼ��example������app.js���������ӣ�usrMsgHandler.js�û��Զ�����Ӧ�������ӣ�base64Code.js�������ȣ�
	��󽫰�BaiduMapAPIҲ�����NodeJS�汾

4.����ֻ��Ҫģ��defaultMsgHandler.js��ʵ��Text��Image��Voice��Video��Location��Event����Ӧ������Ϊ��xxxx.js�����μ������е�usrMsgHandler.js��;

5.΢�Żظ���ʽ��/wechat/msgResponser.js�У��ֱ�Ϊ��

	responseText = function(res,msg,contentStr)	//���ֻظ�����res,msg��ֱ�Ӵ��룬contentStr��д����
	���ӣ�
		msgResponser.responseText(res, msg, ��hello world��);
	
	responseImage = function(res,msg,mediaId)		//ͼƬ�ظ�����res,msg��ֱ�Ӵ��룬mediaIdΪͼƬ��΢�ŷ������ϵ�ID����ID�����û���ͼƬʱ���/�����������ϴ����
	
	responseVoice = function(res,msg,mediaId)		//�����ظ�����res,msg��ֱ�Ӵ��룬mediaIdΪ������΢�ŷ������ϵ�ID����ID�����û�������ʱ���/�����������ϴ����
	
	responseNews = function(res,msg,articles)		//ͼ�����ӻظ�����res,msg��ֱ�Ӵ��룬articlesΪ�ṹ�����飺
	���ӣ�
		var articles = [];
		articles[0] = 
		{
		    Title : "��ͼ0",
		    Description : "����λ��0",
		    PicUrl : ��http://123.456.789��,
		    Url : "http://123.234.345"
		};
		articles[1] = 
		{
		    Title : "��ͼ1",
		    Description : "����λ��1",
		    PicUrl : ��http://123.456.789��,
		    Url : "http://123.234.345"
		};
		msgResponser.responseNews(res, msg, articles);

6.app.js�����ö���������
	http://121.201.13.217/wechat
	����url������else

7./wechat/accessToken.jsΪ΢�ŷ�����������ʹ��ʱֱ��require������΢�ŷ�������֤����Ҫ��������ÿСʱ����GetAccessTokenһ�λ�ȡaccessToken��ʹ��accessToken����������Դ��

��ʱ��ȡaccessToken��������node-scheduleģ��Ϊ����
var rule = new schedule.RecurrenceRule();
rule.minute = 30;
schedule.scheduleJob(rule, function()
{
	ACCESSTOKEN=accessToken.GetAccessToken(null, null);//ʹ��Ĭ��appid��secret
});

����media����(mediaidΪ������Դ��΢����Ϣ�����ķ�����ΨһID��filepathΪ�����ļ�������������·��)
accessToken.GetMedia(ACCESSTOKEN, "RW0TziDNrL5yYCODee7eAOp9CG7Vjb0fTPstPAGaYHWLab0NHVkRkd", "/home/leo/20140101.jpg");
