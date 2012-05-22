<?php

/** Go-cab config */
class GCConfig {

	const CLS_PATH = '/home/gocab/html/inc/cls'; 

	public static $db = null;

	public static function init() {
		self::$db = new mysqli('localhost', 'gocab_app', 'Phnc&^D@z23@%#*$c', 'gocab_app', 3306, "/var/lib/mysql/mysql.sock");
		if(self::$db->connect_error) {
			die('Connect Error ('.self::$db->connect_errno.') '.self::$db->connect_error);
		}
	}

}

?>
