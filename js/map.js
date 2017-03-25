var manifest = chrome.runtime.getManifest();
var version = manifest.manifest_version+"."+manifest.version;
var softName=manifest.name;

var addQqGroupUrl="//shang.qq.com/wpa/qunwpa?idkey=941a792b624624993423cde4ed272eacd764e65ea5fee9cd315933340b4bac56";
var sFlag=1;//列表个数标志
var rFlag=1;//权限标志
var bFlag=1;//查询按钮标志

var nowUrl=window.location.href;
var goodsInfo="item.jd";
var goodsSearch="search.jd";
var goodsSearch2="gou.jd.com/search";

var userCoolie="media.jd.com";


