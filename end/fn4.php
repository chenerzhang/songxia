<?php
	if (isset($_POST['id'])) {
		$uuid = $_POST['id'];
	}
	if (isset($_POST['passwd'])) {
		@$fp = fopen($uuid."admin.txt", 'r'); 	//读取指令
	} else {
		echo 0;
	}
	if (!$fp) {
		echo '文件不存在';
		exit();
	}
	while (!feof($fp)) { 					//从文件进行一行一行读取
		$strline = fgets($fp);
		if (strlen($strline) > 1) {  		//若为空行则不进行读取
			break;
		}
	}
	if (trim($strline) == $_POST['passwd']) echo 1;
	else echo 0;
	fclose($fp);
?>