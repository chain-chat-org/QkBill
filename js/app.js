var commonAssetsList = [
	{
		'assets_name':'QKI',
		'icon':"icon-integral",
		'description':"QKI",
		'is_main':1,
		'main_chain':"QKI",
		'amount':0,
		'legal_money':0,
		'price':0,
		'address':'',
		'token_address':''
	},
	{
		'assets_name':'CCT',
		'icon':"icon-tools",
		'description':"QKI token",
		'is_main':0,
		'main_chain':"QKI",
		'amount':0,
		'legal_money':0,
		'price':0,
		'address':'',
		'token_address':'0x4175aa5d372015b67ef58514414086f0f36caa7a'
	},
	{
		'assets_name':'USDT',
		'icon':"icon-usdt",
		'description':"QUSDTn",
		'is_main':0,
		'main_chain':"QKI",
		'amount':0,
		'legal_money':0,
		'price':0,
		'address':'',
		'token_address':'0xdf0e293cc3c7ba051763ff6b026da0853d446e38'
	},
	{
		'assets_name':'ETH',
		'icon':"icon-yitaifang",
		'description':"QKI token",
		'is_main':0,
		'main_chain':"QKI",
		'amount':0,
		'legal_money':0,
		'price':0,
		'address':'',
		'token_address':'0x06fc17a46991d566bc55f4186b63cfdc28aed8d4'
	},
	{
		'assets_name':'ETH',	
		'icon':"icon-yitaifang",
		'description':"ETH",
		'is_main':1,
		'main_chain':"ETH",
		'amount':0,
		'legal_money':0,
		'price':0,
		'address':'',
		'token_address':''
	},
	{
		'assets_name':'USDT',
		'icon':"icon-usdt",
		'description':"ETH token",
		'is_main':0,
		'main_chain':"ETH",
		'amount':0,
		'legal_money':0,
		'price':0,
		'address':'',
		'token_address':'0xdAC17F958D2ee523a2206206994597C13D831ec7'
	},
	{
		'assets_name':'CCT',
		'icon':"icon-tools",
		'description':"ETH token",
		'is_main':0,
		'main_chain':"ETH",
		'amount':0,
		'legal_money':0,
		'price':0,
		'address':'',
		'token_address':'0xca34f93f019aafa64a6c16d1c0e791d407af8271'
	}
]

function getNodeHost()
{
	var node_host = localStorage.getItem("node_host");
	if(!node_host)
	{
		var node_host = "http://hz.node.quarkblockchain.cn:20189";
	}
	
	return node_host;
}

function getEthNodeHost()
{
	var node_host = localStorage.getItem("eth_node_host");
	if(!node_host)
	{
		var node_host = "http://eth-node.hz.quarkblockchain.cn:8546";
	}
	
	return node_host;
}

function getEthNodeName(node_host)
{
	var node_name = "homestead";
	var node_list = localStorage.getItem('eth-node-list');
	if(node_list)
	{
		for(var i in node_list)
		{
			if(node_host == node_list[i].node_host)
			{
				node_name = node_list[i].node_name;
				break;
			}
		}
	}
	
	return node_name;
}

function setAdaptionHeight(className,proportion)
{
	var Bgwidth = h("."+className).width();
	h("."+className).css({'height':Bgwidth/proportion+'px'})
}

//打乱数组
function shuffle(arr) 
{
	
  var length = arr.length,
    randomIndex,
    temp;
  while (length) {
    randomIndex = Math.floor(Math.random() * (length--));
    temp = arr[randomIndex];
    arr[randomIndex] = arr[length];
    arr[length] = temp
  }
  return arr;
  
}

//求总资产
function getAssetsAmount()
{
	var assets_amount = 0;
	var accounts = plus.storage.getItem('accounts');
	
	if(!accounts)
	{
		accounts = new Array();
	}
	else
	{
		accounts = JSON.parse(accounts);
	}
	
	for(var i in accounts)
	{
		assets_amount = math.add(assets_amount,accounts[i].assets_amount).toFixed(2);
	}
	return assets_amount;
}

