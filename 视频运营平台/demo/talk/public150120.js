$(function() {
	//去除Enter键和Backspace键，避免按这两个键退出系统的问题
	$(document).keydown(function (e) {
		var doPrevent;
		if (e.keyCode == 8||e.keyCode==13) {//注：8为Backspace键，13为Enter键
			var d = e.srcElement || e.target;
			if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
				doPrevent = d.readOnly || d.disabled;
			}else
				doPrevent = true;
		}else 
			doPrevent = false;
		if (doPrevent)
			e.preventDefault();
	});
});

//字符串是否s结束
String.prototype.endWith=function(s){
	 if(s==null||s==""||this.length==0||s.length>this.length)
		 return false;
	 if(this.substring(this.length-s.length)==s)
		 return true;
	 else
		 return false;
	 return true;
 };
 //字符串是否s开始
String.prototype.startWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
		return false;
	if(this.substr(0,s.length)==s)
		return true;
	else
		return false;
	return true;
};
///<summary>获得字符串实际长度，中文2，英文1</summary>
///<param name="str">要获得长度的字符串</param>
String.prototype.realLength = function() {
	var realLength = 0, len = this.length, charCode = -1;    
    for (var i = 0; i < len; i++) {        
    	charCode = this.charCodeAt(i);        
    	if (charCode >= 0 && charCode <= 128) 
    		realLength += 1;        
    	else realLength += 2;    
    }    
    return realLength;
}
//截取字符串
String.prototype.getRealSubStr = function(start, lenth) {
	var charCode = -1, retStr = '';  
	var str = this.substr(start, lenth);
	var realLength = retStr.realLength();
	
	var i = 0;
	while(realLength <= lenth && i <= lenth) {
		retStr += str.substr(i, 1);
		realLength = retStr.realLength();
		i++;
	}
    return retStr;
}

/**
 * 全部替换
 * g 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）
 * m 执行多行匹配
 * @param regex  //被替换的
 * @param replacement //替换的
 * @returns String
 */
String.prototype.replaceAll = function(regex, replacement){
	//this.replace(/regex/g, replacement)
	return this.replace(new RegExp(regex, "gm"), replacement);
}

/**
 * 比较字符串是否相等，不区分大小写
 * @param str
 * @returns {Boolean}
 */
String.prototype.compareNotCase = function(str) {
	return this.toLowerCase() == str.toLowerCase();
}

/**
 * 判断字符串str是否包含在本字符串中
 * @param str
 * @returns {Boolean}
 */
String.prototype.indexOfNotCase = function(str) {
	return this.toLowerCase().indexOf(str.toLowerCase());
}

// 根据回调函数查找数组中的值
// ES6方法，兼容ES5的重写方法
Array.prototype.find = function(callback){
    for(var i=0;i<this.length;i++){
        if(callback(this[i])){
            return this[i];
        }
    }
    return null;
}


var getLength = function(str) {    
	///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;    
    for (var i = 0; i < len; i++) {        
    	charCode = str.charCodeAt(i);        
    	if (charCode >= 0 && charCode <= 128) 
    		realLength += 1;        
    	else realLength += 2;    
    }    
    return realLength;
 };

//数组中是否存在e
Array.prototype.S=String.fromCharCode(2);  
Array.prototype.in_array=function(e)  {  
	var r=new RegExp(this.S+e+this.S);
	return (r.test(this.S+this.join(this.S)+this.S));  
};  

//数组中e 的下标
Array.prototype.getIndex=function(e)  {  
	for (var i = 0; i < this.length; i++) {
		if (this[i] == e) {
			return i;    
		} 
	}  
};  

function toggleMyClass(mid, obj, className) {
	$(mid).each(function(){
		if(this == obj) {
			$(this).addClass(className);
		}else {
			$(this).removeClass(className);
		}
	});
};

/**
 * 音频文件获取编码后的字符串
 * js和java的ascii 1-127的字符循环编码匹配不同
 *	ascii      java        js
 *               +        %20
 *	!           %21        !
 *	'           %27        '
 *	(           %28        (
 *	)           %29        )
 *	~           %7E        ~
 *	js 编码后对特殊字符做个处理
 */
function audioFileEncodeURI(value) {
	value = encodeURI(value);
	value = value.replace(/%20/gi, "+").replace(/(!)|(')|(\()|(\))|(\~)/gi, function(item) {
		return "%" + item.charCodeAt(0).toString(16).toLocaleUpperCase();
	});
	return value;
}

//获取数组中所有id组成的新数组 type 类型 'id' 或者 'name'
function getNewArrayByArray(array,type) {
	var newArray = [];
	if(type == null || array == null) {
		return newArray;
	}
	for(var i = 0; i < array.length; i++) {
		if(type == 'id') {
			if(array[i].id) {
				newArray.push(array[i].id);
			}
		} else if(type == 'vehiId') {
			if(array[i].vehiId) {
				newArray.push(array[i].vehiId);
			}
		}else if(type == 'name') {
			newArray.push(array[i].name);
		}else if(type == 'nm'){
			newArray.push(array[i].nm);
		}
	}
	return newArray;
};

//获取数组中id与id相同的值
function getArrayName(array,id) {
	if(id == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i].name;
		}
	}
	return '';
};


//获取数组中属性为param 的值为value 的  属性param2 的值
function getArrayParam(array, key, keyParam, resultRaram) {
	if(key == null || keyParam == null || resultRaram == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i][keyParam] == key) {
			return array[i][resultRaram];
		}
	}
	return '';
};

//多个获取获取数组中属性为param 的值为value 的  属性param2 的值
function getArrayParams(array, keys, keyParam, resultRaram){
	if(keys == null || keyParam == null || resultRaram == null) {
		return '';
	}
	var keys_ = keys.split(',')
	var resultRaram_ = [];
	if(keys_ && keys_.length > 0){
		for (var k = 0, j = keys_.length; k < j; k++) {
			var key = keys_[k];
			for(var i = 0; i < array.length; i++) {
				if(array[i][keyParam] == key) {
					resultRaram_.push(array[i][resultRaram]);
					break;
				}
			}
		}
	}
	return resultRaram_;
}





////获取数组中id与id相同的值
//function getMarkArrayName(array,id) {
//	if(id == null) {
//		return '';
//	}
//	for(var i = 0; i < array.length; i++) {
//		if(array[i].i == id) {
//			return array[i].n;
//		}
//	}
//	return '';
//};




//
function getArrayLevel(array,id) {
	if(id == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i].level;
		}
	}
	return '';
};

//根据id返回相应对象
function getArrayInfo(array,id) {
	if(id == null) {
		return null;
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i];
		}
	}
	return null;
}

//根据id返回相应对象的索引
function getArrayIndex(array, id) {
	if(id == null) {
		return 0;
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return i;
		}
	}
	return 0;
}

function arrayToStr(arr) {
	var str = '';
	for(var i = 0; i < arr.length; i++) {
		if(i != 0) str += '|';
		str += arr[i].id + '&' + arr[i].name;
	}
	return str;
}


//
//function arrayToMarkStr(arr) {
//	var str = '';
//	for(var i = 0; i < arr.length; i++) {
//		if(i != 0) str += '|';
//		str += arr[i].i + '&' + arr[i].n;
//	}
//	return str;
//}



function vehicleList2Arr(arr) {
	var str = '';
	for(var i = 0; i < arr.length; i++) {
		if(i != 0) str += '|';
		str += arr[i].nm + '&' + arr[i].nm;
	}
	return str;
}

//获取距离body的上边距
function getTop(e){
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetTop;
		obj = obj.offsetParent;
	}
	while(obj != null && e != document.body) {
		offset -= e.scrollTop;
		e = e.parentElement;
	}
	return offset;
} 
//获取距离body的左边距
function getLeft(e){ 
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	while(e != null && e != document.body) {
		offset -= e.scrollLeft;
		e = e.parentElement;
	}
	return offset;
}

//限制输入数字
function restrictionsDigital(mid) {
	$(mid).on('blur',function() {
		var isNum = /^[0-9]*$/;
		var value = $.trim($(this).val());
		if(!isNum.test(value)) {
			$(this).val(value.substring(0,value.length-1));
		}
	});
}

/**
 * 限制输入数字
 */
