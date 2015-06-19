/**
定义指令如下：
空调开关：onOff 0为关 1为开
温度变化：wendu 正数为升温  负数为降温
模式变化：moshi 0为制冷 1为制热
除湿功能：chushi 0为关除湿 1为开除湿
扫风模式：feng 0为左右扫风 1为上下扫风
定时功能：time为定时器是否开启，offTime为定时时间
*/
$(function() {
	var uuid = '&' + window.location.href.split('?')[1];
	var onOff = $('#switch')
		, wendu = $('#wendu')
		, feng = $('#feng')
		, moshi = $('#moshi')
		, time = $('#time')
		, chushi = $('#chushi')
		, offTime = $('#offTime')
		, timeTrigger = $('#timeTrigger');
	var timeFlag = 0;   																	//用来记录得到定时指令后的当前时间
	var data = init();    																	//从cookie里读取关机或发生故障之前的历史记录
	check();                 																	//判断wendu和定时器
	print();
	getDataFromServer();
	setInterval(function() {   			 				//每隔30S进入   查看定时器是否开启，开启则打开定时功能
		check();
		print();
	}, 20000);
	function init() {    									//从cookie里读取值，赋值给data数组
		var data = [], cookie = '', index, val, ind;
		if (!document.cookie) {							//第一次进入初始化cookie
			document.cookie = 'onOff=0&wendu=20&feng=0&moshi=0&chushi=0&time=0&offTime=0';
		}
		cookie = document.cookie;
		cookie = cookie.split('&');						//eg: 右cookie='onOff=0&wendu=29'  左cookie=['onOff=0', 'wendu=19']
		for (var i in cookie) {
			ind = cookie[i].indexOf('=');
			index = cookie[i].slice(0, ind);
			val = cookie[i].slice(ind + 1);
			data[index] = val;                					//eg: data['onOff'] = 0, data['wendu'] = 29
		}
		return data;
	}
	function print() {   														  //输出函数
		if (data['time'] == 1) {      											  //定时器功能开启
			//console.log((new Date()).toLocaleTimeString(), timeFlag.toLocaleTimeString(), getM(new Date(), timeFlag), data['time'], data['offTime']);
			if (getM(new Date(), timeFlag) >= data['offTime']) {           		  //从定时时间点到此时的时间大于等于定时时间
				data['onOff'] = data['time'] = data['offTime'] = timeFlag = 0;    //关机，关闭定时器，定时时间清0，定时时间点清0
			}
		}
		if (data['onOff'] == 0) data['time'] = data['offTime'] = timeFlag = 0;      //关机状态下：定时器，定时时间，定时时间点为0
		onOff.html(data['onOff'] == 0 ? '关' : '开');                                             //载入开关机状态
		wendu.html(data['wendu']);										 //载入温度
		feng.html(data['feng'] == 0 ? '左右扫风' : '上下扫风');				 //载入扫风状态
		moshi.html(data['moshi'] == 0 ? '制冷' : '制热');						 //载入模式状态
		chushi.html(data['chushi'] == 0 ? '关' : '开');							 //载入除湿状态
		time.html(data['time'] == 0 ? '关' : '开');								 //载入定时器状态
		if (data['time'] == 1) {
			timeTrigger.show();  											 //显示定时器模块
			offTime.html(data['offTime'] - getM(new Date(), timeFlag));         //若定时器开启，则输出剩余关机时间
		}
		else timeTrigger.hide();												 //关闭定时器模块
	}
	function getData(response) {											//反序列化response  eg:response='wendu=2&moshi=1' data['wendu':2, 'moshi':1]
		var data = [], arr = response.split('&'), temp = [];
		for (var i = arr.length - 1; i > -1; i--) {
			temp = arr[i].split('=');
			data[temp[0]] = temp[1];
		}
		return data;
	}
	function check() {														//检查温度是否合法以及定时器状态
		data['wendu'] = data['wendu'] > 30 ? 30 : (data['wendu'] < 16 ? 16 : data['wendu']);
		if (data['offTime'] > 0) data['time'] = 1;								//定时时间大于0则开启定时器
		else data['time'] = 0;												//否则关闭定时器
		if (data['time'] == 0) data['offTime'] = timeFlag = 0;					//定时器关闭则定时时间和定时时间点清0
		else {
			//console.log(data['time'], data['offTime']);
			if (timeFlag == 0) timeFlag = new Date();						//否则记录定时时间点
		}
	}
	function getM(dateMax, dateMin) {										//得到两个时间点的分钟差
		var hour = dateMax.getHours();
		if (dateMax.getDate() < dateMin.getDate()) {
			hour += 24;
		}
		hour -= dateMin.getHours();
		return Number(hour) * 60 + Number(dateMax.getMinutes()) - Number(dateMin.getMinutes());
	}
	function setCookie(data) {												//将data数组值序列化后保存到cookie里
		var cookie = '';														//eg: data=['onOff':0, 'wendu':29]  cookie = 'onOff=0&wendu=29'
		for (var i in data) {
			cookie += i + '=' +data[i] + '&';
		}
		cookie = cookie.slice(0, cookie.length - 1);
		document.cookie = cookie;
	}
	function getDataFromServer() {
		$.ajax({
			type: 'POST',
			url: '/songxia/end/fn2.php',
			data: 'wendu=' + wendu.html() + uuid,
			success: function(response) {
				if (response !== '') {              												//指令不为空
					var resarr = getData(response);         									//反格式化response eg:response='onOff=0&moshi=1' resarr=['onOff':0, 'moshi':1]
					if ((data['onOff'] == 1) || (data['onOff'] == 0 && resarr['onOff'] == 1)) {    //若为开机状态或关机状态下收到开机指令才对data数组赋值
						for (var i in resarr) {
							//console.log(resarr);
							if (i != 'wendu')  data[i] = resarr[i];
							else data[i] = Number(resarr[i]) + Number(data[i]);   			//wendu指令为加减法
						}
						check();
						print();
					} else {
						data['onOff'] = 0;
						onOff.html("关");
					}
					setCookie(data);               				//保存data值到cookie里， 在发生故障时保存data数组值
				}
				getDataFromServer();
			}
		});
	}
})