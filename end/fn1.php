<?php
	@$fp=fopen("data.txt",'a+'); 	 //以追加形式写入data.txt
	//访问文件失败则输出0
	if (!$fp) {
		echo 0;
		exit();
	}
	//防止重复写加锁
	flock($fp, LOCK_EX);
	//往data.txt里面写入指令
	if (isset($_POST['onOff'])) {
		$onOff = 0 + $_POST['onOff'];
		fwrite($fp, "onOff"." ".$onOff."\n");
	}
	if (isset($_POST['wendu'])) {
		$wendu = 0 + $_POST['wendu'];
		fwrite($fp, "wendu"." ".$wendu."\n");
	}
	if (isset($_POST['feng'])) {
		$feng = 0 + $_POST['feng'];
		fwrite($fp, "feng"." ".$feng."\n");
	}
	if (isset($_POST['moshi'])) {
		$moshi = 0 + $_POST['moshi'];
		fwrite($fp, "moshi"." ".$moshi."\n");
	}
	if (isset($_POST['chushi'])) {
		$chushi = 0 + $_POST['chushi'];
		fwrite($fp, "chushi"." ".$chushi."\n");
	}
	if (isset($_POST['offTime'])) {
		$offTime = 0 + $_POST['offTime'];
		fwrite($fp, "offTime"." ".$offTime."\n");
	}
	//指令成功写入输出1
	echo 1;
	//解锁
	flock($fp, LOCK_UN);
	fclose($fp);
?>