function enterDigital(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /\D/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)) {
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * mid th panel 字段名称
 * 限制输入数字 最大max位数字 失败回调
 */
function enterDigitalEx(mid,maxNum,callback) {
    $('.input-' + mid).on('blur',function() {
        var isNum = /\D$/g;
        var value = $.trim($(this).val());

        if(isNumber(maxNum) && (value.length > maxNum)){
//			alert('字符输入超过限制');
            $(this).val(value.substring(0,maxNum));
        }

        if(isNum.test(value)) {
            $(this).val(value.replace(isNum,''));
            if(callback != null && typeof callback == 'function') {
                callback.apply();
            }
        }
    });
}


/**
 * 限制输入数字和'.-'
 */
function enterDigitalAndPoint(mid) {
	$(mid).on('blur',function() {
		if(/[^\d.-]/g.test(this.value)) {
			this.value = this.value.replace(/[^\d.-]/g, '');  //清除“数字”和“.”“-”以外的字符
		}
		if(/^\./g.test(this.value)) {
			this.value = this.value.replace(/^\./g, '');  //验证第一个字符是数字而不是.
		}
		if(/^\-\./g.test(this.value)) {
			this.value = this.value.replace(/^\-\./g, '-'); //不能存在-.
		}
//		var isCkx2 = /\.{2,}/g; //不能有连续2个.
		if(/\.+\d*\-*\.+/g.test(this.value)) {//不能有超过2个的.
			//只保留第一个. 清除多余的.
			this.value = this.value.replace('.','$#$').replace(/\./g,'').replace("$#$",'.');
		}
		if(/\-+\d*\.*\-+/g.test(this.value)) {//不能有超过2个的-
			//只保留第一个- 清除多余的-
			this.value = this.value.replace('-','$#$').replace(/\-/g,'').replace('$#$','-'); 
		}else {
			if(/\d+\.*\-/g.test(this.value)) {//不能以数字-开头
				this.value = this.value.substring(0,this.value.length-1);
			}
		}
	});
}

/**
 * 限制输入特殊字符
 */
function cleanSpelChar(mid){
	$(mid).on('blur',function() {
		/*var pattern = new RegExp("[`~%!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\"'。，、？]"); 
		var value = $.trim($(this).val());
		if(value != null && value != '') {
			var rs = ""; 
			for (var i = 0; i < value.length; i++) { 
				rs = rs+value.substr(i, 1).replace(pattern, ''); 
			} 
			$(this).val(rs);
		}*/
		var reg= /[\s@#,|?<>"':*\\\/\$%\^&\*]+/g;
		var value = $.trim($(this).val());
		if(reg.test(value)){
		//if(!reg.test(str))  {
			$(this).val(value.replace(reg,''));
		}
	});
}

/**
 * 限制"和'
 */
function cleanStringSymbolChar(mid){
	$(mid).on('blur',function() {
		var reg= /["']+/g;
		var value = $.trim($(this).val());
		if(reg.test(value)){
			$(this).val(value.replace(reg,''));
		}
	});
}

/**
 * 只能输入汉字和字母
 */
function enterChar(mid) {
	$(mid).on('blur',function() {
		var isNum = /[\d]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制只能输入汉字英文和数字
 */
function enterCharEnglishNumer(mid) {
	$(mid).on('blur',function() {
		var isNum = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制只能输入汉字英文和数字以及-
 */
function enterCharEnglishNumerEx(mid) {
	$(mid).on('blur',function() {
		var isNum = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\\-]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入特殊字符和汉字
 */
function cleanChar(mid){
	$(mid).on('blur',function() {
		var isNum = /[^\w\.\/]/ig;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入特殊字符(除去@)和汉字
 */
function cleanCharAndNum(mid){
	$(mid).on('blur',function() {
		var isNum = /[^\w\.\/@]/ig;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入空格 (键盘输入限制 中文输入只能单个输入)
 */
function cleanSpace(mid){
	$(mid).on('blur',function() {
		var isNum = /\s+/ig;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入空格 （完成输入后限制 避免中文词组输入）
 */
function cleanSpaceEx(mid){
	$(mid).on('blur',function() {
		var isNum = /\s+/ig;
		var value = $.trim($(this).val());
		if(value){
			if(isNum.test(value)){
				$(this).val(value.replace(isNum,''));
			}else{
				$(this).val(value);
			}
		}else{
			$(this).val("");
		}
	});
}




/**
 * 限制只能输入英文和数字
 */
function enterEnglishNumer(mid) {
	$(mid).on('blur',function() {
		var isNum = /[^\a-\z\A-\Z0-9]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
* 限制输入汉字和中文特殊字符
*/
function cleanCharacter(mid){
	$(mid).on('blur',function() {
//		var isNum = /[\u4E00-\u9FA5]/g;
		//是否含有中文（也包含日文和韩文）/[\u4E00-\u9FA5\uF900-\uFA2D]/
		//是否含有全角符号的函数 /[\uFF00-\uFFEF]/
		//中文特殊字符 ~·！@#￥%…&*（）——+{}|：“”《》？【】、；‘’，。、？ /[@#,|?<>"':*\\\/\$%\^&\*]+/g
		//英文特殊字符 ~`!@#$%^&*()_+{}|:"<>?[]\;',./  /[@#,|?<>"':*\\\/\$%\^&\*]+/g
		var isNum = /[\u4E00-\u9FA5\uF900-\uFA2D\uFF00-\uFFEF\·！…（）：“”《》？【】、；‘’，。、？]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

var searchTimer = null;
var companyTree;
var oldCompanyId = null;
/**
 * 加载公司树结构
 * @param companys 公司列表
 * @param mid 顶点id
 * @param type 1区域
 */
function addCompanyTree(companys_, mid, type, titleName, displayName_, errtips_) {
	var displayName, errtips;
	var companys = [];
	if(typeof _getRootFrameElement().myUserRole != 'undefined' && _getRootFrameElement().myUserRole.isChemicals()
			&& type && type == '1'){
		companys.push({id:0,name:'中国',parentId:-1});
		displayName = "选择区域";
		errtips = "区域列表中没有对应的值";
	}else{
		if(displayName_) {
			displayName = displayName_;
		}else {
			displayName = _getRootFrameElement().lang.btnSelectCompany;
		}
		if(errtips_) {
			errtips = errtips_;
		}else {
			errtips = _getRootFrameElement().lang.errCompanyNotExists;
		}
	}
	$('.td-company').flexPanel({
		InputModel : {display: displayName,value:'',name : 'company', pid : 'company', pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});

	if(typeof _getRootFrameElement().myUserRole != 'undefined' && _getRootFrameElement().myUserRole.isSanitationTruck()) {//环卫不显示线路
		for (var i = 0; i < companys_.length; i++) {
			if(companys_[i].level != 3) {
				companys.push(companys_[i]);
			}
		}
	}else {
		companys = companys_;
	}
	
	companyTree = new dhtmlXTreeObject("company_tree", "100%", "100%", 0);
	companyTree.enableCheckBoxes(false);
	companyTree.enableThreeStateCheckboxes(false);
	companyTree.setImagePath("../../../js/dxtree/imgs/");
	companyTree.fillCompany(companys, mid, titleName);
	companyTree.setOnDblClickHandler(companyDblClickEvent);
	$('#company_tree').css('overflow','auto');
	var isOut = true;
	$('.td-company #combox-company').on('input propertychange click',function(e){
		
		$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
		$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
		$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
		if(e.type == 'click') {
			isOut = false;
			$('#company_tree').show();
		}
		if (searchTimer == null) {
			searchTimer = setTimeout(function() {
				var name = $.trim($('.td-company #combox-company').val());
				if (name !== "") {
					companyTree.searchCompany(name);
				}
				searchTimer = null;
			}, 200);
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	
	$('.td-company .bg-icon-company').on('click',function(){
		if($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
			return;
		}
		$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
		$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
		$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
		if($('#company_tree').css('display') == 'none') {
			$('#company_tree').show();
			isOut = false;
			if (searchTimer == null) {
				searchTimer = setTimeout(function() {
					var name = $.trim($('.td-company #combox-company').val());
					if (name !== "") {
						companyTree.searchCompany(name);
					}
					searchTimer = null;
				}, 200);
			}
		}else {
			checkCompanyTreeParam();
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	
	$('.td-company #combox-company').on('keydown',function(e){
		if(e.keyCode == 13) {
			$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
			$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
			$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
			if($('#company_tree').css('display') == 'none') {
				$('#company_tree').show();
				isOut = true;
				if (searchTimer == null) {
					searchTimer = setTimeout(function() {
						var name = $.trim($('.td-company #combox-company').val());
						if (name !== "") {
							var search = companyTree.searchCompany(name);
							$('.td-company .span-tip').text('*');
							if(search == null) {
								$('.td-company #hidden-company').val('');
								$('.td-company .span-tip').text(errtips);
								oldCompanyId = '';
								isOut = true;
							}
						}else {
							$('.td-company #hidden-company').val('');
							$('.td-company .span-tip').text(errtips);
							oldCompanyId = '';
							isOut = true;
						}
						searchTimer = null;
					}, 200);
				}
			}else {
				checkCompanyTreeParam();
			}
		}
	});

	
	$('#company_tree').on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	$('body').on('click',function(){
		if(isOut && $('#company_tree').css('display') != 'none'){
			checkCompanyTreeParam();
		}
	});
	var checkCompanyTreeParam = function(){
		if($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
			return;
		}
		var name = $.trim($('.td-company #combox-company').val());
		var selId = companyTree.getSelectedItemId();
		if(selId != '*_0' && selId != '*_'+sid) {
			var id =selId.split('_')[1];
			var cname = getArrayName(companys,id);
			if(name == '' || name == cname) {
				companyDblClickEvent();
				isOut = true;
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						companyDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}
		}else {
			if(name == null || name == '') {
				if(typeof _getRootFrameElement().myUserRole != 'undefined' && _getRootFrameElement().myUserRole.isChemicals()
						&& type && type == '1'){
					companyDblClickEvent();
					isOut = true;
				}else {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						companyDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}
		}
	}
}


var searchTimer_ = null;
var countryTree;
var oldCountryId = null;
/**
 * 加载行政区域树结构
 * @param countrys_ 行政区域
 * @param mid 顶点id
 * @param titleName 顶点名称
 * @param displayName_ 提示默认值
 * @param errtips_ 错误提示
 */
function addCountryTree(countrys_, mid, titleName, displayName_, errtips_) {
	var displayName, errtips;
	var companys = [];

	if(displayName_) {
		displayName = displayName_;
	}else {
		displayName = "全国";
	}
	if(errtips_) {
		errtips = errtips_;
	}else {
		errtips = "公司列表中没有对应的值";
	}
	
	$('.td-country').flexPanel({
		InputModel : {display: displayName,value:'',name : 'country', pid : 'country', pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});

	companys = countrys_;
	
	countryTree = new dhtmlXTreeObject("country_tree", "100%", "100%", 0);
	countryTree.enableCheckBoxes(false);
	countryTree.enableThreeStateCheckboxes(false);
	countryTree.setImagePath("../../../js/dxtree/imgs/");
	countryTree.fillCompany(companys, mid, titleName);
	countryTree.setOnDblClickHandler(countryDblClickEvent);
	countryTree.closeAllItems(mid);
	$('#country_tree').css('overflow','auto');
	var isOut = true;
	$('.td-country #combox-country').on('input propertychange click',function(e){
		
		$('#country_tree').css('top',getTop($('.td-country .btn-group').get(0)) - 165 -  $('.td-country .btn-group').height() + 'px');
		$('#country_tree').css('left',getLeft($('.td-country .btn-group').get(0)) + 'px');
		$('#country_tree').css('width',$('.td-country .btn-group .item').width()+'px');
		if(e.type == 'click') {
			isOut = false;
			$('#country_tree').show();
		}
		if (searchTimer_ == null) {
			searchTimer_ = setTimeout(function() {
				var name = $.trim($('.td-country #combox-country').val());
				if (name !== "") {
					countryTree.searchCompany(name);
				}
				searchTimer_ = null;
			}, 200);
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	
	$('.td-country .bg-icon-country').on('click',function(){
		if($('#combox-country').get(0) && $('#combox-country').get(0).disabled) {
			return;
		}
		$('#country_tree').css('top',getTop($('.td-country .btn-group').get(0)) - 165 - $('.td-country .btn-group').height() + 'px');
		$('#country_tree').css('left',getLeft($('.td-country .btn-group').get(0)) + 'px');
		$('#country_tree').css('width',$('.td-country .btn-group .item').width()+'px');
		if($('#country_tree').css('display') == 'none') {
			$('#country_tree').show();
			isOut = false;
			if (searchTimer_ == null) {
				searchTimer_ = setTimeout(function() {
					var name = $.trim($('.td-country #combox-country').val());
					if (name !== "") {
						countryTree.searchCompany(name);
					}
					searchTimer_ = null;
				}, 200);
			}
		}else {
			checkCountryTreeParam();
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	
	$('.td-country #combox-country').on('keydown',function(e){
		if(e.keyCode == 13) {
			$('#country_tree').css('top',getTop($('.td-country .btn-group').get(0)) - 165 - $('.td-company .btn-group').height() + 'px');
			$('#country_tree').css('left',getLeft($('.td-country .btn-group').get(0)) + 'px');
			$('#country_tree').css('width',$('.td-country .btn-group .item').width()+'px');
			if($('#country_tree').css('display') == 'none') {
				$('#country_tree').show();
				isOut = true;
				if (searchTimer_ == null) {
					searchTimer_ = setTimeout(function() {
						var name = $.trim($('.td-country #combox-country').val());
						if (name !== "") {
							var search = countryTree.searchCompany(name);
							$('.td-country .span-tip').text('*');
							if(search == null) {
								$('.td-country #hidden-country').val('');
								$('.td-country .span-tip').text(errtips);
								oldCountryId = '';
								isOut = true;
							}
						}else {
							$('.td-country #hidden-country').val('');
							$('.td-country .span-tip').text(errtips);
							oldCountryId = '';
							isOut = true;
						}
						searchTimer_ = null;
					}, 200);
				}
			}else {
				checkCountryTreeParam();
			}
		}
	});

	
	$('#country_tree').on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	$('body').on('click',function(){
		if(isOut && $('#country_tree').css('display') != 'none'){
			checkCountryTreeParam();
		}
	});
	var checkCountryTreeParam = function(){
		if($('#combox-country').get(0) && $('#combox-country').get(0).disabled) {
			return;
		}
		var name = $.trim($('.td-country #combox-country').val());
		var selId = countryTree.getSelectedItemId();
		if(selId != '*_0' && selId != '*_'+sid) {
			var id =selId.split('_')[1];
			var cname = getArrayName(companys,id);
			if(name == '' || name == cname) {
				countryDblClickEvent();
				isOut = true;
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						countryDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-country #hidden-country').val('');
					$('.td-country .span-tip').text(errtips);
					oldCountryId = '';
					$('#country_tree').hide();
					isOut = true;
				}
			}
		}else {
			if(name == null || name == '') {
				$('.td-country #hidden-country').val('');
				$('.td-country .span-tip').text(errtips);
				oldCountryId = '';
				$('#country_tree').hide();
				isOut = true;
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						countryDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-country #hidden-country').val('');
					$('.td-country .span-tip').text(errtips);
					oldCountryId = '';
					$('#country_tree').hide();
					isOut = true;
				}
			}
		}
	}
}





/**
 * 检查数据
 * @returns {Boolean}
 */
function checkParam() {
	var flag = true;
	var i = 0;
	$('#required-area input,#required-area textArea').each(function(){
		if (!$(this).hasClass("nocheckempty")) {
			var name = $(this).attr('data-name');
			if(name){
				if(($(this).val() == null || $(this).val() == '') && name != 'role' 
					&& name != 'devIDNO' && name != 'icCard'
						&& name != 'phone' && name != 'email' && name != 'zsdriver' && name != 'applyFormFile'){
					$('.td-'+name).find('.span-tip').text(_getRootFrameElement().lang.not_be_empty);
					if(i == 0) {
						$('#required-area .panel-body').addClass('show');
						$(this).focus();
					}
					i++;
				}else {
					$('.td-'+name).find('.span-tip').text('*');
				}
			}
		}
	});
	if(i != 0) {
		flag = false;
	}
	return flag;
}

function getParentCompany(companys,parentId) {
	for(var i = 0; i < companys.length; i++) {
		if(companys[i].id == parentId) {
			return companys[i];
		}
	}
}

//获取父公司
function getPartCompanys(companys,parentCompanys,id) {
	for(var i = 0;i < companys.length; i++) {
		if(companys[i].id == id){
			parentCompanys.push(companys[i]);
		}
	}
}

//获取子公司
function getChildCompanys(companys,childCompanys,id,noDepart) {
	for(var i = 0;i < companys.length; i++) {
		if(noDepart){
			if(companys[i].parentId == id && companys[i].level != 12){
				childCompanys.push(companys[i]);
			}
		}else{
			if(companys[i].parentId == id){
				childCompanys.push(companys[i]);
			}
		}
	}
}

/**
 * 添加页面锁屏
 * @param flag
 */
function disableForm(flag){
	if(flag) {
		$('body').append('<div id="lockmask" style="position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; overflow: hidden; -ms-filter:\'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\'; opacity: 0.5;filter:alpha(opacity=50);background: none repeat scroll 0% 0% rgb(220, 226, 241); z-index: 1994;"></div>');
	}else {
		$('#lockmask').remove();
	}
}

/**
 * 设置界面宽度
 */
function loadReportTableWidth(callBackFun) {
	// 生态眼屏蔽车牌列
	if(_getRootFrameElement().myUserRole && _getRootFrameElement().myUserRole.isSTY) {
		var list = ['plateType','startSpeed','endSpeed','startPosition','endPosition','industryType'];
		hideTableColList(list);
	}
	var width = $(window).width();
	var height = $(window).height();
	//不能少于1024
	if(width < 1024) {
		width = 1024;
	}
	
	if(getTop($('.queryGraph-render').get(0)) == 0 || getTop($("#container").get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	if(getTop($('.queryGraph-render').get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	height = height < 0 ? 0 : height;
	$('.flexigrid .bDiv').height(height);

	if (typeof callBackFun == "function") {
		callBackFun();
	}
}

/**
 * 地图界面全屏显示
 */
function fullMapScreen() {
	$('body',_getRootFrameElement().document).find('#main-topPanel').toggleClass('show');
	$('body',_getRootFrameElement().document).resize();
};

/**
 * 添加提示组件
 * @param id
 * @param tltle
 */
function setTooltip(id, tltle) {
	$(id).attr("title", tltle);
	$(id).tooltip();
}

/**
 * 判字符串断是否包含空格(字符前中后)
 * @param str
 * @returns
 */
function isCheckEmpty(str) {
	var reg =/\s/;
	return reg.test(str);
}

/**
 * 是否禁止系统右键  true 禁止
 */
function disableSysRight(id,disable,func) {
	if(disable) {
		if(typeof func != 'undefined' && func != null) {
			$(id).on('contextmenu',func);
		}else {
			$(id).on('contextmenu',function(){return false;});
		}
	}else {
		$(id).unbind('contextmenu');
	}
}

/**
 * 获取服务器ip
 * 与浏览器ip匹配
 */
function getComServerIp(lstSvrIp) {
	if(lstSvrIp != null && lstSvrIp.length > 0) {
		var host = window.location.host.split(':');
		if (host.length >= 1) {
			var addr = host[0];
			if(addr == 'localhost') {
				return "127.0.0.1";
			}
			for (var i = 0; i < lstSvrIp.length; ++ i) {
				if (addr == lstSvrIp[i]) {
					return lstSvrIp[i];
				}
			}
		}
		return lstSvrIp[0];
	}
	return "127.0.0.1";
}

//显示错误信息
function showDialogErrorMessage(result, cmsserver, resultTip) {
	if(cmsserver != null && cmsserver == 1) {
		var timeout = 0.5;
		switch(result) {
		case 1:		//系统出现异常	$.dialog.tips 默认关闭时间为1.5秒
			$.dialog.tips(_getRootFrameElement().lang.errException,timeout);
			break;
		case 2:		//用户无权限
			$.dialog.tips(_getRootFrameElement().lang.errNoPrivilige,timeout);
			break;
		case 3:		//参数错误
			$.dialog.tips(_getRootFrameElement().lang.errRequireParam,timeout);
			break;
		case 4:		//操作数据库出错
			$.dialog.tips(_getRootFrameElement().lang.errDbConnErr,timeout);
			break;
		case 5:		//信息不存在
			$.dialog.tips(_getRootFrameElement().lang.errNoExist,timeout);
			break;
		case 6:		//未知错误
			$.dialog.tips(_getRootFrameElement().lang.errUnkown,timeout);
			break;
		case 7:		//名称已经被使用
			$.dialog.tips(_getRootFrameElement().lang.errNameExist,timeout);
			break;
		case 21:		//设备信息不存在
			$.dialog.tips(_getRootFrameElement().lang.errDeviceNoExist,timeout);
			break;
		case 22:		//没有收到设备的回馈信息
			$.dialog.tips(_getRootFrameElement().lang.errorDeviceNoResponse,timeout);
			break;
		case 23:	//设备不在线
			$.dialog.tips(_getRootFrameElement().lang.video_not_online,timeout);
			break;
		case 24:	//正在为其它客户端执行对讲操作
			return "";
		case 25:	//设备媒体转发关联信息不存在
			return "";
		case 26:	//设备连接中断
			$.dialog.tips(_getRootFrameElement().lang.errorDeviceDisconnect,timeout);
			break;
		case 27:	//未定义存储路径
			return "";
		case 45:	//设备不支持此功能
			$.dialog.tips(_getRootFrameElement().lang.device_nosupport,timeout);
			break;
		case 61:	//文件格式错误
			$.dialog.tips(_getRootFrameElement().lang.errSImageType,timeout);
			break;
		case 62:	//服务器上不存在此文件
			$.dialog.tips(_getRootFrameElement().lang.errorFileNotExists,timeout);
			break;
		case 63:	//文件已全部下载完成
			$.dialog.tips(_getRootFrameElement().lang.errorFileDownloadAll,timeout);
			break;
		case 64:	//文件正在下载
			$.dialog.tips(_getRootFrameElement().lang.errorFileDownloading,timeout);
			break;
		case 65:	//没有搜索到录像文件
			$.dialog.tips(_getRootFrameElement().lang.errorVideoFileNotSearch,timeout);
			break;
		case 66:	//文件正在被使用
			$.dialog.tips(_getRootFrameElement().lang.errorFileisUse,timeout);
			break;
		case 101:	//服务器连接失败
			$.dialog.tips(_getRootFrameElement().lang.errorServerConnectFail,timeout);
			break;
		case 81:	//用户不存在
			$.dialog.tips(_getRootFrameElement().lang.errLogin_UserNoExist,timeout);
			break;
		case 82:	//用户密码错误
			$.dialog.tips(_getRootFrameElement().lang.errLogin_PasswordError,timeout);
			break;
		case 83:	//用户名错误
			$.dialog.tips(_getRootFrameElement().lang.errLogin_UserError,timeout);
			break;
		case 85:	//excel内存在无效数据
			$.dialog.tips(_getRootFrameElement().lang.errLogin_UserError,timeout);
			break;
		case 102:	//服务器空间不足
			$.dialog.tips(_getRootFrameElement().lang.errorServerSpaceNotEnough,timeout);
			break;
		case 106:	//服务器信息不存在，无法为客户提供服务
			$.dialog.tips(_getRootFrameElement().lang.errServerNoExist,timeout);
			break;
		case 109:	//服务器不在线
			$.dialog.tips(_getRootFrameElement().lang.errorServerOffline,timeout);
			break;
		case 110:	//服务器连接中断
			$.dialog.tips(_getRootFrameElement().lang.errorServerDisconnect,timeout);
			break;
		case 57:	//RET_USER_RESPONSE_ERR = 57; //用户请求异常
			$.dialog.tips(_getRootFrameElement().lang.usersRequestFails,timeout);
			break;
		case 58:	//RET_DOWNLOADTASK_EXIST = 58; //下载任务已存在
			$.dialog.tips(_getRootFrameElement().lang.errDownloadTaskExists,timeout);
			break;
		case 59:	//RET_DEVICE_OFFLINE = 59;  //设备不在线
			$.dialog.tips(_getRootFrameElement().lang.video_not_online,timeout);
			break;
		default:	//未知错误
			return '';
		}
	}else {
		if((typeof showErrorMessage) == 'function') {
			showErrorMessage(result, resultTip);
		}
		if(result == 2) {
			top.window.location = "login.html";
		}
	}	
}

//百度谷歌经纬度互换
function convertBaiduGoogle(lat, lng, toMap) {
	var x_pi = (3.14159265358979324*3000.0)/180.0;
	lat = parseFloat(lat);
	lng = parseFloat(lng);
	var gps = {};
	if(toMap == 1 || toMap == 3) {////百度经纬度转为谷歌经纬度
		lng = lng - 0.0065, lat = lat - 0.006; 
		var z = Math.sqrt(lng * lng + lat * lat) - 0.00002 * Math.sin(lat * x_pi); 
		var theta = Math.atan2(lat, lng) - 0.000003 * Math.cos(lng * x_pi);
		gps.lng = z * Math.cos(theta);
		gps.lat = z * Math.sin(theta);
	}else {//谷歌经纬度转为百度经纬度
		var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);  
	    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
	    gps.lng = z * Math.cos(theta) + 0.0065;
	    gps.lat = z * Math.sin(theta) + 0.006;
	}
	gps.lng = gps.lng.toFixed(6);
	gps.lat = gps.lat.toFixed(6);
    return gps;
}



function transformLat(dblng, dblat, pi){
    var ret = -100.0 + 2.0 * dblng + 3.0 * dblat + 0.2 * dblat * dblat + 0.1 * dblng * dblat + 0.2 * Math.sqrt(Math.abs(dblng));
    ret += (20.0 * Math.sin(6.0 * dblng * pi) + 20.0 * Math.sin(2.0 * dblng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(dblat * pi) + 40.0 * Math.sin(dblat / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(dblat / 12.0 * pi) + 320 * Math.sin(dblat * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transformLon(dblng, dblat, pi){
	var ret = 300.0 + dblng + 2.0 * dblat + 0.1 * dblng * dblng + 0.1 * dblng * dblat + 0.1 * Math.sqrt(Math.abs(dblng));
    ret += (20.0 * Math.sin(6.0 * dblng * pi) + 20.0 * Math.sin(2.0 * dblng * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(dblng * pi) + 40.0 * Math.sin(dblng / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(dblng / 12.0 * pi) + 300.0 * Math.sin(dblng / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}




/**
 * @description 射线法判断点是否在多边形内部
 * @param {Object} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
 * @param {Array} poly 多边形顶点，数组成员的格式同 p
 * @return {String} 点 p 和多边形 poly 的几何关系
 */
function rayCasting(p, poly) {
  var px = p.x,
      py = p.y,
      flag = false

  for(var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    var sx = poly[i].x,
        sy = poly[i].y,
        tx = poly[j].x,
        ty = poly[j].y
    // 点与多边形顶点重合
    if((sx === px && sy === py) || (tx === px && ty === py)) {
      return 'on'
    }

    // 判断线段两端点是否在射线两侧
    if((sy < py && ty >= py) || (sy >= py && ty < py)) {
      // 线段上与射线 Y 坐标相同的点的 X 坐标
      var x = sx + (py - sy) * (tx - sx) / (ty - sy)

      // 点在多边形的边上
      if(x === px) {
        return 'on'
      }

      // 射线穿过多边形的边界
      if(x > px) {
        flag = !flag
      }
    }
  }
  // 射线穿过多边形边界的次数为奇数时点在多边形内
  return flag ? 'in' : 'out'
}


var  regions = [];
//把中国划分为五个图形区域
regions.push(new RectangleInsets(54.141500, 109.687200, 39.374200, 135.000200));
regions.push(new RectangleInsets(49.220400, 79.446200, 42.889900, 96.330000));
regions.push(new RectangleInsets(42.889900, 73.124600, 29.529700, 124.143255));
regions.push(new RectangleInsets(29.529700, 82.968400, 26.718600, 97.035200));
regions.push(new RectangleInsets(29.529700, 97.025300, 20.414096, 124.367395));
regions.push(new RectangleInsets(20.414096, 107.975793, 17.871542, 111.744104));
var  regionNos = [];
//这几个区域不在上面五个区域中
regionNos.push(new RectangleInsets(25.398623, 119.921265, 21.785006, 122.497559));
regionNos.push(new RectangleInsets(22.284000, 101.865200, 20.098800, 106.665000));
regionNos.push(new RectangleInsets(21.542200, 106.452500, 20.487800, 108.051000));
regionNos.push(new RectangleInsets(55.817500, 109.032300, 50.325700, 119.127000));
regionNos.push(new RectangleInsets(55.817500, 127.456800, 49.557400, 137.022700));
regionNos.push(new RectangleInsets(44.892200, 131.266200, 42.569200, 137.022700));
regionNos.push(new RectangleInsets(35.067203, 73.124600, 29.529700, 77.611654));
	
function RectangleInsets(top, left, bottom, right){
	this.top = top;
	this.left = left;
	this.bottom = bottom;
	this.right = right;
}

function InRectangle(rect, jingDu, weiDu){
	  return rect.right >= jingDu && rect.left <= jingDu && rect.top >= weiDu && rect.bottom <= weiDu;
}

/**
 * 粗略中国外的
 */
function IsInsideChina(lat,  lng) {
    for (var i = 0; i < regions.length; i++) {
        if (InRectangle(regions[i], lng, lat)) {
            for (var j = 0; j < regionNos.length; j++) {
                if (InRectangle(regionNos[j] , lng, lat)) {
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}


//gps坐标转换为火星坐标（gcj02）谷歌、高德、四维使用此坐标 
function fixCoordinate(lat, lng){
	var a = 6378245.0;
    var ee = 0.00669342162296594323;
    var pi = 3.14159265358979324;
	var gps = {};
	gps.lat = parseFloat(lat);
	gps.lng = parseFloat(lng);
    //设备不进行转换
    if (IsInsideChina(lat, lng)) {//转换数据不对
    	var dWeidu = transformLat(lng - 105.0, lat - 35.0, pi);
    	var dJingDu = transformLon(lng - 105.0, lat - 35.0, pi);
    	var radJingDu = lat / 180.0 * pi;
    	var magic = Math.sin(radJingDu);
    	magic = 1 - ee * magic * magic;
    	var sqrtMagic = Math.sqrt(magic);
    	dWeidu = (dWeidu * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    	dJingDu = (dJingDu * 180.0) / (a / sqrtMagic * Math.cos(radJingDu) * pi);
    	gps.lat = gps.lat + dWeidu;
    	gps.lng = gps.lng + dJingDu;
    	gps.lng = gps.lng.toFixed(6);
    	gps.lat = gps.lat.toFixed(6);
    }else{
     	// console.log("粗略内地纠偏: "+gps.lat + ","+ gps.lng);
    }
	return gps;
}

//gps坐标转换为百度坐标
function fixConvert(lat, lng)  {
	var x_pi = (3.14159265358979324*3000.0)/180.0;
	var gps = fixCoordinate(lat, lng);
	  //设备不进行转换
    if (IsInsideChina(lat, lng)) {//转换数据不对
	    var x = gps.lng, y = gps.lat;
	    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);  
	    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);  
	    gps.lng = z * Math.cos(theta) + 0.0065;  
	    gps.lat = z * Math.sin(theta) + 0.006;
	    gps.lng = gps.lng.toFixed(6);
		gps.lat = gps.lat.toFixed(6);
    }else{
    	// console.log("粗略内地纠偏: "+gps.lat + ","+ gps.lng);
    }
    return gps; 
}

//gps坐标转换
//mapType 地图类型 0谷歌 3百度
//geocoderMapType 0默认 1谷歌 2百度 3高德 4四维
//defaultGeocoderMapType 0默认 1谷歌 2百度 3高德 4四维
function geocoderLngLat(lat, lng, mapType, geocoderMapType, defaultGeocoderMapType) {
	if(geocoderMapType && geocoderMapType != 0) {
		if(geocoderMapType == 2) {
			return fixConvert(lat, lng);
		}else {
			return fixCoordinate(lat, lng);
		}
	}else {//默认解析
		if(defaultGeocoderMapType && defaultGeocoderMapType != 0) {
			if(defaultGeocoderMapType == 2) {
				return fixConvert(lat, lng);
			}else {
				return fixCoordinate(lat, lng);
			}
		}else {
			if(mapType && mapType == 3) {
				return fixConvert(lat, lng);
			}else {
				return fixCoordinate(lat, lng);
			}
		}
	}
}

/* 
 * 判断图片类型
 *  
 * @param fileObj  type="file"的javascript对象 
 * @return true-符合要求,false-不符合 
 */ 
function checkImgType(fileObj){
    if (fileObj.value) {
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(fileObj.value)) {  
            return false;
        }
    }  
    return true;  
}

/* 
 * 判断图片大小
 *  
 * @param fileObj type="file"的javascript对象
 * @param size 图片大小
 * @return true-符合要求,false-不符合 
 */ 
function checkImgSize(fileObj, size){  
    if (fileObj.value) {  
        if (fileObj.files && fileObj.files[0]) {
        	//获取文件大小
            var fileSize = fileObj.files[0].size || fileObj.files[0].fileSize;
            if(fileSize > parseInt(size, 10)*1024*1024){
            	return false;
            }
    	} else{ // 兼容IE
//        	var img = new Image(); //动态创建img
//    		img.src = fileObj.value;
//    		img.style.display = "none";
//    		img.onload = function(){
//    			img.fileSize= this.fileSize;
//    			alert(img.fileSize);//ie获取文件大小
//    		}
//    		if(img.readyState=="complete"){//已经load完毕，直接打印文件大小
//    			alert(img.filesize);//ie获取文件大小
//    		}else{
//    			img.onreadystatechange=function(){
//    				if(img.readyState=='complete'){//当图片load完毕
//    					alert(img.fileSize);//ie获取文件大小
//    				}
//    			}
//    		}
    	}
    }  
    return true;
}

//追加CSS文件到head标签内
function loadHeadCss(url, callback, document_, doc_) {
	var link = document.createElement("link");
	link.setAttribute("type", "text/css");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("href", url);
	var heads = null;
	if(document_) {
		heads = document_.getElementsByTagName("head");
	}else {
		heads = document.getElementsByTagName("head");
	}
	if(heads.length)  
        heads[0].appendChild(link);
    else {
    	if(doc_) {
    		doc_.documentElement.appendChild(link);
    	}else {
    		doc.documentElement.appendChild(link);
    	}
    }
	//判断服务器 
	if(typeof link.onreadystatechange != 'undefined') {
		link.onreadystatechange = function () { 
			//IE下的判断，判断是否加载完成 
			if (link && (link.readyState == "loaded" || link.readyState == "complete")) { 
				link.onreadystatechange = null; 
				if (callback != null) {
					callback(); 
				}
			} 
		}; 
	}else if(typeof link.onload != 'undefined') {
		link.onload = function () { 
			link.onload = null;
			if (callback != null) {
				callback(); 
			}
		};
	}else {
		if (callback != null) {
			callback(); 
		}
	}
}

//获取设备类型新增设备
function getTerminalTypes() {
	var pageType = getUrlParameter('pageType'); //2位警员管理
	var terminalTypes = [];
	if(pageType && pageType == 2) {//警员管理
		terminalTypes.push({id:9,name: _getRootFrameElement().lang.police_devType});
	}else {
		terminalTypes.push({id:5,name: _getRootFrameElement().lang.positioning_terminal});
		terminalTypes.push({id:7,name: _getRootFrameElement().lang.video_terminal});
//		terminalTypes.push({id:9,name: _getRootFrameElement().lang.peopleDev});
	}
	if(_getRootFrameElement().myUserRole && _getRootFrameElement().myUserRole.isSanitationTruck()) {//环卫车
		terminalTypes.push({id:8,name: '手持终端'});
	}
	return terminalTypes;
}

//获取设备类型   设备管理填充
function getTerminalAllTypes(pageType){
	if(pageType == '' || pageType == null){
        pageType = getUrlParameter('pageType'); //2为警员管理
	}
	var terminalTypes = [];
	if(pageType && pageType == 2) {//警员管理
		terminalTypes.push({id:9,name: _getRootFrameElement().lang.police_devType});
	}else {
		terminalTypes.push({id:5,name: _getRootFrameElement().lang.positioning_terminal});
		terminalTypes.push({id:7,name: _getRootFrameElement().lang.video_terminal});
		terminalTypes.push({id:9,name: _getRootFrameElement().lang.peopleDev});
	}
	if(_getRootFrameElement().myUserRole && _getRootFrameElement().myUserRole.isSanitationTruck()) {//环卫车
		terminalTypes.push({id:8,name: '手持终端'});
	}
	terminalTypes.push({id:10,name: _getRootFrameElement().lang.dispatch_account});
	return terminalTypes;
	
}



//密码强度校验    当isCheck 传1表示进行数据校验，
function doCheckPsw(input,tip,isCheck){
	//规则： 不能为单一数字，单一字母，单一符号 。必须包含两种以上
	if(isCheck == 1){
		var	reg = /^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,12}$/;
		var data = $(input).val();
		if (!reg.test(data)){
			tip.text(_getRootFrameElement().lang.passwordcheck);
			return false;
		}else {
			tip.text("*");
			return true;
		}
	}
}

//kg转为吨
function getGoodsBigAmount(amount) {
	if(amount != null && amount != '') {
		return parseInt(amount, 10) / 1000;
	}
	return 0;
}

//吨转为kg
function getGoodsSmallAmount(amount) {
	if(amount != null && amount != '') {
		return parseInt(parseFloat(amount) * 1000, 10);
	}
	return 0;
}

//创建一个名字为name的计时器，调用console.timeEnd(name)停止计时器并输出所耗时间（毫秒）
//function loadConsoleTime(flag, name) {
//	if(flag) {
//		console.time(name);
//	}else {
//		console.timeEnd(name);
//	}
//}

 window._console = window.console;//将原始console对象缓存
 window.console = (function (orgConsole) {
    return {//构造的新console对象
        log: getConsoleFn("log"),
        debug: getConsoleFn("debug"),
        info: getConsoleFn("info"),
        warn: getConsoleFn("warn"),
        exception: getConsoleFn("exception"),
        assert: getConsoleFn("assert"),
        dir: getConsoleFn("dir"),
        dirxml: getConsoleFn("dirxml"),
        trace: getConsoleFn("trace"),
        group: getConsoleFn("group"),
        groupCollapsed: getConsoleFn("groupCollapsed"),
        groupEnd: getConsoleFn("groupEnd"),
        profile: getConsoleFn("profile"),
        profileEnd: getConsoleFn("profileEnd"),
        count: getConsoleFn("count"),
        clear: getConsoleFn("clear"),
        time: getConsoleFn("time"),
       timeEnd: getConsoleFn("timeEnd"),
        timeStamp: getConsoleFn("timeStamp"),
        table: getConsoleFn("table"),
        error: getConsoleFn("error"),
        memory: getConsoleFn("memory"),
        markTimeline: getConsoleFn("markTimeline"),
        timeline: getConsoleFn("timeline"),
        timelineEnd: getConsoleFn("timelineEnd")
    };
    function getConsoleFn(name) {
        return function actionConsole() {
            if (typeof (orgConsole) !== "object") return "";
            if (typeof (orgConsole[name]) !== "function") return "";//判断原始console对象中是否含有此方法，若没有则直接返回
            return orgConsole[name].apply(orgConsole, Array.prototype.slice.call(arguments));//调用原始函数
        };
    }
 }(window._console));

//IE8 不兼容 问题   查找数组是否包含元素  返回索引
if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(elt){
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0)? Math.ceil(from) : Math.floor(from);
		if (from < 0)
			from += len;
		
		for (; from < len; from++){
			if (from in this && this[from] === elt)
				return from;
		}
		return -1;
	};
}


//ie兼容  es6的String includes
String.prototype.includes = includes;
function includes(context){
	if(this.indexOf(context) != -1){
		return true;
	}else{
		return false;
	}
}
	
//toFixed兼容方法  重写 实现四舍五入
Number.prototype.toFixed = function (n) {
    if (n > 20 || n < 0) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }
    var number = this;
    if (isNaN(number) || number >= Math.pow(10, 21)) {
        return number.toString();
    }
    if (typeof (n) == 'undefined' || n == 0) {
        return (Math.round(number)).toString();
    }

    var result = number.toString();
    var arr = result.split('.');

    // 整数的情况
    if (arr.length < 2) {
        result += '.';
        for (var i = 0; i < n; i += 1) {
            result += '0';
        }
        return result;
    }

    var integer = arr[0];
    var decimal = arr[1];
    if (decimal.length == n) {
        return result;
    }
    if (decimal.length < n) {
        for (var i = 0; i < n - decimal.length; i += 1) {
            result += '0';
        }
        return result;
    }
    result = integer + '.' + decimal.substr(0, n);
    var last = decimal.substr(n, 1);
    // 四舍五入，转换为整数再处理，避免浮点数精度的损失
    if (parseInt(last, 10) >= 5) {
        var x = Math.pow(10, n);
        result = (Math.round((parseFloat(result) * x)) + 1) / x;
        result = result.toFixed(n);
    }
    return result;
};



/**
 * tableObject 报表对象
 * lng1 定义的经度字段，需要和报表中的name相对应，没有则填null
 * lat1 定义的纬度字段，需要和报表中的name相对应，没有则填null
 * position1 定义的地理位置字段，需要和报表中的name相对应，没有则填null
 * lng2 定义的经度字段，需要和报表中的name相对应，没有则填null
 * lat2 定义的纬度字段，需要和报表中的name相对应，没有则填null
 * position2 定义的地理位置字段，需要和报表中的name相对应，没有则填null
 * toMap 地图类型
 */
var analysisLocationObject = (function(tableObject, lng1, lat1, position1, lng2, lat2, position2, toMap) {
	// 取地图tomap
	toMap = _getRootFrameElement().toMap;

	//是否解析位置
	if(_getRootFrameElement().myUserRole && !_getRootFrameElement().myUserRole.getGeoAddress()){
		return;
	}
	//lng 经度  lat 纬度  position地理位置
	function getValidLnglat_(lng, lat, position) {
		if(position != null && lng != null && lat != null) {
			var latlng = gpsGetPositionEx(lng, lat, 1);
			if(latlng != '0,0' && latlng == position) {
				return latlng;
			}
		}
		return "";
	}
	
	//解析地理位置
	function analysisLocation() {
		var data = $(tableObject).flexGetData(); //获取查询的数据
		if(data && data.rows && data.rows.length > 0) {
			var infoList = data.rows;
			//取待解析的经纬度信息
			var latlngs = [];
			for (var i = 0; i < infoList.length; i++) {
				var info = infoList[i];
				// var latlng1 = getValidLnglat_(info[lng1], info[lat1], info[position1]);
				var latlng1 = info[position1]; // 用不纠偏的值
				if(typeof latlng1 != 'undefined' && latlng1 != '' && latlng1 != null && latlng1.length <= 23 && latlng1.split(",").length == 2 && !latlngs.in_array(latlng1)) {
					latlngs.push(latlng1);
				}
				// var latlng2 = getValidLnglat_(info[lng2], info[lat2], info[position2]);
				var latlng2 = info[position2];
				if(typeof latlng2 != 'undefined' && latlng2 != '' && latlng2 != null && latlng2.length <= 23 && latlng2.split(",").length == 2 && !latlngs.in_array(latlng2)) {
					latlngs.push(latlng2);
				}
			}
			if(latlngs.length > 0) {
				//到后台进行解析
				$.myajax.jsonGet('StandardReportAlarmAction_analysisLocation.action?latlng='+ latlngs.join(';') +'&toMap='+ toMap, function(json,action,success){
					if(success) {
						updateTableLocation(json.mapLocation);
					};
				}, null);
			}
		}
	}
	
	//将解析的地理位置更新到报表
	function updateTableLocation(mapLocation) {
		if(mapLocation) {
			//循环界面div
			$('tr', tableObject).each(function() {
				if(position1 != null) {
					var latlng = $.trim($('.'+ position1 +' a', this).html());
					if(latlng != '' && mapLocation[latlng] != null) {
						$('.'+ position1 +' a', this).html(mapLocation[latlng]);
					}
				}
				if(position2 != null) {
					var latlng = $.trim($('.'+ position2 +' a', this).html());
					if(latlng != '' && mapLocation[latlng] != null) {
						$('.'+ position2 +' a', this).html(mapLocation[latlng])
					}
				}
			});
		}
	}
	
	//执行解析
	new analysisLocation();
});


//车牌类型
function getPlateTypes() {
	var plateTypes = [];
	plateTypes.push({id:1,name: _getRootFrameElement().lang.blue_label});
	plateTypes.push({id:2,name: _getRootFrameElement().lang.yellow_label});
	plateTypes.push({id:3,name: _getRootFrameElement().lang.black_label});
	plateTypes.push({id:4,name: _getRootFrameElement().lang.white_label});
	plateTypes.push({id:5,name: _getRootFrameElement().lang.green});
	plateTypes.push({id:93,name: _getRootFrameElement().lang.yellowGreen});
	plateTypes.push({id:91,name: _getRootFrameElement().lang.agriculturalYellow});
	plateTypes.push({id:92,name: _getRootFrameElement().lang.agroGreen});
	plateTypes.push({id:94,name: _getRootFrameElement().lang.gradualGreen});
	plateTypes.push({id:0,name: _getRootFrameElement().lang.nonePlate});
	plateTypes.push({id:9,name: _getRootFrameElement().lang.other});
	return plateTypes;
}

//是否在线
function getChooseOnline() {
	var onlines = [];
	onlines.push({id:-1,name: '请选择'});
	onlines.push({id:0,name: '不在线'});
	onlines.push({id:1,name: '在线'});
	return onlines;
}

//获取用户类型
function getAccountType() {
	var accountType = [];
	accountType.push({id:0, name: _getRootFrameElement().lang.general_account});
	accountType.push({id:1, name: _getRootFrameElement().lang.dispatch_account});
	return accountType;
}


//获取车牌颜色
function getPlate(plateTypes){
	var platesArry = [1,2,3,4,5,6,8,9, 93, 91, 92, 94,0,9 ];
	var plateColer = '';
	if(platesArry.in_array(plateTypes)){
		if(plateTypes == 6){
			plateTypes =	93;
		}else if(plateTypes == 8){
			plateTypes = 91;
		}
		switch (plateTypes) {
		case 1:
			plateColer = _getRootFrameElement().lang.blue_label;
			break;
		case 2:
			plateColer = _getRootFrameElement().lang.yellow_label;
			break;
		case 3:
			plateColer = _getRootFrameElement().lang.black_label;
			break;
		case 4:
			plateColer = _getRootFrameElement().lang.white_label;
			break;
		case 5:
			plateColer = _getRootFrameElement().lang.green;
			break;
		case 93://以前是6
			plateColer = _getRootFrameElement().lang.yellowGreen;
			break;
		case 91://以前是8
			plateColer = _getRootFrameElement().lang.agriculturalYellow;
			break;
		case 92://农绿色
			plateColer = _getRootFrameElement().lang.agroGreen;
			break;
		case 94://渐变绿
			plateColer = _getRootFrameElement().lang.gradualGreen;
			break;
		case 0:
			plateColer = _getRootFrameElement().lang.nonePlate;
			break;
		case 9:
			plateColer = _getRootFrameElement().lang.other;
			break;
		default:
			break;
		}
	}else{
		plateColer = _getRootFrameElement().lang.other;
	}
	return plateColer;
}


//获取车牌颜色
function getPlateEx(plateTypes){
	var platesArry = [1,2,3,4,5,6,8,9, 93, 91, 92, 94,0,9 ];
	var plateColer = '';
	if(platesArry.in_array(plateTypes)){
		if(plateTypes == 6){
			plateTypes =	93;
		}else if(plateTypes == 8){
			plateTypes = 91;
		}
		switch (plateTypes) {
		case 1:
			plateColer = _getRootFrameElement().lang.blue_label;
			break;
		case 2:
			plateColer = _getRootFrameElement().lang.yellow_label;
			break;
		case 3:
			plateColer = _getRootFrameElement().lang.black_label;
			break;
		case 4:
			plateColer = _getRootFrameElement().lang.white_label;
			break;
		case 5:
			plateColer = _getRootFrameElement().lang.green;
			break;
		case 93://以前是6
			plateColer = _getRootFrameElement().lang.yellowGreen;
			break;
		case 91://以前是8
			plateColer = _getRootFrameElement().lang.agriculturalYellow;
			break;
		case 92://农绿色
			plateColer = _getRootFrameElement().lang.agroGreen;
			break;
		case 94://渐变绿
			plateColer = _getRootFrameElement().lang.gradualGreen;
			break;
		case 0:
			plateColer = _getRootFrameElement().lang.nonePlate;
			break;
		case 9:
			plateColer = _getRootFrameElement().lang.other;
			break;
		default:
			break;
		}
	}else{
		plateColer = _getRootFrameElement().lang.other;
	}
	return plateColer;
}


//获取车辆类型
function getVehicleType(vehicleType){
	var vehicleArry = [0,1,2,3,4,5];
	var vehicle = '';
	if(vehicleArry.in_array(vehicleType)){
		switch (parseInt(vehicleType)) {
		case 0:
			vehicle = _getRootFrameElement().lang.vehicle_none;
			break;
		case 1:
			vehicle = _getRootFrameElement().lang.vehicle_Dangerous_goods_transporter;
			break;
		case 2:
			vehicle = _getRootFrameElement().lang.vehicle_Ordinary_passenger_transport;
			break;
		case 3:
			vehicle = _getRootFrameElement().lang.vehicle_Rural_passenger_vehicle;
			break;
		case 4:
			vehicle = _getRootFrameElement().lang.vehicle_Taxi;
			break;
		case 5:
			vehicle = _getRootFrameElement().lang.vehicle_Goods;
			break;
		default:
			break;
		}
	}else{
		vehicle = _getRootFrameElement().lang.vehicle_none;
	}
	return vehicle;
}


//获取公司所属行业
function getIndustryType(type){
	var industryTypes = [];
	industryTypes.push({id:1,name:_getRootFrameElement().lang.logistics_transportation});
	industryTypes.push({id:2,name:_getRootFrameElement().lang.vehicle_rental});
	industryTypes.push({id:3,name:_getRootFrameElement().lang.bus_passenger});
	industryTypes.push({id:4,name:_getRootFrameElement().lang.taxi});
	industryTypes.push({id:5,name:_getRootFrameElement().lang.concrete_car});
	industryTypes.push({id:6,name:_getRootFrameElement().lang.special_vehicles});
	industryTypes.push({id:9,name:_getRootFrameElement().lang.coal_transportation});
	industryTypes.push({id:8,name:_getRootFrameElement().lang.automobile_4S_shop});
	industryTypes.push({id:7,name:_getRootFrameElement().lang.engineering_machinery});
	industryTypes.push({id:0,name:_getRootFrameElement().lang.other_areas});
	return getArrayName(industryTypes,parseInt(type));
}


//获取可以选择的终端类型 
function getSelectVehType() {
	var selectVehType = [];
	selectVehType.push({id:0, name: _getRootFrameElement().lang.dev_organize});
	selectVehType.push({id:1, name: _getRootFrameElement().lang.dev_cooperate});
	return selectVehType;
}


//获取查岗明细 发送消息类型
function getSendObjectType(type){
	var sendObjectTypes = [];
	sendObjectTypes.push({id:1,name:'当前连接的下级平台'});
	sendObjectTypes.push({id:2,name:'下级平台所属单一业户'});
	sendObjectTypes.push({id:3,name:'下级平台所属所有业户'});
	return getArrayName(sendObjectTypes,parseInt(type));
}

//获取平台运政不匹配原因
function getMismatch(type){
	var mismatchTypes = [];
	mismatchTypes.push({id:0,name:'车牌不匹配'});
	mismatchTypes.push({id:1,name:'颜色不匹配'});
	return getArrayName(mismatchTypes,parseInt(type));
}


//速度单位换算  默认传入是 公里    >> 英里  海里
//	1公里 = 0.5399568海里
//	1公里 = 0.6213712 英里
function valueConversion(value){//value 可能是 x.xx公里/时     x.xx公里    x.xxx  转化为保留2为小数
	if(value){
		var val = parseFloat(value);//NaN
		if(!isNaN(val)){//判断是否为数字
			//速度单位 0 公里  1英里  2海里
			if(velocityType == 1){
				return (val*0.6213712).toFixed(2);
			}else if(velocityType == 2){
				return (val*0.5399568).toFixed(2);
			}else{
				return val.toFixed(2);
			}
		}else{
			return "0";
		}
	}else{
		return "0";
	}
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

//获取Cookie的值数据
function getCookieVal (offset){
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1)
	endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
} 

var velocityType = GetCookie('velocityType');
//速度单位换算  默认传入是 公里    >> 英里  海里
function speedConversion(value){//value 可能是 x.xx公里/时     也可能是x.xxx
	var speed = valueConversion(value);
	//速度单位 0 公里  1英里  2海里
	if(velocityType == 1){
		return speed+_getRootFrameElement().lang.MilePerHour;
	}else if(velocityType == 2){
		return speed+_getRootFrameElement().lang.NauticalPerHour;
	}else{
		return speed+_getRootFrameElement().lang.KmPerHour;
	}
}

//里程单位换算  默认传入是 公里    公里    >> 英里  海里
function mileageConversion(value){//value 可能是 x.xx公里     也可能是x.xxx
//	var type =	GetCookie('velocityType');
	var mileage = valueConversion(value);
	//速度单位 0 公里  1英里  2海里
	if(velocityType == 1){
		return mileage+_getRootFrameElement().lang.mile;
	}else if(velocityType == 2){
		return mileage+_getRootFrameElement().lang.nautical_mile;
	}else{
		return mileage+_getRootFrameElement().lang.km;
	}
}


//图片显示
function previewImageNew(file, img) {
	//先怕判断文件类型
	if(!checkImgType(file)) {
		$(file).val("");
		$.dialog.tips(_getRootFrameElement().lang.rule_image_format_error, 1);
        return;
	}
	//限制上传1M的图片
	if(!checkImgSize(file, 1)) {
		$(file).val("");
		$.dialog.tips(_getRootFrameElement().lang.rule_image_size_error, 1);
		return;
	}
	if (file.files && file.files[0] ) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			img.src=evt.target.result;
		}
		reader.readAsDataURL(file.files[0]);
		$('#picture').show();
	} else if(file.value){ // 兼容IE
//		img.src = "";
		file.select();
		file.blur();
//		var src = document.selection.createRange().text;
//		$(img).attr('src', file.value);
		img.src = file.value;
//		$('#picture').show();
	}
}

//报表一个页面多种表格样式 对应隐藏问题
//隐藏th后, 查询错位问题
function  hideTableTr(tableElement){
	var hideList = [];
	$(tableElement).parent().parent().find('.hDivBox').find('th').each(function(){
			var isHide = $(this).attr('hidden');
		    if(isHide){
		    	hideList.push($(this).prop('className'));
		    }
	});
	if(hideList && hideList.length > 0){
		for(var i = 0, j = hideList.length; i < j; i++){
			$(tableElement).find("."+hideList[i]).hide();
			$(tableElement).find("."+hideList[i]).attr('hidden', 'hidden');
		}
	}
}

//将http替换为https
function replaceHttps(url){
	if(!/^https/.test(url)){
		url = url.replace('http:','https:');
	}
	return url;
} 

//车辆类型
function getVehicleTypes() {
	var vehiTypes = [];
	vehiTypes.push({id:0,name: _getRootFrameElement().lang.vehicle_none});
	vehiTypes.push({id:1,name: _getRootFrameElement().lang.vehicle_Dangerous_goods_transporter});
	vehiTypes.push({id:2,name: _getRootFrameElement().lang.vehicle_Ordinary_passenger_transport});
	vehiTypes.push({id:3,name: _getRootFrameElement().lang.vehicle_Rural_passenger_vehicle});
	vehiTypes.push({id:4,name: _getRootFrameElement().lang.vehicle_Taxi});
    vehiTypes.push({id:5,name: _getRootFrameElement().lang.vehicle_Goods});
	//vehiTypes.push({id:10,name: "小黄人"});
	return vehiTypes;
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
	if(second != null && second == 0){
		difValue += " " + 0 + ' ' + _getRootFrameElement().lang.min_second;
		return difValue;
	}
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



//函数节流工具
//通常用于window.onresize这种一秒钟多次调用的函数方法，用于函数节流
//使用方法： fn 要节流的函数  interval 节流间隔
var throttle = function (fn, interval) {
	var __self = fn, // 保存需要被延迟执行的函数引用
	timer, // 定时器
	firstTime = true; // 是否是第一次调用
	return function () {
		var args = arguments,
		__me = this;
		if (firstTime) { // 如果是第一次调用，不需延迟执行
			__self.apply(__me, args);
			return firstTime = false;
		}
	
		if (timer) { // 如果定时器还在，说明前一次延迟执行还没有完成
			return false;
		}
		timer = setTimeout(function () { // 延迟一段时间执行
			clearTimeout(timer);
			timer = null;
			__self.apply(__me, args);
		}, interval || 500);
	};
}

//获取数组中id与id相同的值 获取司机名称
function getDriverInfo(array,id) {
	var driverInfo = "";
	if(id == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			driverInfo = array[i].name;
			if(array[i].phone){
				driverInfo += '('+array[i].phone+')';
			}
			break;
		}
	}
	return driverInfo;
};

function getKey() {
	var ret = "ttx";		
	var str = "Aes1234";
	return ret + getNumberKey() + str;
}


/**
 * 获取设备通道号名称
 * @param devIdno
 * @param index
 */
function getChannelName(devIdno, index){
	var dev =  _getRootFrameElement().vehicleManager.getDevice(devIdno);
	if(dev){
		return chnName = dev.getSingleChnName(index);
	}else{
		return "CH"+(index+1);
	}
}

/**
 * 限制输入正整数
 */
function restrictNumber(number){
	reg = /^[1-9]\d*$/;
	if(!reg.test(number) && number != null && number != ''){
		alert(_getRootFrameElement().lang.validPositiveIntegers);
		return false;
	}
	return true;
}

/**
 * UTF-8编码
 * @param text
 */
function encodeUtf8(text){
    var code = encodeURIComponent(text);
    var bytes = [];
    for (var i = 0; i < code.length; i++) {
        var c = code.charAt(i);
        if (c === '%') {
            var hex = code.charAt(i + 1) + code.charAt(i + 2);
            var hexVal = parseInt(hex, 16);
            bytes.push(hexVal);
            i += 2;
        } else bytes.push(c.charCodeAt(0));
    }
    var encoded = "";
    for (var i = 0; i < bytes.length; i++) {
        encoded += '%' + bytes[i].toString(16);
    }
    return decodeURIComponent(encoded);
}

//获取所有音视频类型
function getAllAvitemType(){
	var Avi = [];
    Avi.push({id:0,name:_getRootFrameElement().lang.midia});
    Avi.push({id:1,name:_getRootFrameElement().lang.report_vehicle_audio});
    Avi.push({id:2,name:_getRootFrameElement().lang.report_vehicle_video});
    Avi.push({id:3,name:_getRootFrameElement().lang.videoOraudio});
    return Avi;
}


//获取音视频类型
function getAvitemType(type){
    var Avi = '';
    switch (parseInt(type)) {
        case 0:
            Avi = _getRootFrameElement().lang.midia;
            break;
        case 1:
            Avi = _getRootFrameElement().lang.report_vehicle_audio;
            break;
        case 2:
            Avi = _getRootFrameElement().lang.report_vehicle_video;
            break;
        case 3:
            Avi = _getRootFrameElement().lang.videoOraudio;
            break;
    }
    return Avi;
}

//获取码流类型
function getStreamType(type){
    var Stream = '';
    switch (parseInt(type)) {
        case 0:
            Stream = _getRootFrameElement().lang.primaryOrSubstream;
            break;
        case 1:
            Stream = _getRootFrameElement().lang.main_stream;
            break;
        case 2:
            Stream = _getRootFrameElement().lang.subStream;
            break;
    }
    return Stream;
}

function getNumberKey(){
	var str = '';
	for (var i=1;i<7;i++){
		str += i;
	}
	return str;
}

//获取存储类型
function getMemTypeType(type){
    var Mem = '';
    switch (parseInt(type)) {
        case 0:
            Mem = _getRootFrameElement().lang.masterOrDisaster_memory;
            break;
        case 1:
            Mem = _getRootFrameElement().lang.main_Memory;
            break;
        case 2:
            Mem = _getRootFrameElement().lang.disaster_Recovery;
            break;
    }
    return Mem;
}


//获取上传状态
function getStatus(type){
    var status = '';
    switch (parseInt(type)) {
        case 0:
            status = _getRootFrameElement().lang.track_pause;
            break;
        case 1:
            status = _getRootFrameElement().lang.down_loading;
            break;
        case 2:
            status = _getRootFrameElement().lang.cancel;
            break;
        case 3:
            status = _getRootFrameElement().lang.failure;
            break;
        case 4:
            status = _getRootFrameElement().lang.success;
            break;
    }
    return status;
}

/**
 * 下载文件
 * @param url
 */
function downloadFile(url) {   
    try{
   //防止中午乱码
//        url = decodeURIComponent(url);
        var elemIF = document.createElement("iframe");   
        elemIF.src = url;   
        elemIF.style.display = "none";   
        document.body.appendChild(elemIF);   
    }catch(e){ 

    } 
}



/**
 * 适配IE6/7/8 不支持base64图片
 * @param locationCode 图片id
 * @returns {string}
 */
function getEmbedImageSrc(locationCode){
    //for ie6、ie7
    if(document.all&&navigator.userAgent.indexOf("MSIE 8.0")==-1){
        return 'mhtml:'+document.location+'!'+locationCode;
    }

    //for ie8、FireFox 、Opera
    var codeReg=new RegExp(
        "--\\[MHTML_EMBED_CODE\\]\\n+"
        +"[^\\[]*?"
        +"Content-Location:\\s*"+locationCode+"\\s*\\n"
        +"[^\\[]*?"
        +"(?=\\n+--\\[MHTML_EMBED_CODE\\])"
    );

    var codePart=document.documentElement.innerHTML.match(codeReg)[0];

    codePart.match(/Content-Type:\s*(.*?)\n/)
    var imageType=RegExp.$1;

    codePart.match(/\n{2,}([\S\s]+?)$/i);
    var imageCode=RegExp.$1;

    return "data:"+imageType+";base64,"+imageCode;
}



/**
 * AES加密（需要先加载lib/aes/aes.min.js文件）
 * @param word
 * @returns {*}
 */
 function encrypt(word,key){
    var key = CryptoJS.enc.Utf8.parse(key);
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return encrypted.toString();
 }
 
 
 /**
 * AES解密
 * @param word
 * @returns {*}
 */
function decrypt(word,key){
  var key = CryptoJS.enc.Utf8.parse(key);
    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
 
/**
 * Ajax提交
 * @param action
 * @param params
 * @param callback
 */
function submitAjax(action, params, callback) {
    $.ajax({
        type: 'POST',
        url: action,
        data: params,
        cache:false,/*禁用浏览器缓存*/
        dataType: 'json',
        success: function (json) {
            if(json.result == 0){
                callback.call(this, json, action, true);
            } else {
                callback.call(this, json, action, false);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            try {
                if (p.onError) p.onError(XMLHttpRequest, textStatus, errorThrown);
            } catch (e) {}
            callback.call(this, null, action, false);
        }
    });
}


/**
 * 获取报警处理方式
 * @param handleWay
 */
function getHandleWay(handleWay) {
    handleWay = Number(handleWay);
    var result = '';
    if ((handleWay>>0&1)>0) {
        result += parent.lang.phone_notify+ ";";
    }
    if ((handleWay>>1&1)>0) {
        result += parent.lang.stop_car+ ";";
    }
    if ((handleWay>>2&1)>0) {
        result +=parent.lang.warning_tip+ ";";
    }
    if ((handleWay>>3&1)>0) {
        result += parent.lang.stop_adjust+ ";";
    }
    if ((handleWay>>4&1)>0) {
        result += parent.lang.stop_rest+ ";";
    }
    if ((handleWay>>5&1)>0) {
        result += parent.lang.stop_force+ ";";
    }
    if ((handleWay>>6&1)>0) {
        result += parent.lang.audio_down+ ";";
    }
    if ((handleWay>>7&1)>0) {
        result += parent.lang.other+ ";";
    }
    return result;
}

/**
 * 是否开启苏标版本
 * @returns {boolean}
 */
function enableSubiao() {
    var enableSubiao = GetCookie('enableSubiao');
    if(enableSubiao != null && enableSubiao != undefined && enableSubiao == 1){
    	return true;
	}
	return false;
}

/**
 * 登录是否启用AES加密
 */
function enableAesLogin(){
    var enableAesLogin = GetCookie('EnableAESLogin');
    if(enableAesLogin != null && enableAesLogin != undefined && enableAesLogin == 1){
        return true;
    }
    return false;
}


/**
 * 渲染比例条
 * @param value
 * @returns {number}
 */
function formartNumber(value){
	if(!isNaN(value) && value != null){
		if(Number(value)<0){
			return 0;
		}
		if(Number(value)>100){
			return 100;
		}
	}
	return value;
}

/**
 * 阻止事件冒泡
 * @param evt
 */
function stopPropagationEvent(e){
    var evt = e || window.event; //获取event对象
    if (evt.preventDefault) {
        evt.preventDefault(); //非IE浏览器
    } else {
        evt.returnValue = false; //在早期的IE版本中
    }
    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true); //阻止事件冒泡
}


//运输行业类别
function getIndustryType() {

    var types = [];
    types.push({id:10,name: parent.lang.car_industry_type1});//"道路旅客运输"
    types.push({id:11,name: parent.lang.car_industry_type2});//"班车客运"
    types.push({id:12,name: parent.lang.car_industry_type3});//"包车客运"
    types.push({id:13,name: parent.lang.car_industry_type4});//"定线旅游"
    types.push({id:14,name: parent.lang.car_industry_type5});//"非定线旅游"
    types.push({id:20,name: parent.lang.car_industry_type6});//"道路货物运输"
    types.push({id:21,name: parent.lang.car_industry_type7});//"道路普通货物运输"
    types.push({id:22,name: parent.lang.car_industry_type8});//"货物专用运输"
    types.push({id:23,name: parent.lang.car_industry_type9});//"大型物件运输"
    types.push({id:30,name: parent.lang.car_industry_type10});//"道路危险货物运输"
    types.push({id:31,name: parent.lang.car_industry_type11});//运营性危险货物运输
    types.push({id:32,name: parent.lang.car_industry_type12});//非运营性危险货物运输
    types.push({id:40,name: parent.lang.car_industry_type13});//机动车维修
    types.push({id:41,name: parent.lang.car_industry_type14});//汽车维修
    types.push({id:42,name: parent.lang.car_industry_type15});//危险货物运输车辆维修
    types.push({id:43,name: parent.lang.car_industry_type16});//摩托车维修
    types.push({id:44,name: parent.lang.car_industry_type17});//其他机动车维修
    types.push({id:50,name: parent.lang.car_industry_type18});//机动车驾驶员培训
    types.push({id:51,name: parent.lang.car_industry_type19});//普通机动车驾驶员培训
    types.push({id:52,name: parent.lang.car_industry_type20});//道路运输驾驶员从业资格培训
    types.push({id:53,name: parent.lang.car_industry_type21});//机动车驾驶员培训教练场
    types.push({id:60,name: parent.lang.car_industry_type22});//站场服务
    types.push({id:61,name: parent.lang.car_industry_type23});//道路旅客运输站
    types.push({id:62,name: parent.lang.car_industry_type24});//道路货运站(场)
    types.push({id:70,name: parent.lang.car_industry_type25});//国际道路运输
    types.push({id:71,name: parent.lang.car_industry_type26});//国际道路旅客运输
    types.push({id:72,name: parent.lang.car_industry_type27});//国际道路货物运输
    types.push({id:80,name: parent.lang.car_industry_type28});//公交运输
    types.push({id:81,name: parent.lang.car_industry_type29});//公交运输
    types.push({id:90,name: parent.lang.car_industry_type30});//出租运输
    types.push({id:91,name: parent.lang.car_industry_type31});//客运出租运输
    types.push({id:92,name: parent.lang.car_industry_type32});//货运出租运输
    types.push({id:100,name: parent.lang.car_industry_type33});//汽车租赁
    types.push({id:101,name: parent.lang.car_industry_type34});//客运汽车租赁
    types.push({id:102,name: parent.lang.car_industry_type35});//货运汽车租赁
    return types;
}

//车辆类型
function getCarType() {
    var types = [];
    types.push({id:10,name: parent.lang.car_class_type1});//客车
    types.push({id:11,name: parent.lang.car_class_type2});//大型客车
    types.push({id:12,name: parent.lang.car_class_type3});//中型客车
    types.push({id:13,name: parent.lang.car_class_type4});//小型客车
    types.push({id:14,name: parent.lang.car_class_type5});//轿车
    types.push({id:15,name: parent.lang.car_class_type6});//大型卧铺客车
    types.push({id:16,name: parent.lang.car_class_type7});//中型卧铺客车
    types.push({id:20,name: parent.lang.car_class_type8});//普通货车
    types.push({id:21,name: parent.lang.car_class_type9});//大型普通货车
    types.push({id:22,name: parent.lang.car_class_type10});//中型普通货车
    types.push({id:23,name: parent.lang.car_class_type11});//小型普通货车
    types.push({id:30,name: parent.lang.car_class_type12});//专用运输车
    types.push({id:31,name: parent.lang.car_class_type13});//集装箱车
    types.push({id:32,name: parent.lang.car_class_type14});//大件运输车
    types.push({id:33,name: parent.lang.car_class_type15});//保温冷藏车
    types.push({id:34,name: parent.lang.car_class_type16});//商品车运输专用车辆
    types.push({id:35,name: parent.lang.car_class_type17});//罐车
    types.push({id:36,name: parent.lang.car_class_type18});//牵引车
    types.push({id:37,name: parent.lang.car_class_type19});//挂车
    types.push({id:38,name: parent.lang.car_class_type20});//平板车
    types.push({id:39,name: parent.lang.car_class_type21});//其他专用车
    types.push({id:40,name: parent.lang.car_class_type22});//危险品运输车
    types.push({id:50,name: parent.lang.car_class_type23});//农用车
    types.push({id:60,name: parent.lang.car_class_type24});//拖拉机
    types.push({id:61,name: parent.lang.car_class_type25});//轮式拖拉机
    types.push({id:62,name: parent.lang.car_class_type26});//手扶拖拉机
    types.push({id:63,name: parent.lang.car_class_type27});//履带拖拉机
    types.push({id:64,name: parent.lang.car_class_type28});//特种拖拉机
    types.push({id:90,name: parent.lang.car_class_type29});//其他车辆
    return types;
}


//车籍地
function getCarPlace() {
    var types = [];
    types.push({id:110000,name: parent.lang.car_province_type1});//北京市
    types.push({id:120000,name: parent.lang.car_province_type2});//天津市
    types.push({id:130000,name: parent.lang.car_province_type3});//河北省
    types.push({id:140000,name: parent.lang.car_province_type4});//山西省
    types.push({id:150000,name: parent.lang.car_province_type5});//内蒙古自治区
    types.push({id:210000,name: parent.lang.car_province_type6});//辽宁省
    types.push({id:220000,name: parent.lang.car_province_type7});//吉林省
    types.push({id:230000,name: parent.lang.car_province_type8});//黑龙江省
    types.push({id:310000,name: parent.lang.car_province_type9});//上海市
    types.push({id:320000,name: parent.lang.car_province_type10});//江苏省
    types.push({id:330000,name: parent.lang.car_province_type11});//浙江省
    types.push({id:340000,name: parent.lang.car_province_type12});//安徽省
    types.push({id:350000,name: parent.lang.car_province_type13});//福建省
    types.push({id:360000,name: parent.lang.car_province_type14});//江西省
    types.push({id:370000,name: parent.lang.car_province_type15});//山东省
    types.push({id:410000,name: parent.lang.car_province_type16});//河南省
    types.push({id:420000,name: parent.lang.car_province_type17});//湖北省
    types.push({id:430000,name: parent.lang.car_province_type18});//湖南省
    types.push({id:440000,name: parent.lang.car_province_type19});//广东省
    types.push({id:450000,name: parent.lang.car_province_type20});//广西壮族自治区
    types.push({id:460000,name: parent.lang.car_province_type21});//海南省
    types.push({id:500000,name: parent.lang.car_province_type22});//重庆市
    types.push({id:510000,name: parent.lang.car_province_type23});//四川省
    types.push({id:520000,name: parent.lang.car_province_type24});//贵州省
    types.push({id:530000,name: parent.lang.car_province_type25});//云南省
    types.push({id:540000,name: parent.lang.car_province_type26});//西藏自治区
    types.push({id:610000,name: parent.lang.car_province_type27});//陕西省
    types.push({id:620000,name: parent.lang.car_province_type28});//甘肃省
    types.push({id:630000,name: parent.lang.car_province_type29});//青海省
    types.push({id:640000,name: parent.lang.car_province_type30});//宁夏回族自治区
    types.push({id:650000,name: parent.lang.car_province_type31});//新疆维吾尔自治区
    types.push({id:710000,name: parent.lang.car_province_type32});//台湾省
    types.push({id:720000,name: parent.lang.car_province_type33});//香港特别行政区
    types.push({id:730000,name: parent.lang.car_province_type34});//澳门特别行政区
    return types;
}
















