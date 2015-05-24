<?php
	@$fpw = fopen("wendu.txt", 'w');     //以覆盖方式写入wendu值
	if (!$fpw) {
		echo 0;
		exit();
	}
	//flock($fpw, LOCK_EX);
	if (isset($_POST['wendu'])) {
		fwrite($fpw, $_POST['wendu']);
	}
	//flock($fpw, LOCK_UN);
	fclose($fpw);
	@$fp = fopen("data.txt", 'r+'); //读取指令
	if (!$fp) {
		echo 0;
		exit();
	}
	$data = '';
	while (!feof($fp)) { //从文件进行一行一行读取
		$strline = fgets($fp);
		if (strlen($strline) > 3) {  //若为空行则不进行读取
			$arr = preg_split('/\s/', $strline);
			$data .= $arr[0].'='.$arr[1].'&';    //eg:$strline = 'wendu 5' 则 $data .= ‘wendu=5&’
		}
	}
	if (strlen($data) > 1) {   //若$data不为空则去掉最后一个'&'
		$data = substr($data, 0, strlen($data) - 1);
	}
	if (flock($fp, LOCK_EX)) {//加写锁
		ftruncate($fp, 0); // 将文件截断到给定的长度
		rewind($fp); // 倒回文件指针的位置
		fwrite($fp, '');//  将文件内容清空，避免重复读
		flock($fp, LOCK_UN); //解锁
	}
	fclose($fp);
	echo $data;  //输出数据
?>