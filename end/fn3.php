<?php
	if (isset($_POST['id'])) {
		$uuid = $_POST['id'];
	}
	$wendu = isset($_POST['wendu']) ? $_POST['wendu'] : 20;
	$flag = isset($_POST['flag']) && $_POST['flag'] == '0';
	for($i = 0; $i < 20; $i++) {
		if ($flag) {
			@$fp = fopen($uuid."wendu.txt", 'r'); 		//收到flag=0则以只读模式读取指令
		} else {
			@$fp = fopen($uuid."wendu.txt", 'r+'); 	//反之以读写模式读取指令
		}
		if (!$fp) {
			echo 0;
			exit();
		}
		while (!feof($fp)) { 						//从文件进行一行一行读取
			$strline = fgets($fp);
			break;
		}
		//在读写模式下清空文件内容
		if (!$flag && flock($fp, LOCK_EX)) {				//加写锁
			ftruncate($fp, 0); 					// 将文件截断到给定的长度
			rewind($fp); 						// 倒回文件指针的位置
			fwrite($fp, '');						//  将文件内容清空，避免重复读
			flock($fp, LOCK_UN); 				//解锁
		}
		fclose($fp);
		if (strlen($strline) > 1 && trim($wendu) != (0 + trim($strline))) {  			//若为空行则不进行读取
			echo  $strline;
			exit();
		} else {
			sleep(1);
			continue;
		}
	}
?>