$(function(){

	chrome.extension.onMessage.addListener(function(objRequest,_,sendResponse){
		var action=objRequest.action;
		if(action=="setItem"){
			localStorage.setItem(objRequest.key,objRequest.value);
		}
		if(action=="getItem"){
			sendResponse(localStorage.getItem(objRequest.key));
		}
		if(action=="removeItem"){
			localStorage.removeItem(objRequest.key);
		}


		if(action=="getJdGoodCominfoV1"){
			$.ajax({
				type: "post",
				url: "http://59.110.22.116:17888/wb/good/getJdGoodCominfoV1.do",
				data: objRequest.data,
				async: false,
				success: function(data) {
					sendResponse(data);
				}
			});
		}
		
		if(action=="getJdGoodCominfoListV1"){
			$.ajax({
				type: "post",
				url: "http://59.110.22.116:17888/wb/good/getJdGoodCominfoListV1.do",
				data: objRequest.data,
				async: false,
				success: function(data) {
					sendResponse(data);
				}
			});
		}
		//发送cookie
		if(action=="sendCookie"){
			$.ajax({
				type: "post",
				url: "http://59.110.22.116:17888/wb/user/addUserWebCrxUserCookieV1.do",
				data: objRequest.data,
				async: false,
				success: function(data) {
					sendResponse(data);
				}
			});
		}
	});

});
