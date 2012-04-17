<?php
	$session = curl_init($_GET['url']);
	curl_setopt($session, CURLOPT_HEADER, false);
	curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($session, CURLOPT_FOLLOWLOCATION, true);
	$data = curl_exec($session); 
	echo $data;
	curl_close($session);
?>