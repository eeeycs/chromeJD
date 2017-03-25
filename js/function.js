//操作cookie
function setCookie(key,value,time){
	var date = new Date();
	date.setTime(date.getTime()+time*1000);
	$.cookie(key,value,{expires:date,path:'/'});
}
function getCookie(key){
	
	// var strCookie = document.cookie;
	// var arrCookie = strCookie.split("; ");
	// for(var i = 0; i < arrCookie.length; i++){
	// 	var arr = arrCookie[i].split("=");
	// 	console.log(arr[0]+"  "+arr[1]);
	// }

	return $.cookie(key);
}
//插件操作
function logout(){
	$(".page-main").css("display","block");
	$("#divinfo").css("display","none");
	chrome.extension.sendMessage({action:'removeItem',key:"userInfo"},function(data){});
}

function showUserInfo(data){
	$(".page-main").css("display","none");
	$("#divinfo").css("display","block");


	$("#username").html(data.object.userName);
	$("#ponit").html(data.object.ponit);
	$("#myRecCode").html(data.object.myRecCode);
	$("#myRecCount").html(data.object.myRecCount);
	$("#myRecCodePoint").html(data.object.myRecCodePoint);
	$("#lastlogintime").html(data.object.lastlogintime);
}

function userLogin(data){
	console.log(data);
	$.ajax({
		type: "post",
		url:"http://59.110.22.116:17888/wb/user/checkJdUserLoginInfoV1.do",
		data:data,
		async: true,
		success: function(data) {
			console.log(data);

			if(data.success==true){                
				var cooId=data.object.cooId;
				var userId=data.object.userId;

				chrome.extension.sendMessage({action:'setItem',key:"userInfo",value:JSON.stringify(data)},function(data){});

				showUserInfo(data);

			}else{
				$("#loginmessage").html(data.message);
			}

		}
	});

}
function check(str){ 
	var temp="" 
	for(var i=0;i<str.length;i++){
		if(str.charCodeAt(i)>0&&str.charCodeAt(i)<255){
			temp+=str.charAt(i);
		} 
	}
	return temp; 
}

function submit(){
	var userId=$("#userId").val();
	var userPwd=$("#userPwd").val();
	if(userId==""){
		$("#userIdSpan").html("用户名不能为空");
		return;
	}
	if(userPwd==""){
		$("#userPwdSpan").html("密码不能为空");
		return;
	}
	var data={
		data:JSON.stringify({
			userId:userId,
			userPwd:userPwd,

		}),
	};
	userLogin(data);
}


//页面标志
function addPageFlag(){
	$(".gl-item:eq(0)").prepend("<div id='pageFlag'></div>");
}
function havePageFlag(){
	return $("#pageFlag").html()!=null;	
}
function ifNoneAddPageFlag(){
	if(!havePageFlag()){
		addPageFlag();
	}
}