//更新每个钱包的资产余额（法币）
function updateWallet()
{
	var accounts = plus.storage.getItem('accounts');
	
	if(!accounts)
	{
		accounts = new Array();
	}
	else
	{
		accounts = JSON.parse(accounts);
	}
	for(var i in accounts)
	{
		var assets_amount = 0;
		assetsList = plus.storage.getItem(accounts[i].address + "-assets")

		assetsList = JSON.parse(assetsList);
		for(var j in assetsList)
		{
			assets_amount = math.add(assets_amount,assetsList[j].legal_money);
		}
		accounts[i].assets_amount = assets_amount;
		
		plus.storage.setItem("accounts",JSON.stringify(accounts));
	}
}


//获取每个钱包的各个数字资产余额
function getBalance()
{
	var accounts = plus.storage.getItem('accounts');
	if(!accounts)
	{
		accounts = new Array();
	}
	else
	{
		accounts = JSON.parse(accounts);
	}
	var str = [];
	//循环所有钱包
	for(var i in accounts)
	{
		var assets_token_str = "";
		assetsList = localStorage.getItem(accounts[i].address + "-assets")

		if(!plus.storage.getItem(accounts[i].address + "-assets"))
		{
			plus.storage.setItem(accounts[i].address + "-assets",assetsList);
		}
		assetsList = plus.storage.getItem(accounts[i].address + "-assets");
		
		assetsList = JSON.parse(assetsList);
		for(var j in assetsList)
		{
			if(assetsList[j].main_chain == "QKI")
			{
				assets_token_str = assets_token_str + assetsList[j].token_address + ",";
			}
		}
		assets_token_str = assets_token_str.substr(1);
		assets_token_str = assets_token_str.substr(0,assets_token_str.length - 1);
	
		str.push(
			{
				"address":accounts[i].address,
				"assets_token":assets_token_str
			}
		);
	}
	//console.log("https://qkiscan.cn/api/get-balance?str="+JSON.stringify(str))

	mui.ajax('https://qkiscan.cn/api/get-balance',{
		data:{
			str:JSON.stringify(str),
			version:'1.1.2'
		},
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；	              
		success:function(data){
			
			if(data.code == 0)
			{
				var data = data.data;
				
				mui.each(data,function(index,item){
					mui.each(item,function(key,val){
						mui.each(val,function(assets_name,balance){
							assetsList = plus.storage.getItem(key + "-assets");
							assetsList = JSON.parse(assetsList);
							for(var i in assetsList)
							{
								if(assets_name == assetsList[i].assets_name || assets_name == assetsList[i].token_address)
								{
									assetsList[i].amount = parseFloat(balance);
								}
							}
							plus.storage.setItem(key + "-assets",JSON.stringify(assetsList));
						});
					});
				});
			}
			
		},
		error:function(xhr,type,errorThrown){
			//异常处理；
			// mui.toast("请求异常1");
		}
	});
	
}
//更新每个资产的法币金额
function updatelLegalMoney()
{
	var assetsString = '';
	//循环所有钱包
	for(var i in commonAssetsList)
	{
		assetsString = assetsString + commonAssetsList[i].assets_name + ",";
	}
	assetsString = assetsString.substring(0,assetsString.length-1);
	//console.log("https://dddotc.com/api/get-avg-price-assetsname?assets_name="+assetsString+"&currency=cny")
	mui.ajax('https://dddotc.com/api/get-avg-price-assetsname',{
		data:{
			assets_name:assetsString,
			currency:"usd"
		},
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:5000,//超时时间设置为10秒；	              
		success:function(data){
			if(data.code == 0)
			{
				var data = data.data;
				
				mui.each(data,function(index,item){
					
					var accounts = plus.storage.getItem('accounts');
					if(!accounts)
					{
						accounts = new Array();
					}
					else
					{
						accounts = JSON.parse(accounts);
					}
					//循环所有钱包
					for(var i in accounts)
					{
						assetsList = plus.storage.getItem(accounts[i].address + "-assets")
						assetsList = JSON.parse(assetsList);
						for(var j in assetsList)
						{
							if(item.assets_name == assetsList[j].assets_name)
							{
								assetsList[j].price = item.avg_price;
								assetsList[j].legal_money = (assetsList[j].price * assetsList[j].amount).toFixed(2);
							}
							plus.storage.setItem(accounts[i].address + "-assets",JSON.stringify(assetsList));
						}
					}
				});
			}
		},
		error:function(xhr,type,errorThrown){
			// mui.toast("请求异常5");
		}
	});
	
}


