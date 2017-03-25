$(function(){

	chrome.extension.sendMessage({action:'getItem',key:"userInfo"},function(data){
		if(data!=null){
			showUserInfo(JSON.parse(data));
		}
	});



	$('#myloginbtn').click(submit);

	$("#userId,#userPwd").keyup(function(){
		this.value=check(this.value);
		if(event.keyCode == 13){
			submit();
		}
	});


	$('#logout').click(logout);

	$('#registereBtn').click(function(){
		window.open("http://note.youdao.com/noteshare?id=744d873d92394b776b777b24a692e86f");
	});

	$('#softName').html(softName+version);



});
 