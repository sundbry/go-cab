<?php

class CabServiceRequest {

	public $id;
	protected $data, $dist;

	function __construct($data) {
		$this->data = $data;
		$this->id = $data['id'];
		$this->distance = null;
		$this->pickupPos = null;
		$this->destPos = null;
	}

	function __toString() {
		return 'csr-'.$this->id;
	}

	/** Trip distance */
	function distance() {
		if(is_null($this->dist)) {
			if($this->pickupPos == null)
				$this->pickupPos = new LatLng($this->data['pickup_latitude'], $this->data['pickup_longitude']);
			if($this->destPos == null)
				$this->destPos = new LatLng($this->data['dest_latitude'], $this->data['dest_longitude']);
			$this->dist = Geometry::distance($this->pickupPos, $this->destPos);
		}
		return $this->dist;
	}

	function roundDistance() {
		return sprintf("%.2f", $this->distance());
	}

	function findServiceOfferings() {
		$offers = array();

		if($this->pickupPos == null)
			$this->pickupPos = new LatLng($this->data['pickup_latitude'], $this->data['pickup_longitude']);

		foreach(CabServiceStation::activeList() as $station) {
			$servicePos = $station->latLng();
			$sdist = Geometry::distance($this->pickupPos, $servicePos);
			if($sdist <= $station->range()) {
				array_push($offers, new CabServiceOffer($station, $this->distance()));
			}
		}

		return $offers;
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
		$q = sprintf("INSERT INTO gc_service_request VALUES(NULL, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%d', '%s', NOW());",
				GCConfig::$db->real_escape_string($post['go-search-dest']), 
				GCConfig::$db->real_escape_string($destGC[0]), 
				GCConfig::$db->real_escape_string($destGC[1]), 
				GCConfig::$db->real_escape_string($post['go-search-pickup']),
				GCConfig::$db->real_escape_string($pickupGC[0]), 
				GCConfig::$db->real_escape_string($pickupGC[1]), 
				GCConfig::$db->real_escape_string($pickupTime),
				GCConfig::$db->real_escape_string($post['go-message-mode']),
				GCConfig::$db->real_escape_string(preg_replace('/D/', '', $post['go-callback-number'])),
				GCConfig::$db->real_escape_string($post['go-message-text']));

		$r = GCConfig::$db->query($q) or die(GCConfig::$db->error);
		$id = GCConfig::$db->insert_id;
		return self::load($id);
	}

	public static function loadCSR($code) {
		$id = intval(str_replace('csr-', '', $code));
		return self::load($id);
	}

	public static function load($id) {
		$q = sprintf("SELECT * FROM gc_service_request WHERE id = %d;", $id);
		$r = GCConfig::$db->query($q) or die(GCConfig::$db->error);
		if($row = $r->fetch_assoc()) {
			return new CabServiceRequest($row);
		}
		return null;
	}

}

?>