//获取本钱包资产总和
function getAssetsSumBalance(assets_name)
{
	var assetsAmount = 0;
	var accounts = plus.storage.getItem('accounts');
	if(!accounts)
	{
		accounts = new Array();
	}
	else
	{
		accounts = JSON.parse(accounts);
	}
	
	for(var i in accounts)
	{
		assetsList = plus.storage.getItem(accounts[i].address + "-assets")

		assetsList = JSON.parse(assetsList);
		for(var j in assetsList)
		{
			if(assets_name == assetsList[j].assets_name)
			{
				assetsAmount = parseFloat(math.add(assetsAmount,assetsList[j].amount).toFixed(8));
			}
		}
	}

	return assetsAmount;
}

//显示钱包
function showWallet()
{
	var accounts = localStorage.getItem('accounts');
	if(!plus.storage.getItem('accounts'))
	{
		plus.storage.setItem('accounts',accounts)
	}
	
	accounts = plus.storage.getItem('accounts');
	if(!accounts)
	{
		accounts = new Array();
	}
	else
	{
		accounts = JSON.parse(accounts);
	}
	return accounts;
}

//显示资产
function showAssets(address)
{
	assetsList = plus.storage.getItem(address + "-assets");
	assetsList = JSON.parse(assetsList);
	
	return assetsList;
}

//获取某个地址下资产总额（法币）
function getWalletAssetsAmount(address)
{
	assetsList = plus.storage.getItem(address + "-assets")
	assetsList = JSON.parse(assetsList);
	var assets_amount = 0;
	
	for(var j in assetsList)
	{
		assets_amount = math.add(assets_amount,assetsList[j].legal_money);
	}
	
	return assets_amount;
}

//根据地址和资产名获取单个资产数据
function getAssets(address,assets_name,main_chain)
{
	assetsList = plus.storage.getItem(address + "-assets")
	assetsList = JSON.parse(assetsList);
	var assets = [];
	for(var j in assetsList)
	{
		if(assetsList[j].assets_name == assets_name && assetsList[j].main_chain == main_chain)
		{
			assets = assetsList[j];
		}
	}
	
	return assets;
}

//根据地址获取单个钱包数据
function getWallet(address)
{
	var accounts = plus.storage.getItem('accounts');
	if(!accounts)
	{
		accounts = new Array();
	}
	else
	{
		accounts = JSON.parse(accounts);
	}
	var wallet = [];
	for(var i in accounts)
	{
		if(accounts[i].address == address)
		{
			wallet = accounts[i];
		}
	}
	
	return wallet;
}

//获取联系人列表
function getContacts()
{
	var contacts = localStorage.getItem('contacts');
	if(!plus.storage.getItem('contacts'))
	{
		plus.storage.setItem('contacts',contacts)
	}
	
	contacts = plus.storage.getItem('contacts');
	if(!contacts)
	{
		contacts = new Array();
	}
	else
	{
		contacts = JSON.parse(contacts);
	}
	
	return contacts;
}

//根据地址获取单条联系人
function getContactsByAddress(address) 
{
	var contacts = plus.storage.getItem('contacts');

	if(!contacts)
	{
		contacts = new Array();
	}
	else
	{
		contacts = JSON.parse(contacts);
	}
	
	var contact = [];
	for(var i in contacts)
	{
		if(contacts[i].address == address)
		{
			contact = contacts[i];
		}
	}
	
	return contact;
}

function compareVersion(v1, v2) {
    v1 = v1.split(".")
    v2 = v2.split(".")
    len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push("0")
    }
    while (v2.length < len) {
        v2.push("0")
    }

    for (i = 0; i < len; i++) {
        num1 = parseInt(v1[i])
        num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}

var update_host = "https://static.quarkblockchain.cn/app/com.quarkblockchain.qkbill/";
/**
 * app升级 
 */
