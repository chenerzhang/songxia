<?php
	@$fp = fopen("wendu.txt", 'r'); //读取指令
	if (!$fp) {
		echo 0;
		exit();
	}
	while (!feof($fp)) { //从文件进行一行一行读取
		$strline = fgets($fp);
		if (strlen($strline) > 1) {  //若为空行则不进行读取
			echo  $strline;
		}
	}
	fclose($fp);
?>