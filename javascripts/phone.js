/**
定义指令如下：
空调开关：onOff 0为关 1为开
温度变化：wendu 正数为升温  负数为降温
模式变化：moshi 0为制冷 1为制热
除湿功能：chushi 0为关除湿 1为开除湿
扫风模式：feng 0为左右扫风 1为上下扫风
定时功能：offTime 0为关定时 正数为定时功能开启且是定时时间，以分钟为单位
*/
$(function() {
	var uuid = '&' + window.location.href.split('?')[1];
	//console.log(uuid);
	//sessionStorage.clear();
	$.post('/songxia/end/fn4.php', 'passwd=' + sessionStorage.getItem('admin') + uuid, function(res) {     //判断是否登陆，否则重定向到登陆界面
		if (res != 1) {
			window.location = '/songxia/index.html' +  '?' + uuid.split('&')[1];
		}
	});
	var offTimeFlag = 0, offFlag = 0;   			//ofTimeFlag记录定时器开时定时时间，offFlag用来记录开启定时器的当前时间
	var guzhangFlag = 0, guzhangFlagOld = 0;
	var ul = $('ul'), p = $('p');               			//ul和p
	p.hide();									//默认隐藏p
	getWendu(1);								//查询空调和通信子网是否连接
	var send = [];     							//发送的指令保存在这个数组里
	var onImg = $('#onImg'), offImg = $('#offImg');
	onImg.on('click', function() {
		send['onOff'] = 1;
		onImg.hide();
		offImg.show();
	});
	offImg.on('click', function() {
		send['onOff'] = 0;
		send['offTime'] = 0;
		offImg.hide();
		onImg.show();
	});
	var onOff = $('#switch');
	onOff.on('click', function(e) {    				//点击空调开关
		onOff.html(onOff.html() === '开' ? '关' : '开');    //切换动作指令
		send['onOff'] = (onOff.html() === '开' ? 0 : 1);    //保存指令
		if (isOff()) send['offTime'] = 0;
		if (onOff.html() === '开') this.style.backgroundPosition = '1.6875rem 0';
		else this.style.backgroundPosition = '0 0';
	})
	var wendu = 0;  							//初始化wendu = 0
	var up = $('#up');
	up.on('click', function() {
		if (isOn()) wendu++;   					//点击升温则wendu++
	});
	var down = $('#down');
	down.on('click', function() {
		if (isOn()) wendu--;   					//点击降温则wendu--
	});
	var xianshi = $('#xianshi');
	getWendu();                    					//初始化wendu显示值
	var feng = $('#feng');  						//扫风模式
	feng.on('click', function() {
		if (isOn()) {
			feng.html(feng.html() === '左右扫风' ? '上下扫风' : '左右扫风');
			send['feng'] = (feng.html() === '左右扫风' ? 1 : 0);
		}
	});
	var moshi = $('#moshi');  					//模式变化
	moshi.on('click', function() {
		if (isOn()) {
			moshi.html(moshi.html() === '制冷' ? '制热' : '制冷');
			send['moshi'] = (moshi.html() === '制冷' ? 1 : 0);
		}
	});
	var chushi = $('#chushi');  					//除湿功能
	chushi.on('click', function() {
		if (isOn()) {
			chushi.html(chushi.html() === '开' ? '关' : '开');
			send['chushi'] = (chushi.html() === '关' ? 1 : 0);
		}
	});
	var time = $('#time');   						//time的innerHTML为关则为开定时器，显示定时器输入模块，反之则关定时器，关闭定时器模块
	time.on('click', function(e) {
		if (isOn()) {
			time.html(time.html() === '开' ? '关' : '开');
			if (time.html() === '关') {
				timeTrigger.show();  			//显示定时器模块
			} else {
				offTimeFlag = send['offTime'] = 0;   //offTime为0，关闭定时器
				timeTrigger.hide();  			//关闭定时器模块
				guanji.hide();
			}
		}
	});
	var timeTrigger = $('#timeTrigger');  		//定时器模块
	var guanji = $('#guanji');
	var offTime = $('#offTime');
	var offTimeCheck = $('#offTimeCheck');   	//确认定时时间
	offTimeCheck.on('click', function() {
		if (isOn()) {
			if (time.html() === '关') {      			//只有在此状态下才能进入开启定时器
				if (isNaN(Number(offTime.val())) || Math.floor(Number(offTime.val())) <= 0) {   //输入非法字符提示重新输入
					if (!!window.MyToast) window.MyToast.myToast('请重新输入定时时间!');
					else alert('请重新输入定时时间!');
				} else {
					guanji.html(Number(offTime.val()) + '分钟');
					guanji.show();
					offTimeFlag = send['offTime'] = Math.floor(Number(offTime.val())) || 0;  //保存定时器值
					timeTrigger.hide();
				}
			}
		} else {
			guanji.hide();
		}
	})
	var sendInterval = setInterval(function() {   //每隔1S则进入一遍此函数
		var data = '';   							//要发送的数据
		for (var i in send) {   					//send数组内有值则格式化至data内  eg:send['feng':0, 'moshi':1],则data = 'feng=0&moshi=1&'
			data += i + '=' + send[i] + '&';
		}
		if (wendu != 0) {  						//wendu不为0则将wendu指令也格式化至data内
			data += 'wendu=';
			data += (wendu > 0) ? ('+' + wendu) : ('-' + (-wendu));
		}
		if (data != '') {   							//data不为空则去掉最后一个‘&’
			if (data[data.length - 1] == '&') data=data.slice(0, data.length - 1);
			//console.log(data);
			$.post('/songxia/end/fn1.php', data + uuid, function(response) {
				if (response != 0) {  				//若得到的response为1说明指令成功得到保存，则将send赋值为空数组，wendu赋值为0,
					send = [];					//否则send和wendu值不变，以便下一次发送
					wendu = 0;
				}
			});
		}
	}, 1000);
	var offTimeInterval = setInterval(function() {        							//10s进行一次定时器的判断
		if (isOff()) offFlag = 0;    													//若为关机，则offFlag总为0
		if (time.html() === '关' && isOn() && offFlag === 0) {     					//开机状态下开启定时器且offFlag为0则赋值offFlag为当前定时时间
			offFlag = new Date();
		}
		if (offFlag !== 0) {   														//若offFlag记录了定时的时间点
			//console.log(offFlag.toLocaleString(), (new Date()).toLocaleString(), offTimeFlag);
			if (getM(new Date(), offFlag) >= offTimeFlag && offTimeFlag !== 0) { //如果从定时时间点到此时的时间大于定时时间
				offImg.hide();
				onImg.show();
				guanji.hide();
				time.html('开');
				offFlag = 0;   													//赋值offFlag为0
			}
			if (offFlag !== 0) guanji.html((offTimeFlag - getM(new Date(), offFlag)) + '分钟');
		}
	}, 10000);
	var wenduInterval = setInterval(function() {    						//1S收一次服务器端存储的wendu
		getWendu(0);
	}, 1000);
	setInterval(function() {    											//10S收一次服务器端存储的wendu，传入参数1检测空调是否与通信子网相连
		getWendu(1);
	}, 20000);
	function isOn() {       												//判断是否是开机状态，是返回true， 否返回false
		return onImg.css('display') === 'none';
	}
	function isOff() {     													//判断是否是关机状态
		return !isOn();
	}
	function getM(dateMax, dateMin) {        							//得到两个时间点的分钟差
		var hour = dateMax.getHours();
		if (dateMax.getDate() < dateMin.getDate()) {
			hour += 24;
		}
		hour -= dateMin.getHours();
		return Number(hour) * 60 + Number(dateMax.getMinutes()) - Number(dateMin.getMinutes());
	}
	function getWendu(flag) {             									//此函数用来读取空调发送给通信子网的wendu值，传入1时进行检测空调是否与通信子网相连
		if (flag) guzhangFlagOld = guzhangFlag;                               		//传入1则记录上次guzhangFlag值，接收的wendu不存在时guzhangFlag=1,反之为0
		$.post('/songxia/end/fn3.php', 'flag=' + flag + uuid, function(response) {
			if (!!response && Number(response) !== 0 && !isNaN(Number(response))) {
				if (flag) guzhangFlag = 0;								//接受到的wendu值存在且合法  则guzhangFlag=0
				if (guzhangFlag != guzhangFlagOld && flag == 1) {         //新旧值不相等说明空调与通信子网又重新连接了，故正常显示
					ul.show();
					p.hide();
				}
				xianshi.html(Number(response));						//刷新wendu显示值
			} else {
				if (flag) guzhangFlag = 1;								//收到的wendu值非法则guzhangFlag=1
				if (guzhangFlag != guzhangFlagOld && flag == 1) {		//新旧值不一样说明空调和通信子网刚刚连接失败,此时显示故障模块
					ul.hide();
					p.show();
				}
			}
		});
	}
})