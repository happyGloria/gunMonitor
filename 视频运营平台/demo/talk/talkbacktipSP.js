var api = frameElement.api, W = api.opener;
$(document).ready(function(){
	loadPage();
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}
// 实时         这个页面langChange
function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	var II=typeof parent.langChange;
	if(typeof parent.langChange == "function"){
		if (parent.langChange()) {//中文
			$('#stp-img1').attr('src', '../images/flash_mic_1.png');
			$('#stp-img2').attr('src', '../images/flash_mic_2.png');
		}else {
			$('#stp-img1').attr('src', '../images/flash_mic_1_en.png');
			$('#stp-img2').attr('src', '../images/flash_mic_2_en.png');
		}
	}else{
		if(typeof getObjectClass(parent.lang) == "langEn"){
			$('#stp-img1').attr('src', '../images/flash_mic_1_en.png');
			$('#stp-img2').attr('src', '../images/flash_mic_2_en.png');
		}else{
			$('#stp-img1').attr('src', '../images/flash_mic_1.png');
			$('#stp-img2').attr('src', '../images/flash_mic_2.png');
		}
	}
	$("#step1").html(parent.lang.talkback_flashMicStep1);
	$("#step2").html(parent.lang.talkback_flashMicStep2);
	$("#step3").html(parent.lang.talkback_flashMicStep3);
}

var getObjectClass = function (obj) {
    if (obj && obj.constructor && obj.constructor.toString()) {
         
            /*
             *  for browsers which have name property in the constructor
             *  of the object,such as chrome 
             */
            if(obj.constructor.name) {
                return obj.constructor.name;
            }
            var str = obj.constructor.toString();
            /*
             * executed if the return of object.constructor.toString() is 
             * "[object objectClass]"
             */
              
            if(str.charAt(0) == '[')
            {
                    var arr = str.match(/\[\w+\s*(\w+)\]/);
            } else {
                    /*
                     * executed if the return of object.constructor.toString() is 
                     * "function objectClass () {}"
                     * for IE Firefox
                     */
                    var arr = str.match(/function\s*(\w+)/);
            }
            if (arr && arr.length == 2) {
                        return arr[1];
                    }
      }
      return undefined; 
};
