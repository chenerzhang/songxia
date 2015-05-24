<?php
	// @$fpw = fopen("wendu.txt", 'w');
	// if (!$fpw) {
	// 	echo 0;
	// 	exit();
	// }
	// //flock($fpw, LOCK_EX);
	// if (isset($_POST['wendu'])) {
	// 	fwrite($fpw, $_POST['wendu']);
	// }
	// //flock($fpw, LOCK_UN);
	// fclose($fpw);
	@$fp = fopen("data.txt", 'r+');
	if (!$fp) {
		echo 0;
		exit();
	}
	$data = '';
	while (!feof($fp)) {
		$strline = fgets($fp);
		if (strlen($strline) > 3) {
			$arr = preg_split('/\s/', $strline);
			$data .= $arr[0].'='.$arr[1].'&';
		}
	}
	if (strlen($data) > 1) {
		$data = substr($data, 0, strlen($data) - 1);
	}
	if (flock($fp, LOCK_EX)) {//加写锁
		ftruncate($fp, 0); // 将文件截断到给定的长度
		rewind($fp); // 倒回文件指针的位置
		fwrite($fp, '');// @chmod($path,0644);
		flock($fp, LOCK_UN); //解锁
	}
	fclose($fp);
	echo $data;
?>