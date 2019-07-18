
function getBrowseVersion() {
	var userAgent = navigator.userAgent.toLowerCase();
    var browser = userAgent.match(/(firefox|chrome|safari|opera|msie)/);
    var browserId = "msie";
    var browserVersion = "";
    var isIE11 = (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv") > -1);
    if (isIE11) {
    	browserId = "msie";
    	browserVersion = "11.0";
    } else {
    	if (browser.length >= 2) {
    		browserId = browser[1];
    	} else {
    		browserId = "msie";
    	}
    	browserVersion = (userAgent.match(new RegExp('.+(?:version)[\/: ]([\\d.]+)')) || userAgent.match(new RegExp('(?:'+browserId+')[\/: ]([\\d.]+)')) || [0,'0'])[1];
    }
    return browserId + browserVersion;
}

//判断是否为ie5
function isBrowseIE5() {
    return (getBrowseVersion() == "msie5.5") ? true : false;
}

//判断是否为ie6
function isBrowseIE6() {
    return (getBrowseVersion() == "msie6.0") ? true : false;
}

//是否为IE7
function isBrowseIE7() {
    return (getBrowseVersion() == "msie7.0") ? true : false;
}

//是否为IE8
function isBrowseIE8() {
    return (getBrowseVersion() == "msie8.0") ? true : false;
}

//是否为IE9
function isBrowseIE9() {
    return (getBrowseVersion() == "msie9.0") ? true : false;
}

//是否为IE
function isBrowseIE() {
    return (getBrowseVersion().indexOf("msie") != -1) ? true : false;
}

//是否谷歌浏览器
function isBrowseGoogle() {
	return (navigator.userAgent.toLowerCase().match(/chrome/) != null) ? true : false;
}

//是否谷歌浏览器
function isBrowseChrome() {
	return (navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/) != null) ? true : false;
}

//是否为Firefox
function isBrowseFirefox() {
    return (navigator.userAgent.toLowerCase().match(/firefox/) != null) ? true : false;
}

//是否为Safari
function isBrowseSafari() {
    return (navigator.userAgent.toLowerCase().match(/version\/([\d.]+).*safari/) != null) ? true : false;
}

//是否支持html5
//geolocation，它是HTML5新加支持的新特性；
//它是由HTML5工作组以外的Geolocation工作组制定的。要检查浏览器是否支持它可以用一下方法
function supportHtml5() {   
    return !!navigator.geolocation;
}

//是否为移动端
function isMobile(){
	if (navigator.userAgent.match(/(iPhone|iPad|iPod|Android|ios)/i)) {
		return true;
	}
	return false;
}


//获取URL参数信息
function getUrlParameter(name){
	if(location.search==''){
		return '';
	}
	var o={};
	var search=location.search.replace(/\?/,'');//只替换第一个问号,如果参数中带有问号,当作普通文本
	var s=search.split('&');
	for(var i=0;i<s.length;i++){
		o[s[i].split('=')[0]]=s[i].split('=')[1];
	}
	return o[name]==undefined?'':o[name];
}


//获取Cookie的值数据
function getCookieVal (offset){
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1)
	endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
} 

//获取Cookie的参数值信息
function GetCookie (name){
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen)
	{
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return getCookieVal (j);
			
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0)
			break;
	}
	return null;
}