function app_update()
{
	//更新资产
	var version = plus.runtime.version;
	var update_wallet_version = localStorage.getItem("update-wallet-version");
	if(!update_wallet_version)
	{
		localStorage.setItem("update-wallet-version","1.0.4");
	}
	update_wallet_version = localStorage.getItem("update-wallet-version");
	if(compareVersion(version,update_wallet_version) > 0)
	{
		localStorage.setItem("update-wallet-version",version);
		var accounts = plus.storage.getItem('accounts');
		if(accounts)
		{
			accounts = JSON.parse(accounts);
			
			for(var i in accounts)
			{
				for(var j in commonAssetsList)
				{
					commonAssetsList[j].address = accounts[i].address;
				}
				plus.storage.setItem(accounts[i].address+"-assets",JSON.stringify(commonAssetsList));
			}
		}
	}
	
    if(mui.os.android)
    {
        var version = plus.runtime.version;

        mui.ajax(update_host+"app.update.json",{

            data:{
                'version':version,
                'platform':'android',
                "r":Math.random()
            },
            dataType:'json',//服务器返回json格式数据
            type:'get',//HTTP请求类型
            success:function(data){
                if(data.version > version)
                {
                	
                    var app = data;
                    var url = app.url; // 下载文件地址
                    
                    if(data.forcibly == "1")
                    {
                        var dtask = plus.downloader.createDownload( url, {}, function ( d, status ) {
                            if ( status == 200 ) { // 下载成功
                                var path = d.filename;
                                plus.runtime.install(path);  // 安装下载的apk文件
                            } else {//下载失败
                                mui.alert( "Download failed: " + status );
                            }
                        });
                        dtask.start();
                    }
                    else
                    {
                        plus.nativeUI.confirm( data.msg, function(e){
                            if(e.index==0)
                            {
                                var dtask = plus.downloader.createDownload( url, {}, function ( d, status ) {
                                    if ( status == 200 ) { // 下载成功
                                        var path = d.filename;
                                        plus.runtime.install(path);  // 安装下载的apk文件
                                    } else {//下载失败
                                        mui.alert( "Download failed: " + status );
                                    }
                                });
                                dtask.start();
                            }
                        }, "app更新", ["更新","取消"] );
                    }
                }
                else
				{
                    wgt_update();
				}
            },
            error:function () {
                wgt_update();
            }

        });
    }
	else
	{
		var version = plus.runtime.version;

        mui.ajax(update_host +"ios.update.json",{

            data:{
                'version':version,
                'platform':'ios',
                "r":Math.random()
            },
            dataType:'json',//服务器返回json格式数据
            type:'get',//HTTP请求类型
            success:function(data){

                if(data.version > version)
                {
                    mui.alert("发现新的版本，点击下载",function(){
                        window.location.href = data.url;
                    })
                }
                else
                {
                    try {
                        wgt_update();
                    }
                    catch (e) {
                        console.log(e)
                    }
                }
            }
        });
	}
}

function wgt_update() {
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        var wgtVer=inf.version;
        wgt_var = inf.version;
        var wgtu_url = update_host+"diff/wgtu-" + wgt_var + ".json";

        mui.ajax({
            type: "get",
            async: false,
            url: wgtu_url,
            dataType: "json",
            data: {version:wgtVer,r:Math.random()},
            success: function (data) {
                if(compareVersion(data.version_name,wgtVer) > 0)
                {
					
					
                    if(data.forcibly == "1")
                    {
                        update_wgtu(data.url);
                    }
                    else
                    {
                        plus.nativeUI.confirm( data.msg, function(e){
                            if(e.index==0)
                            {
                                update_wgtu(data.url);
                            }
                        }, "资源包更新", ["升级","取消"] );
                    }
                }
                else
                {
                    is_update=false;
                }
            },
            error:function () {
                //如果差量更新失败，就更新增量
                //安卓和ios区分升级
                if(mui.os.android)
                    wgt_url = update_host+"wgt.android.update.json";
                else
                    wgt_url = update_host+"wgt.ios.update.json";

                mui.ajax({
                    type: "get",
                    async: false,
                    url: wgt_url,
                    dataType: "json",
                    data: {version:wgtVer,r:Math.random()},
                    success: function (data) {
                        if(compareVersion(data.version_name,wgtVer) > 0)
                        {
                            if(data.forcibly == "1")
                            {
                                update_wgt(data.url);
                            }
                            else
                            {
                                plus.nativeUI.confirm( data.msg, function(e){
                                    if(e.index==0)
                                    {
                                        update_wgt(data.url);
                                    }
                                }, "资源包更新", ["升级","取消"] );
                            }
                        }
                        else
                        {
                            is_update=false;
                        }
                    }
                });
            }
        });
    });
}

/**
 * 升级wgt
 * @param url
 */
