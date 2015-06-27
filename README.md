# songxia
参加松下电器的一个比赛的程序
其中phone.html用来在手机端模拟空调遥控器，具备发送指令到服务器功能
air.html用来在电脑端模拟空调，收到指令后完成相应动作
在URL后添加GET参数id=x表示用来空调x，如phone.html?id=1和air.html?id=1 暂时只有id为1或id为2
id=1的密码为admin1,id=2的密码为admin2，想创建新id可在end目录下新建xadmin.txt文件，并输入口令
fn1.php用来接收phone.html发送的指令并且保存到data.txt内
fn2.php用来存储wendu值值wendu.txt内，然后读取data.txt内的指令并通过air.html发送的ajax请求回指令
fn3.php用来读取wendu.txt内的wendu值
fn4.php用来验证口令
