<?php

class CabServiceRequest {

	public $id;
	protected $data;

	function __construct($data) {
		$this->data = $data;
		$this->id = $data['id'];
	}

	function __toString() {
		return 'csr-'.$this->id;
	}

	public static function create(array $post) {
		/* post:
			[go-search-dest] => 1 Grand Ave, San Luis Obispo, CA
			[go-search-pickup] => 1050 Monterey St, San Luis Obispo, CA
			[go-datetime-pickup] => 05/15/2012 08:25 PM
			[go-message-mode] => text
			[go-callback-number] =>
			[go-message-text] =>
		*/

		$pickupTime = $post['go-datetime-pickup'];
		$destGC = Geocode::parse($post['go-search-dest-gc'])->point;
		$pickupGC = Geocode::parse($post['go-search-pickup-gc'])->point;
		$q = sprintf("INSERT INTO cab_service_request VALUES(NULL, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', NOW());",
				GCConfig::$dbh->real_escape_string($post['go-search-dest']), 
				GCConfig::$dbh->real_escape_string($destGC[0]), 
				GCConfig::$dbh->real_escape_string($destGC[1]), 
				GCConfig::$dbh->real_escape_string($post['go-search-pickup']),
				GCConfig::$dbh->real_escape_string($pickupGC[0]), 
				GCConfig::$dbh->real_escape_string($pickupGC[1]), 
				GCConfig::$dbh->real_escape_string($pickupTime),
				GCConfig::$dbh->real_escape_string($post['go-message-mode']),
				GCConfig::$dbh->real_escape_string(preg_replace('/D/', '', $_post['go-callback-number'])),
				GCConfig::$dbh->real_escape_string($post['go-message-text']));

				die($q);

		$r = GCConfig::$dbh->query($q);
		$id = GCConfig::$dbh->insert_id;
		return self::load($id);
	}

	public static function loadCSR(string $code) {
		$id = intval(str_replace('csr-', '', $code));
		return self::load($id);
	}

	public static function load($id) {
		$q = sprintf("SELECT * FROM cab_service_request WHERE id = %d;", $id);
		$r = GCConfig::$dbh->query($q) or die(GCConfig::$dbh->error);
		if($row = $r->fetch_assoc()) {
			return new CabServiceRequest($row);
		}
		return null;
	}

}

?>
