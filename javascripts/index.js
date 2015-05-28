$(function() {
	var passwd = $('#passwd')
	    , submit = $('#submit');
    	submit.on('click', function() {
    		if (passwd.val() !== '') {                                                                                     //判断密码是否为空
    			$.post('/songxia/end/fn4.php', {'passwd': passwd.val()}, function(res) {
    				if (res == 1) {                                                                           //口令一直返回1
    					sessionStorage.setItem('admin', passwd.val())       //保存登陆状态，重定向到phone.html
    					window.location = '/songxia/phone.html';
    				} else {
    					passwd.val('');                                                            //清空重新输入
    					alert('口令错误，请重新输入!');
    				}
    			});
    		} else {
    			alert('请输入口令！');
    		}
    	});
})