$(function() {
	var onOff = $('#switch')
		, wendu = $('#wendu')
		, feng = $('#feng')
		, moshi = $('#moshi')
		, time = $('#time')
		, chushi = $('#chushi')
		, offTime = $('#offTime')
		, timeTrigger = $('#timeTrigger');
	var timeFlag = 0;
	var data = init();
	check();
	print();
	var send = 'wendu=' + wendu.html();
	setInterval(function() {
		$.post('/songxia/fn2.php', send, function(response) {
			if (response !== '') {
				var resarr = getData(response);
				if ((data['onOff'] == 1) || (data['onOff'] == 0 && resarr['onOff'] == 1)) {
					for (var i in resarr) {
						if (i != 'wendu')  data[i] = resarr[i];
						else data[i] = Number(resarr[i]) + Number(data[i]);
					}
					check(1);
					print();
				} else {
					data['onOff'] = 0;
					onOff.html("关");
				}
				setCookie(data);
			}
		})
	}, 1000);
	setInterval(function() {
		check(1);
		print();
	}, 30000);
	function init() {
		var data = [], cookie = '', index, val, ind;
		if (!document.cookie) {
			document.cookie = 'onOff=0&wendu=20&feng=0&moshi=0&chushi=0&time=0&offTime=0';
		}
		cookie = document.cookie;
		cookie = cookie.split('&');
		for (var i in cookie) {
			ind = cookie[i].indexOf('=');
			index = cookie[i].slice(0, ind);
			val = cookie[i].slice(ind + 1);
			data[index] = val;
		}
		return data;
	}
	function print() {
		if (data['time'] == 1) {
			//console.log((new Date()).toLocaleTimeString(), timeFlag.toLocaleTimeString(), getM(new Date(), timeFlag), data['time'], data['offTime']);
			if (getM(new Date(), timeFlag) >= data['offTime']) {
				data['onOff'] = data['time'] = data['offTime'] = timeFlag = 0;
			}
		}
		onOff.html(data['onOff'] == 0 ? '关' : '开');
		wendu.html(data['wendu']);
		feng.html(data['feng'] == 0 ? '左右扫风' : '上下扫风');
		moshi.html(data['moshi'] == 0 ? '制冷' : '制热');
		chushi.html(data['chushi'] == 0 ? '关' : '开');
		time.html(data['time'] == 0 ? '关' : '开');
		if (data['time'] == 1) offTime.html(data['offTime'] - getM(new Date(), timeFlag));
		if (data['time'] == 1) timeTrigger.show();
		else timeTrigger.hide();
	}
	function getData(response) {
		var data = [], arr = response.split('&'), temp = [];
		for (var i = arr.length - 1; i > -1; i--) {
			temp = arr[i].split('=');
			data[temp[0]] = temp[1];
		}
		return data;
	}
	function check() {
		data['wendu'] = data['wendu'] > 32 ? 32 : (data['wendu'] < 16 ? 16 : data['wendu']);
		if (data['offTime'] > 0) data['time'] = 1;
		else data['time'] = 0;
		if (data['time'] == 0) data['offTime'] = timeFlag = 0;
		else {
			//console.log(data['time'], data['offTime']);
			if (timeFlag == 0) timeFlag = new Date();
		}
	}
	function getM(dateMax, dateMin) {
		var hour = dateMax.getHours();
		if (dateMax.getDate() < dateMin.getDate()) {
			hour += 24;
		}
		hour -= dateMin.getHours();
		return Number(hour) * 60 + Number(dateMax.getMinutes()) - Number(dateMin.getMinutes());
	}
	function setCookie(data) {
		var cookie = '';
		for (var i in data) {
			cookie += i + '=' +data[i] + '&';
		}
		cookie = cookie.slice(0, cookie.length - 1);
		document.cookie = cookie;
	}
})