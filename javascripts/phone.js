$(function() {
	var send = [];
	var onOff = $('#switch');
	onOff.on('click', function(e) {
		onOff.html(onOff.html() === '开' ? '关' : '开');
		send['onOff'] = (onOff.html() === '开' ? 0 : 1);
		//send.push('onOff' + (onOff.html() === '开' ? 0 : 1));
	})
	var wendu = 0;
	var up = $('#up');
	up.on('click', function() {
		wendu++;
	})
	var down = $('#down');
	down.on('click', function() {
		wendu--;
	})
	var feng = $('#feng');
	feng.on('click', function() {
		feng.html(feng.html() === '左右扫风' ? '上下扫风' : '左右扫风');
		send['feng'] = (feng.html() === '左右扫风' ? 1 : 0);
		//send.push('feng' + (feng.html() === '左右扫风' ? 1 : 0));
	});
	var moshi = $('#moshi');
	moshi.on('click', function() {
		moshi.html(moshi.html() === '制冷' ? '制热' : '制冷');
		send['moshi'] = (moshi.html() === '制冷' ? 1 : 0);
		//send.push('moshi' + (moshi.html() === '制冷' ? 1 : 0));
	});
	var chushi = $('#chushi');
	chushi.on('click', function() {
		chushi.html(chushi.html() === '开' ? '关' : '开');
		send['chushi'] = (chushi.html() === '关' ? 1 : 0);
		//send.push('chushi' + (chushi.html() === '关' ? 1 : 0));
	});
	var time = $('#time');
	time.on('click', function(e) {
		time.html(time.html() === '开' ? '关' : '开');
		if (time.html() === '关') {
			timeTrigger.show();
		} else {
			send['offTime'] = 0;
			timeTrigger.hide();
		}
	});
	var timeTrigger = $('#timeTrigger');
	var offTime = $('#offTime');
	var oldOffTime = 0;
	var offTimeCheck = $('#offTimeCheck');
	offTimeCheck.on('click', function() {
		if (time.html() === '关') {
			if (Number(offTime.val()) == 0) {
				alert('请重新输入定时时间');
			} else {
				//send.push('time' + offTime.val());
				//send['time'] = offTime.val();
				send['offTime'] = offTime.val() || 0;
				timeTrigger.hide();
			}
		}
	})
	setInterval(function() {
		var data = '';
		// for (var i = 0, len = send.length; i < len; i++) {
		// 	if (send[i][0] !== 't') {
		// 		data += send[i].slice(0, send[i].length - 1) + '=' + send[i][send[i].length - 1] + '&';
		// 	} else {
		// 		data += send[i].slice(0, 4) + '=' + send[i].slice(4) + '&';
		// 	}
		// }
		for (var i in send) {
			data += i + '=' + send[i] + '&';
			// if (i[0] !== 't') {
			// 	data += i + '=' + send[i] + '&';
			// } else {
			// 	data += i.slice(0, 4) + '=' + send[i] + '&';
			// }
		}
		if (wendu != 0) {
			data += 'wendu=';
			data += (wendu > 0) ? ('+' + wendu) : ('-' + (-wendu));
		}
		if (data != '') {
			if (data[data.length - 1] == '&') data=data.slice(0, data.length - 1);
			console.log(data);
			$.post('/songxia/fn1.php', data, function(response) {
				if (response != 0) {
					send = [];
					wendu = 0;
				}
			});
		}
	}, 1000);
})