<?php
	@$fp=fopen("data.txt",'a+');
	if (!$fp) {
		echo 0;
		exit();
	}
	flock($fp, LOCK_EX);
	if (isset($_POST['onOff'])) {
		$onOff = 0 + $_POST['onOff'];
		$int += $onOff;
		fwrite($fp, "onOff"." ".$onOff."\n");
	}
	if (isset($_POST['wendu'])) {
		$wendu = 0 + $_POST['wendu'];
		fwrite($fp, "wendu"." ".$wendu."\n");
		$int += $wendu * 10;
	}
	if (isset($_POST['feng'])) {
		$feng = 0 + $_POST['feng'];
		fwrite($fp, "feng"." ".$feng."\n");
		$int += $feng * 100;
	}
	if (isset($_POST['moshi'])) {
		$moshi = 0 + $_POST['moshi'];
		fwrite($fp, "moshi"." ".$moshi."\n");
		$int += $mosho * 1000;
	}
	if (isset($_POST['chushi'])) {
		$chushi = 0 + $_POST['chushi'];
		fwrite($fp, "chushi"." ".$chushi."\n");
		$int += $chushi * 10000;
	}
	if (isset($_POST['offTime'])) {
		$offTime = 0 + $_POST['offTime'];
		fwrite($fp, "offTime"." ".$offTime."\n");
		$int += $time * 100000;
	}
	echo 1;
	flock($fp, LOCK_UN);
	fclose($fp);
?>
