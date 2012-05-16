<?php

/** Go-cab config */
class GCConfig {

	const CLS_PATH = '/home/gocab/html/inc/cls'; 

	public static $dbh = null;

	public static function init() {
		self::$dbh = new mysqli('localhost', 'gocab_app', 'Phnc&^D@z23@%#*$c', 'gocab_app', 3306, "/var/lib/mysql/mysql.sock");
		if(self::$dbh->connect_error) {
			die('Connect Error ('.self::$dbh->connect_errno.') '.self::$dbh->connect_error);
		}
	}

}

?>