function update_wgt(url) {
    plus.io.resolveLocalFileSystemURL("_doc/update.wgt", function( entry ) {
        // 可通过entry对象操作test.html文件
        entry.remove();
    });

    plus.nativeUI.showWaiting("下载wgt资源更新文件...");
    plus.downloader.createDownload( url, {filename:"_doc/update.wgt"}, function(d,status){
        if ( status == 200 ) {
            install_wgt(d.filename)
        } else {
            alert("下载wgt失败！");
        }
    }).start();
    plus.nativeUI.closeWaiting();
}

/**
 * 安装wgt
 * @param filename
 */
function install_wgt(filename)
{
    plus.nativeUI.showWaiting("安装wgt资源文件...");
    plus.runtime.install(filename,{force:true},function(){
        plus.nativeUI.closeWaiting();
        plus.nativeUI.alert("应用资源更新完成！",function(){
            plus.runtime.restart();
        });
        plus.io.resolveLocalFileSystemURL(filename, function( entry ) {
            entry.remove()
        },function (e) {
            alert(e)
        });

    },function(e){
        alert("安装wgt文件失败["+e.code+"]："+e.message);
        plus.io.resolveLocalFileSystemURL(filename, function( entry ) {
            entry.remove()
        },function (e) {
            alert(e)
        });

    });
}

/**
 * 更新以太坊余额
 * @param {Object} address
 */
function updateEthAmount(address)
{
	var provider = new ethers.providers.JsonRpcProvider({"url":getEthNodeHost()});

	provider.getBalance(address).then((balance) => {
		let etherString = ethers.utils.formatEther(balance);
		assetsList = plus.storage.getItem(address + "-assets");

		assetsList = JSON.parse(assetsList);
		for(var i in assetsList)
		{
			if(assetsList[i].assets_name == "ETH" && assetsList[i].main_chain == "ETH" )
			{
				assetsList[i].amount = etherString;
			}
		}
		vm.assetsList = assetsList;
		plus.storage.setItem(address + "-assets",JSON.stringify(assetsList));
	});
	var indexPage = plus.webview.getWebviewById("tab-subpage-index.html");
	mui.fire(indexPage,'fresh-wallet');
}

/**
 * 更新以太坊余额
 * @param {Object} address
 */
function updateEthTokenAmount(address,assets_name)
{
	var token = "";
	assetsList = plus.storage.getItem(address + "-assets");
	assetsList = JSON.parse(assetsList);
	for(var i in assetsList)
	{
		if(assetsList[i].assets_name == assets_name)
		{
			token = assetsList[i].token_address;
		}
	}
	
	// abi json 对象
	const abi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256" } ], "payable": false, "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "inputs": [ { "name": "_initialAmount", "type": "uint256" }, { "name": "_tokenName", "type": "string" }, { "name": "_decimalUnits", "type": "uint8" }, { "name": "_tokenSymbol", "type": "string" } ], "payable": false, "type": "constructor" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" } ];
	// 创建一个连接主网络的 provider
	var eth_node_host = getEthNodeHost();
	if(eth_node_host.substr(0,4) != "http")
	{
		var eth_node_name = getEthNodeName(eth_node_host);
		var provider = new ethers.providers.EtherscanProvider(eth_node_name,eth_node_host);
	}else{
		var provider = new ethers.providers.JsonRpcProvider({"url":eth_node_host});
	}
	// 创建智能合约
	const contract = new ethers.Contract(token, abi, provider);

	contract.decimals().then(function(data){
		var decimals = data;
		var balance =  0;
		contract.balanceOf(address).then(function (data) {
			balance = math.divide(data.toString(), math.pow(10,decimals));
		
			for(var i in assetsList)
			{
				if(assetsList[i].assets_name == assets_name && assetsList[i].main_chain == "ETH")
				{
					assetsList[i].amount = balance;
				}
			}
			vm.assetsList = assetsList;
			plus.storage.setItem(address + "-assets",JSON.stringify(assetsList));
		})
	})
	
	var indexPage = plus.webview.getWebviewById("tab-subpage-index.html");
	mui.fire(indexPage,'fresh-wallet');
}

function accMul(arg1,arg2)
{
	var m=0,s1=arg1.toString(),s2=arg2.toString();
	try{m+=s1.split(".")[1].length}catch(e){}
	try{m+=s2.split(".")[1].length}catch(e){}
         
	return (Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m));
}