//设置浏览器的Cookie参数
function SetCookie (name, value)
{
    //判断为undefined
    if (typeof value == "undefined") {
        return;
    }
    //// 0、-0、 null、""、false、undefined 或者 NaN，那么if判断 false 其他为true
    if (!value && typeof value != "undefined" && value !== 0 && value !== "0") {
        return;
    }

	var argv = SetCookie.arguments;
	var argc = SetCookie.arguments.length;
	var expires=new Date();
	expires.setTime(expires.getTime()+(365*24*60*60*1000));
	
	var path = (3 < argc) ? argv[3] : null;
	var domain = (4 < argc) ? argv[4] : null;
	var secure = (5 < argc) ? argv[5] : false;
	document.cookie = name + "=" + escape (value) +
		((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
		((path == null) ? "" : ("; path=" + path)) +
		((domain == null) ? "" : ("; domain=" + domain)) +
		((secure == true) ? "; secure" : "");
}

//设置浏览器Cookie参数失效
function SetCookieExpire (name) {
	var date=new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = name + "=;expires="+date.toGMTString()+"; path=/";
}

//限制特殊字符
function specialChar(e){
	var keynum = e.keyCode || e.which;
	if(keynum==222 || keynum==188|| keynum==32
		|| keynum==109 || keynum==107|| keynum==189 
		|| keynum==186 || keynum==187|| keynum==190
		|| keynum==192 || keynum==191|| keynum==220 
		|| keynum==17|| keynum==219|| keynum==221)	{	
		return false;
	}
	
	if(e.shiftKey)	{
		if((keynum>=48&& keynum<=57) || keynum==32
			||keynum==187 || keynum==109|| keynum==107  
			|| keynum==186  || keynum==222 ||keynum==189
			||keynum==190|| keynum==219|| keynum==221)	{
			return false;
		}
	}
	
	return true;
}

//限制只输入数字
function onKeyDownDigit(myEvent) {
	var k;
	if (window.event)
	    k = myEvent.keyCode;     //IE,chrome
	else
	    k = myEvent.which;     //firefox
	
	if ((k == 46) || (k == 8) || (k == 9) || (k == 189) || (k == 109) 
			|| (k == 190) || (k == 110) || (k >= 48 && k <= 57) 
			|| (k >= 96 && k <= 105) || (k >= 37 && k <= 40)){
		
	}else if (k == 13) {
//		将输入键转成tab键	
//		if (window.event)
//			myEvent.keyCode = 9;
//		else
//			myEvent.which = 9;
	} else {
		if (document.all)
			myEvent.returnValue = false; //ie
		else
			myEvent.preventDefault(); //ff
	}
}

//显示ajax加载动画
function showAjaxLoading(id, flag, showtext) {
	if(flag) {
		if ( typeof showtext != "undefined" && showtext) {
			$(id).html("<img src='../images/loading.gif'/>" + _getRootFrameElement().lang.loading);
		} else {
			$(id).html("<img src='../images/loading.gif'/>");			
		}
	}else {
		$(id).text("");
	}
}

//显示ajax加载动画
function showAjaxSaving(id, flag, showtext) {
	if(flag) {
		if ( typeof showtext != "undefined" && showtext) {
			$(id).html("<img src='../images/loading.gif'/>" + _getRootFrameElement().lang.saving);
		} else {
			$(id).html("<img src='../images/loading.gif'/>");			
		}
	}else {
		$(id).text("");
	}
}

//配置焦点和失去焦点的显示提示信息
function setInputFocusBuleTip(id, tip) {
	var temp = $(id).val();
	if (temp === "") {
		$(id).val(tip);
	}
	$(id).focus(function(){
			var user = $(id).val();
			if(user === tip) { 
				$(id).val("");
			}
		});
	
	$(id).blur( function() { 
			var user = $(id).val();
			if(user === "") { 
				$(id).val(tip);
			}
		});
}

//判断ip地址是否有效  
function checkIPAddress(id, errId, tip, isMultiply) {
	var ip = $.trim($(id).val());
	var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式   
	if(ip && ip.split(',').length > 0){
		var ips = ip.split(',');
		for (var int = 0; int < ips.length; int++) {
			var curIp = ips[int];
			if(re.test(curIp)) {   
				if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256 ) 
					$(errId).text("*");
					return true;
			} else {
				var doname = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|   (io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/;
				var flag_domain = doname.test(curIp);
				if(flag_domain){
					$(errId).text("*");
					return true;
				} else {
					$(errId).text(tip);
					return false;
				}
			}
		}
	}else{
		if(re.test(ip)) {   
			if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256 ) 
				$(errId).text("*");
				return true;
		} else {
			var doname = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|   (io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/;
			var flag_domain = doname.test(ip);
			if(flag_domain){
				$(errId).text("*");
				return true;
			} else {
				$(errId).text(tip);
				return false;
			}
		}
	}
	

}

function checkPortValid(id, errId, tip) {
	var port = $.trim($(id).val());
	if(port.indexOf(';')!= -1){
        port = port.split(';');
        for (var i=0,len = port.length;i<len;i++){
            var portNum = Number(port[i]);
            if (portNum === "" || portNum < 0 || portNum > 65535) {
                $(errId).text(tip);
                return false;
            }
        }
        $(errId).text("*");
        return true;
	}else{
        if (port === "" || port < 0 || port > 65535) {
            $(errId).text(tip);
            return false;
        }else{
            $(errId).text("*");
            return true;
		}
	}

}

//判断数字和字母
function checkDigitAlpha(id,errId,tipRequire,tipRegx,min) {
	var str = $.trim($(id).val());
	if (str === "") {
		$(errId).text(tipRequire);
		return false;
	}
	
	var re = /^[A-Za-z0-9]*$/;
	if(re.test(str) == false){
		$(errId).text(tipRegx);
   		return false;
	} else {
		if (typeof min != "undefined") {
			if (str.length < min) {
				$(errId).text(tipRegx);
				return false;
			}
		}
		
		$(errId).text("");
	   	return true;
	}
}

//判断数字和字母
function checkInput(id, errId, minlength, maxlength, tipRequire, tipRegx) {
	var str = $.trim($(id).val());
	if (str === "") {
		$(errId).text(tipRequire);
		return false;
	}
	
	var length = str.replace(/[^\x00-\xff]/g,"**").length;
	if(length < minlength || length > maxlength){
		$(errId).text(tipRegx);
   		return false;
	} else {
		$(errId).text("");
   		return true;
	}
}

//判断两个输入框信息是否一致
function checkInputNotEqual(id1, id2, errId, tipErr) {
	var str1 = $.trim($(id1).val());
	var str2 = $.trim($(id2).val());
	if (str1 == str2) {
		$(errId).text(tipErr);
		return false;
	} else {
		return true;
	}
}

//判断输入信息不超过指定的范围
function checkInputRange(id, errId, min, max, tipErr) {
	var str = $.trim($(id).val());
	if (str == "" ) {
		$(errId).text(tipErr);
		return false;
	}
	
	var value = parseIntDecimal(str);
	if (value < min || value > max) {
		$(errId).text(tipErr);
		return false;
	} else {
		$(errId).text("");
		return true;
	}
}

//判断邮件地址
function checkEmailValid(id, errId, errtip){
	var mail = $.trim($(id).val());
	if (mail != "") {
		var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
		if (!sReg.test(mail)) {
			$(errId).text(errtip);
			return false;
		}
	} 
	
	$(errId).text("");
	return true;   
}

//判断网址
function checkUrlValid(id, errId, errtip){
	var url = $.trim($(id).val());
	if (url != "") {
		var sReg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
		if (!sReg.test(url)) {
			$(errId).text(errtip);
			return false;
		}
	} 
	
	$(errId).text("");
	return true;   
}

//检查密码，允许密码为空白字符
function checkPasswordInput(id, errId, emptyTip) {
	var pwd = $(id).val();
	if (pwd != "") {
		$(errId).text("");
		return true;
	} else {
		$(errId).text(emptyTip);
		return false;
	}
}

function checkConfirmPassword(pwdId, confirmId, errId, errTip) {
	var pwd1 = $(pwdId).val();
	var pwd2 = $(confirmId).val();
	if (pwd1 != "") {
		if (pwd1 != pwd2) {
			$(errId).text(errTip);
			return false;
		} else {
			if($.trim(pwd2) && ($.trim(pwd2).length < 4 || $.trim(pwd2).length > 16) ){
				$(errId).text(_getRootFrameElement().lang.passwordLimit);
				return false;
			}else{
				$(errId).text("*");
				return true;
			}
		}
	} else {
		$(errId).text("*");
		return false;
	}
}

//存在特殊字符返回true，否则返回false
function checkSpecialCharacters(str) {
	//var myReg = "[@/'\"#$%&^*]+,<>";
//	var myReg = "#$@%^&\\/:*?\"<>|,";
//	var reg = new RegExp(myReg);
	//var reg = /^[^@\/\'\\\"#$%&\^\*]+$,/;
	//var reg = /^[A-Za-z0-9]*$/;
	var reg= /[@#,|?<>":*\\\/\$%\^&\*]+/g;
	if(reg.test(str)){
	//if(!reg.test(str))  {
		return true;
	} else {
		return false;
	}
}

//禁用或者启用输入框
function diableInput(id, disable, gray) {
	if (disable) {
		if (gray) {
			$(id).css({'color':'gray'});
		}
		$(id).attr("readonly","readonly");
		//$(id).attr({"disabled":"disabled"});
	} else {
		if (gray) {
			$(id).css({'color':'#000'});
		}
		$(id).removeAttr("readonly");
		//$(id).removeAttr("disabled");
	}
}

function disableButton(id, disable) {
	if (disable) {
		$(id).attr({"disabled":"disabled"});
	} else {
		$(id).removeAttr("disabled");
	}
}

//动态调整IFrame的高度
function dynIframeHeight(obj){
  var win = obj;
  var height = 30;
  if (document.getElementById && win) {
    if (window.opera) {
      //Opera
      if (win.contentWindow.document && win.contentWindow.document.body.scrollHeight) {
          win.height = win.contentWindow.document.body.scrollHeight + height;
      }
    }
    else {
      if (win.contentDocument && win.contentDocument.body.offsetHeight) {
        //IE8����FireFox��Chrome
        win.height = win.contentDocument.body.offsetHeight + height;
      }
      else
        if (win.Document && win.Document.body.scrollHeight) {
            //IE7
           	win.height = win.Document.body.scrollHeight + height;
        }
    }
  }
}

function pageWidth(){ 
	if($.browser.msie){ 
		return document.compatMode == "CSS1Compat"? document.documentElement.clientWidth : 
		document.body.clientWidth; 
	}else{ 
		return self.innerWidth; 
	} 
}

function showErrorMessage(result, resultTip) {
	if (typeof(resultTip) != "undefined" && resultTip != "") {
		alert(resultTip);
		return ;
	}
	switch(result) {
	case 1:		//系统出现异常
		
		alert(top.lang.errException);
		break;
	case 2:		//会话已过期
		alert(top.lang.errSessionUnvalid);
		break;
	case 3:		//请求出现超时
		alert(top.lang.errTimeout);	
		break;
	case 4:		//请求出现异常
		alert(top.lang.errExceptionRequire);
		break;
	case 5:		//请求出现异常
		alert(top.lang.errExceptionNetwork);
		break;
	case 6:		//时间格式不正确
		alert(top.lang.errQueryTimeFormat);
		break;
	case 7:		//开始时间不得大于结束时间
		alert(top.lang.errQueryTimeRange);
		break;
	case 8:		//RET_REQUIRE_PARAM = 8;		//请求参数有误
		alert(top.lang.errRequireParam);
		break;
	case 9:		//RET_SERVER_NO_EXIST = 9;	//服务器信息不存在
		alert(top.lang.errServerNoExist);
		break;
	case 10:	//RET_SERVER_TYPE_ERR = 10;	//服务器类型信息不正确
		alert(top.lang.errServerTypeErr);
		break;
	case 11:	//RET_IDNO_EXIST = 11;	//编号已经被使用
		alert(top.lang.errIDNOExist);
		break;
	case 12:	//RET_DEVICE_NO_EXIST = 12;		//设备信息不存在
		alert(top.lang.errDeviceNoExist);
		break;
	case 13:	//RET_DEVICE_LIMIT_ERR = 13;
		alert(top.lang.errDeviceLimitErr);
		break;
	case 14:	//RET_DEVICE_BATCH_IDNO_ERR = 14;	//设备编号后3位必须为数字，并且递增后还保持有效
		alert(top.lang.errDeviceBatchIdnoErr);
		break;
	case 15:	//RET_ACCOUNT_EXIST = 15; 账号已经被使用
		alert(top.lang.errAccountExist);
		break;
	case 16:	//RET_CLIENT_NO_EXIST = 16; 客户信息不存在
		alert(top.lang.errClientNoExist);
		break;
	case 17:	//RET_CLIENT_HAS_DEVICE = 17;	//客户还有设备信息！无法删除！
		alert(top.lang.errClientHasDevice);
		break;
	case 18:	//RET_CLIENT_HAS_USER = 18;	//客户还有子用户信息！无法删除！
		alert(top.lang.errClientHasUser);
		break;
	case 19:	//RET_OLD_PWD_ERROR = 19;	//旧密码有误！
		alert(top.lang.errOldPwd);
		break;
	case 20:	//RET_USER_NO_EXIST = 20;	//用户信息不存在
		alert(top.lang.errUserNoExist);
		break;
	case 21:	//RET_ROLE_NO_EXIST = 21;	//角色信息已经存在
		alert(top.lang.errRoleNoExist);
		break;
	case 22:	//RET_ROLE_NAME_EXIST = 22;	//角色名称已经被使用
		alert(top.lang.errRoleNameExist);
		break;
	case 23:	//RET_ROLE_HAS_USER = 23;	//还有用户使用此角色信息！无法删除！
		alert(top.lang.errRoleHasUsed);
		break;	
	case 24:	//RET_NO_PRIVILIGE = 24;	//用户无权限
		alert(top.lang.errNoPrivilige);
		break;
	case 25:	//RET_VEHICLE_NO_EXIST = 25;	//车辆信息不存在
		alert(top.lang.errVehicelNoExist);
		break;
	case 26:	//RET_GROUP_NO_EXIST = 26;	//车辆分组不存在
		alert(top.lang.errGroupNoExist);
		break;
	case 27:	//RET_GROUP_HAS_USED = 27;	//车辆分组信息还在被占用（还存储子分组或者下级车辆）
		alert(top.lang.errGroupHasUsed);
		break;
	case 28:	//RET_DB_CONN_ERR = 28;	//数据库连接出现异常
		alert(top.lang.errDbConnErr);
		break;
	case 29:	//RET_NAME_EXIST = 29;	//名称已经被使用
		alert(top.lang.errNameExist);
		break;
	case 30:	//RET_NO_EXIST = 30;		//信息不存在
		alert(top.lang.errNoExist);
		break;
	case 31:	//RET_DOWN_STATION_SSID_EXIST = 31;		//下载站点SSID已经被使用
		alert(top.lang.errDownStationSsidExist);
		break;
	case 32:	//RET_DOWN_STATION_USED = 32;	//下载站点还被使用（拥有下载服务器信息）
		alert(top.lang.errDownStationUsed);
		break;
	case 33:	//RET_DOWN_STATION_NO_EXIST = 33;	//下载站点信息不存在
		alert(top.lang.errDownStationNoExist);
		break;
	case 34:	//RET_GROUP_NAME_USED = 34;	//同一分组下不允许存在相同名称的分组信息
		alert(top.lang.errGroupNameUsed);
		break;
	case 35:	//RET_DEVICE_HAS_REGISTER = 35;	//设备信息已经登记到系统中
		alert(top.lang.errDeviceHasRegister);
		break;
	case 36:	//RET_SERVER_NO_SUPPORT = 36;	//服务器不支持此功能
		alert(top.lang.errServerNoSupport);
		break;
	case 39:	//RET_DEVICE_IDNO_USED = 39;	//设备编号已经被使用
		alert(top.lang.errDeviceIdnoExists);
		break;
	case 41:	//RET_IMAGE_SIZE_ERR = 41;	//文件大小超过1M
		alert(top.lang.errImageSize);
		break;
	case 42:	//RET_IMAGE_TYPE_ERR = 42;	//文件格式错误
		alert(top.lang.errSImageType);
		break;
	case 45:	//RET_COMPANY_HAS_COMPANY = 45;	//公司还有子公司信息！无法删除！
		if(_getRootFrameElement().myUserRole && _getRootFrameElement().myUserRole.isChemicals()) {//危化管理
			alert('信息已被使用！无法删除！');
		}else {
			alert(top.lang.errCompanyHasCompany);
		}
		break;
	case 46:	//RET_USER_DISABLED = 46; //用户已停用
		alert(top.lang.errUserDeactivated);
		break;
	case 47:	//RET_INSTALLED = 47; //设备已安装
		alert(top.lang.errDeviceInstalled);
		break;
	case 48:	//RET_JOBNUM_EXIST = 48; //工号已存在
		alert(top.lang.errJobNumberExists);
		break;
	case 49:	//RET_SIMCARD_EXIST = 49; //SIM卡号已存在
		alert(top.lang.errSIMCardExists);
		break;
	case 50:	//RET_VEHITEAM_NOT_MOVE = 50; //车队不能移动到父公司
		alert(top.lang.errVehiTeamNotMove);
		break;
	case 51:	//RET_RULE_EXIST = 51; //规则已存在
		alert(top.lang.errRuleExists);
		break;
	case 52:	//RET_TYPE_EXIST = 52; //类型已存在
		alert(top.lang.errTypeExists);
		break;
	case 53:	//RET_BRAND_EXIST = 52; //类型已存在
		alert(top.lang.errBrandExists);
		break;
	case 54:	//RET_DEVICE_USED = 54; //设备已被使用
		alert(top.lang.errDeviceUsed);
		break;
	case 55:	//RET_MARK_NAME_USED = 55; //标记名称已被使用
		alert(top.lang.errMarkNameUsed);
		break;
	case 56:	//RET_MARK_USED = 56; //标记已被使用
		alert(top.lang.errMarkUsed);
		break;
	case 57:	//RET_USER_RESPONSE_ERR = 57; //用户请求异常
		alert(top.lang.usersRequestFails);
		break;
	case 58:	//RET_DOWNLOADTASK_EXIST = 58; //下载任务已存在
		alert(top.lang.errDownloadTaskExists);
		break;
	case 59:	//RET_DEVICE_OFFLINE = 59;  //设备不在线
		alert(top.lang.video_not_online);
		break;
	case 60:	//RET_MEDIA_ADDRESS_ERR = 60;  //流媒体地址请求失败
		alert(top.lang.media_address_err);
		break;
	case 61:	//RET_SAFE_EXIST = 61;  //车辆已存在保险信息
		alert(top.lang.safe_excit_err);
		break;
	case 62:	//RET_LINE_NOT_EXIST = 62;  //线路信息不存在
		alert(top.lang.errLineInfoNotExists);
		break;
	case 63:	//RET_LINE_NAME_ERR = 63;  //导入线路错误
		alert(top.lang.errImportLineInfo);
		break;
	case 64:	//RET_LINE_HAS_VEHICLE = 64;  //线路下还有车辆，不能删除
		alert(top.lang.errLineHasVehicle);
		break;
	case 65:	//RET_ICCARDNUM_EXIST = 65; //IC卡已存在
		alert(top.lang.errIcCardExists);
		break;
	case 66:	//RET_PROGRAM_EXIST = 66; //方案已存在
		alert(top.lang.errProgramExists);
		break;
	case 67:	//RET_STAFFREST_EXIST = 67; //员工公休方案已存在
		alert(top.lang.errStaffRestExists);
		break;
	case 68:	//RET_BUSSCHEDULING_EXIST = 68; //公交排班信息已存在
		alert(top.lang.errBusSchedulingExists);
		break;
	case 69:	//RET_TEACHER_USED= 69;	//教师还在使用，不能删除
		alert(top.lang.errTeacherUsed);
		break;
	case 70:	//RET_TEACHER_EXIST= 70;	//此教师工号已存在
		alert(top.lang.errJobNumExists);
		break;
	case 71:	//RET_CLASS_USED= 71;	//班级还在使用，不能删除
		alert(top.lang.errClassUsed);
		break;
	case 72:	//RET_CLASS_EXIST= 72;	//此班级已存在
		alert(top.lang.errClassExists);
		break;
	case 73:	//RET_STUDENT_EXIST= 73;	//此学生学号已存在
		alert(top.lang.errStudentNumExists);
		break;
	case 74:	//RET_STUDENT_NUM= 74;	//超出车辆所能容纳学生数
		alert(top.lang.errMoreThanTheVehiSeats);
		break;
	case 75:	//RET_HANDING_EXIST= 75;	//装卸点已存在
		alert(top.lang.errPointsExists);
		break;	
	case 76:	//RET_STUDENT_INFO_ERROR= 76;	//学生信息不正确
		alert(top.lang.errStudentInformation);
		break;
	case 77:	//RET_WECHATSTURELATION_EXIST= 77;	//账号已绑定学生
		alert(top.lang.errBoundStudent);
		break;
	case 78:	//RET_WECHATSTURELATION_NOTEXIST= 78;	//账号未绑定学生
		alert(top.lang.errUnboundStudent);
		break;
	case 79:	//RET_STUVEHIRELATION_NOTEXIST= 79;	//学生未分配车辆
		alert(top.lang.errStudentUnassigned);
		break;
	case 80:	//RET_SORT_USED= 80;	//类项已使用
		alert('类项已使用');
		break;
	case 81:	//RET_USED= 81;	//信息还被使用
		alert('信息已被使用');
		break;
	case 82:	//RET_EXIST= 82;	//信息已经存在
		alert('信息已经存在');
		break;
	case 84:	//RET_VEHICLE_IN_LINE= 84;	//车辆已分配到线路下
		alert('车辆已分配到线路下，车辆类型不能修改！');
		break;
	case 86:	//RET_NOT_EDIT_DEVICETYPE = 86;	//车辆存在两个设备，不能修改设备类型
		alert(top.lang.errorEditDeviceType);
		break;
	case 88:	//Channel_Cannot_Modified= 88;	//无法修改通道信息
		alert(top.lang.channel_Cannot_Modified);
		break;	
	case 89:		
		alert(_getRootFrameElement().lang.department_exist);
		break;
	case 90:		
		alert(_getRootFrameElement().lang.department_have_people);
		break;
	case 91:
		alert(_getRootFrameElement().lang.department_name_exist);
		break;
	case 93:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
		alert(_getRootFrameElement().lang.dispatch_user_error);
		break;	
	case 94:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
		alert(_getRootFrameElement().lang.password_no_change);
		break;
	case 95:	//RET_DISPACTH_ERROR 95;	//旧密码错误
		alert(_getRootFrameElement().lang.old_password_err);
		break;
	case 100:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
		alert("无法识别证件照中的面部信息");
		break;	
	case 101:	//RET_DISPACTH_ERROR 93;	//调度员账号相关操作数据库出现异常
		alert("证件照入库失败");
		break;
	case 102:	//密码强度较低
		alert(_getRootFrameElement().lang.password_simple);
		break;
	default:	//未知错误
		alert(top.lang.errUnkown);
		break;
	}	
}


/**
 * 获取父窗口
 * @returns {Window}
 * @private
 */
function _getRootFrameElement() {
    var b = window.self;
    while (true) {
        if (window.top === b) {//ie可能不相当
            return b;
        }
        b = b.parent;
    }
}


/**
 * 设置是否全选或者不选	
 * @return {TypeName} 
 */
function onSelectedAll(id, allId) {
	if ($("#" + allId).attr("checked")) {
		 $("[name='" + id + "']").attr("checked",'true');//全选
		 $(".bDiv").find("table tr").addClass("trSelected");
	} else {
		$("[name='" + id + "']").removeAttr("checked");//取消全选
		$(".bDiv").find("table tr").removeClass("trSelected");
	}
}

//选中单个结点
function onSelectedItem(id, allId) {
	var checkAll = true;
	$("[name='" + id + "']").each(function(){
		if($(this).val() != "" && !$(this).attr("checked"))	{
			checkAll = false;
		}
	});
	
	if (checkAll) {
		 $("#" + allId).attr("checked", true);
	} else {
		$("#" + allId).removeAttr("checked");
	}
}

//取得选中的结点信息，返回数据
function getSelectItem(id) {
	var select = [];
	$("[name='" + id + "']").each(function(){
		if ($(this).val() != "" && $(this).attr("checked")) {
			select.push($(this).val());
		}
	});
	return select;
}

function getPageSize() {
	var scrW, scrH;
	if(window.innerHeight && window.scrollMaxY) {
		// Mozilla
		scrW = window.innerWidth + window.scrollMaxX;
		scrH = window.innerHeight + window.scrollMaxY;
	} else if(document.body.scrollHeight > document.body.offsetHeight){
		// all but IE Mac
		scrW = document.body.scrollWidth;
		scrH = document.body.scrollHeight;
	} else if(document.body) { // IE Mac
		scrW = document.body.offsetWidth;
		scrH = document.body.offsetHeight;
	}

	var winW, winH;
	if(window.innerHeight) { // all except IE
		winW = window.innerWidth;
		winH = window.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		// IE 6 Strict Mode
		winW = document.documentElement.clientWidth; 
		winH = document.documentElement.clientHeight;
	} else if (document.body) { // other
		winW = document.body.clientWidth;
		winH = document.body.clientHeight;
	}	
	
	// for small pages with total size less then the viewport
	var pageW = (scrW<winW) ? winW : scrW;
	var pageH = (scrH<winH) ? winH : scrH;

	return {PageW:pageW, PageH:pageH, WinW:winW, WinH:winH};
}

function getPageScroll() {
	var x, y;
	if(window.pageYOffset) {
		// all except IE
		y = window.pageYOffset;
		x = window.pageXOffset;
	} else if(document.documentElement && document.documentElement.scrollTop) {
		// IE 6 Strict
		y = document.documentElement.scrollTop;
		x = document.documentElement.scrollLeft;
	} else if(document.body) {
		// all other IE
		y = document.body.scrollTop;
		x = document.body.scrollLeft; 
	}
	return {X:x, Y:y};
}

function append2Table(tableId, k, row) {
	var temp;
	if ( (k % 2) == 1) {
		temp = "<tr id=\"tableTop_" + k + "\" class=\"tabdata\">" + row.html() + "</tr>";
	} else {
		temp = "<tr id=\"tableTop_" + k + "\" class=\"tabdata bluebg\">" + row.html() + "</tr>";
	}
	$(tableId).append(temp);
}

function append2TableEx(tableId, k, row, id) {
	var temp;
	if ( (k % 2) == 1) {
		temp = "<tr id=\"tableTop_" + id + "\" class=\"tabdata\">" + row.html() + "</tr>";
	} else {
		temp = "<tr id=\"tableTop_" + id + "\" class=\"tabdata bluebg\">" + row.html() + "</tr>";
	}
	$(tableId).append(temp);
}

// hide flexigrid table col
function hideTableCol(col) {
	var colName = '.' + col;
	$('.hDiv ' + colName).hide();
	$('.bDiv ' + colName).hide();
}

function showTableCol() {
	var colName = '.' + col;
	$('.hDiv ' + colName).show();
	$('.bDiv ' + colName).show();
}

function hideTableColList(list){
	setTimeout(function(){
		if(typeof list == 'object' && list.length > 0) {
			for (var i=0;i < list.length;i++) {
				hideTableCol(list[i]);
			}
		}
	},500);
}

/**
 * 隐藏表格列
 * @param line
 */
function hideThLine(line) {
	setTimeout(function(){
		$('.th-' + line).hide();
		$('.td-' + line).hide();
	},256);
}

function hideThLineList(listObj){
	setTimeout(function(){
		if(typeof listObj == 'object' && listObj.length > 0) {
			for (var i=0;i < listObj.length;i++) {
				$('.th-' + listObj[i]).hide();
				$('.td-' + listObj[i]).hide();
			}
		}
	},256);
}

function getAlarmTypeString(armType) {
	var ret = "";
	switch(parseInt(armType)) {
	case 2:		
		ret = _getRootFrameElement().lang.alarm_type_ungency_button;
		break;
	case 3:		
		ret = _getRootFrameElement().lang.alarm_type_shake;
		break;
	case 4:		
		ret = _getRootFrameElement().lang.alarm_type_video_lost;
		break;
	case 6:		
		ret = _getRootFrameElement().lang.alarm_type_door_open_lawless;
		break;
	case 9:		
		ret = _getRootFrameElement().lang.alarm_type_temperator;
		break;
	case 10:		
		ret = _getRootFrameElement().lang.alarm_type_disk_error;
		break;
	case 11:		
		ret = _getRootFrameElement().lang.alarm_type_overspeed;
		break;
	case 14:		
		ret = _getRootFrameElement().lang.alarm_type_park_too_long;
		break;
	case 15:		
		ret = _getRootFrameElement().lang.alarm_type_motion;
		break;
	case 18:		
		ret = _getRootFrameElement().lang.alarm_type_gps_signal_loss;
		break;
	case 19:		
		ret = _getRootFrameElement().lang.alarm_type_io1;
		break;
	case 20:		
		ret = _getRootFrameElement().lang.alarm_type_io2;
		break;
	case 21:		
		ret = _getRootFrameElement().lang.alarm_type_io3;
		break;
	case 22:		
		ret = _getRootFrameElement().lang.alarm_type_io4;
		break;
	case 23:		
		ret = _getRootFrameElement().lang.alarm_type_io5;
		break;
	case 24:		
		ret = _getRootFrameElement().lang.alarm_type_io6;
		break;
	case 25:		
		ret = _getRootFrameElement().lang.alarm_type_io7;
		break;
	case 26:		
		ret = _getRootFrameElement().lang.alarm_type_io8;
		break;
	case 27:		
		ret = _getRootFrameElement().lang.alarm_type_fence_in;
		break;
	case 28:		
		ret = _getRootFrameElement().lang.alarm_type_fence_out;
		break;
	case 29:		
		ret = _getRootFrameElement().lang.alarm_type_fence_in_overspeed;
		break;
	case 30:		
		ret = _getRootFrameElement().lang.alarm_type_fence_out_overspeed;
		break;
	case 31:		
		ret = _getRootFrameElement().lang.alarm_type_fence_in_lowspeed;
		break;
	case 32:		
		ret = _getRootFrameElement().lang.alarm_type_fence_out_lowspeed;
		break;
	case 33:		
		ret = _getRootFrameElement().lang.alarm_type_fence_in_stop;
		break;
	case 34:		
		ret = _getRootFrameElement().lang.alarm_type_fence_out_stop;
		break;
	case 113:		
		ret = _getRootFrameElement().lang.alarm_type_custom;
		break;
	case 67:
		ret = _getRootFrameElement().lang.alarm_type_offline;
		break;
	default:	//未知错误
		ret = _getRootFrameElement().lang.alarm_type_unkown;
		break;
	}	
	return ret;
}

function GetElementsByName(tag, name) { 
	var elem = document.getElementsByTagName(tag); 
	var arr = []; 
	var index = 0; 
	var l = elem.length; 
	for(var i = 0; i < l; i++) { 
		var att = elem[i].getAttribute("name"); 
		if(att == name) { 
		arr[index++] = elem[i]; 
		} 
	} 
	return arr; 
} 

//js获取项目根路径，如： http://localhost:8083/xx
function getRootPath(){
//获取当前网址，如： http://localhost:8083/xx/xx/xx.jsp
	var curWwwPath=window.document.location.href;
	//获取主机地址之后的目录，如： xx/xx/xx.jsp
	var pathName=window.document.location.pathname;
	var pos=curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht=curWwwPath.substring(0,pos);
	//获取带"/"的项目名，如：/xx
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	return localhostPaht;
}

//设置null=''
function changeNull(param){
	return param == null ? '': param;
}
/**
 * 判断字符串str是否包含在本字符串中
 * @param str
 * @returns {Boolean}
 */
String.prototype.indexOfNotCase = function(str) {
	return this.toLowerCase().indexOf(str.toLowerCase());
}


//用于隔天查询提示   当天不能查询  日报表隔天查询
function cheackDate(beginTime,endTime) {
	if(dateIsValidDate(beginTime) && dateIsValidDate(endTime)){//日报表需要提示隔天查询不能查询当天的记录
		var cur = dateCurrentDateString();//获取当天日期  2012-01-11
		if(dateCompareStrDate(cur, beginTime) != 1 || dateCompareStrDate(cur, endTime) != 1 ){
			$.dialog.tips(_getRootFrameElement().lang.tipDailyReport);//默认1.5秒
			return true;
		}
	}
	return false;
}

//用于隔天查询提示   当天不能查询  日报表隔天查询 不提示
function cheackDateEx(beginTime,endTime) {
    if(dateIsValidDate(beginTime) && dateIsValidDate(endTime)){//日报表需要提示隔天查询不能查询当天的记录
        var cur = dateCurrentDateString();//获取当天日期  2012-01-11
        if(dateCompareStrDate(cur, beginTime) != 1 || dateCompareStrDate(cur, endTime) != 1 ){
            return true;
        }
    }
    return false;
}

var marker_ = null;
//检查是否生产完成
function checkFileDownload(marker,callback) {
	if(marker) { // 如果marker存在，给内部变量赋值
		marker_ = marker;
	}
	$.myajax.jsonGet("StandardReportLiChengAction_checkFileDownload.action?marker="+marker_, function(json,action,success){
		if(success) {
			if(json.isLoadSuc) {
				if(typeof callback == 'function') {
					callback(marker_);
				} else {
					fileDownload(marker_);
				}
			}else {
				setTimeout(checkFileDownload, 10000);
			}
		}else {
			$('body').flexShowLoading(false);
		}
	}, null);
}

//下载文件
function fileDownload(_marker) {
	document.reportForm.action = "StandardReportLiChengAction_fileDownload.action?marker="+_marker;
	document.reportForm.submit();
	$('body').flexShowLoading(false);
}


//动态加载js
function loadJS(id,url){
	  var xmlHttp = null;
	  if(window.ActiveXObject)//IE
	  {
	    try {
	      //IE6以及以后版本中可以使用
	      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
	    }
	    catch (e) {
	      //IE5.5以及以后版本可以使用
	      xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
	    }
	  }
	  else if(window.XMLHttpRequest)//Firefox，Opera 8.0+，Safari，Chrome
	  {
	    xmlHttp = new XMLHttpRequest();
	  }
	  //采用同步加载
	  xmlHttp.open("GET",url,false);
	  //发送同步请求，如果浏览器为Chrome或Opera，必须发布后才能运行，不然会报错
	  xmlHttp.send(null);
	  //4代表数据发送完毕
	  if ( xmlHttp.readyState == 4 )
	  {
	    //0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
	    if((xmlHttp.status >= 200 && xmlHttp.status <300) || xmlHttp.status == 0 || xmlHttp.status == 304)
	    {
	      var myHead = document.getElementsByTagName("HEAD").item(0);
	      var myScript = document.createElement( "script" );
	      myScript.language = "javascript";
	      myScript.type = "text/javascript";
	      myScript.id = id;
	      try{
	        //IE8以及以下不支持这种方式，需要通过text属性来设置
	        myScript.appendChild(document.createTextNode(xmlHttp.responseText));
	      }
	      catch (ex){
	        myScript.text = xmlHttp.responseText;
	      }
	      myHead.appendChild( myScript );
	      return true;
	    }
	    else
	    {
	      return false;
	    }
	  }
	  else
	  {
	    return false;
	  }
	}

/**
 * 证据页面
 * @param guid
 * @param alarmType
 * @param armStartTime
 */
function detal(guid, alarmType, armStartTime){
	if(guid && alarmType && armStartTime){
//		var url = '../EvidenceManagement/index.html?guid='+guid+"&alarmType="+alarmType+"&armStartTime="+dateFormat2TimeString(new Date(armStartTime))+"&lang="+GetCookie("language")+"&mapType="+ _getRootFrameElement().mapType;;
//		window.open(url);
		var url = 'EvidenceManagement/new.html?guid='+guid+"&alarmType="+alarmType+"&armStartTime="+dateFormat2TimeString(new Date(armStartTime))+"&lang="+GetCookie("language")+"&mapType="+ _getRootFrameElement().mapType;;
		var dialog_ = $.dialog({id:'evidenceManagement', title:_getRootFrameElement().lang.subiao_safety,content: 'url:'+url,
			width:'1020px',height:'540px', min:false, max:false, lock:true});
		//dialog_.max();
	}
}

function doExitEvidenceManagement() {
	$.dialog({id:'evidenceManagement'}).close();
}

/**
 * 睡眠几秒
 * @param numberMillis
 */
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}


/**
 * 查看浏览器是否支持webStorage
 * @returns {boolean}
 */
function checkWebStorage(){
    if(typeof(Storage) !== "undefined") {
    	return true;
    } else {
       return false;
    }
}

/**
 * 设置SessionStorage
 * @param key
 * @param value
 * @constructor
 */
function SetSessionStorage(key,value){
	if(checkWebStorage()){
        sessionStorage.setItem(key, value);
	}else{
		alert('Your browser does not support WebStorage');
	}
}

/**
 * 获取SessionStorage
 * @param key
 */
function getSessionStorage(key){
	return sessionStorage.getItem(key);
}


/**
 * 删除SessionStorage
 * @param key
 */
function  removeSessionStorage(key) {
    sessionStorage.removeItem(key);
}

/**
 * 删除所有保存的SessionStorage
 */
function removeAllSessionStorage(){
    sessionStorage.clear();
}

/**
 * 设置LocalStorage
 * @param key
 * @param value
 */
function setLocalStorage(key,value){
    if(checkWebStorage()){
        localStorage.setItem(key, value);
    }else{
        alert('Your browser does not support WebStorage');
    }
}

/**
 * 获取LocalStorage
 * @param key
 */
function getLocalStorage(key){
    return localStorage.getItem(key);
}


/**
 * 删除LocalStorage
 * @param key
 */
function  removeLocalStorage(key) {
    localStorage.removeItem(key);
}

/**
 * 删除所有保存的LocalStorage
 */
function removeAllLocalStorage(){
    localStorage.clear();
}


/**
 * 时间秒数转换为时分秒
 */
function getTimeDifference(second) {
	var difValue = "";
	var days = parseInt(second/(60*60*24));
	var hours =  parseInt(second/(60*60) - days*24);
	var minutes =  parseInt(second/(60) - days*24*60 - hours*60);
	var seconds =  parseInt(second - days*24*60*60 - hours*60*60 - minutes*60); 
	if(days != 0) {
		difValue += days + ' ' + _getRootFrameElement().lang.min_day;
	} 
	if(hours != 0) {
		difValue += " " + hours + ' ' + _getRootFrameElement().lang.min_hour;
	}
	if(minutes != 0) {
		difValue += " " + minutes + ' ' + _getRootFrameElement().lang.min_minute;
	}
	if(seconds != 0) {
		difValue += " " + seconds + ' ' + _getRootFrameElement().lang.min_second;
	}
	return difValue;
}












