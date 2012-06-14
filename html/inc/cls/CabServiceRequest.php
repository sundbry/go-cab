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
			$this->dist = Geometry::earthDistance($this->pickupLocation(), $this->destLocation());
		}
		return $this->dist;
	}

	function pickupAddress() {
		return $this->data['pickup_address'];
	}

	function pickupDate($fmt) {
		return date($fmt, strtotime($this->data['pickup_time']));
	}

	function pickupLocation() {
		if($this->pickupPos == null)
			$this->pickupPos = new LatLng($this->data['pickup_latitude'], $this->data['pickup_longitude']);
		return $this->pickupPos;
	}

	function destAddress() {
		return $this->data['dest_address'];
	}

	function destLocation() {
		if($this->destPos == null)
			$this->destPos = new LatLng($this->data['dest_latitude'], $this->data['dest_longitude']);
		return $this->destPos;
	}

	function phoneNumber() {
		return $this->data['callback_number'];
	}

	function phoneNumberDigits() {
		return preg_replace('/\D/', '', $this->data['callback_number']);
	}

	function hasMessage() {
		return !empty($this->data['message_text']);
	}

	function message() {
		return $this->data['message_text'];
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
			$sdist = Geometry::earthDistance($this->pickupPos, $servicePos);
			if($sdist <= $station->range()) {
				array_push($offers, new CabServiceOffer($this, $station));
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

		$pickupTime = strtotime($post['go-datetime-pickup']);
		$pickupDateTime = date('Y-m-d H:i:s', $pickupTime);
		$dest = LatLng::parseGeocode($post['go-search-dest-gc']);
		$pickup = LatLng::parseGeocode($post['go-search-pickup-gc']);
		$q = sprintf("INSERT INTO gc_service_request VALUES(NULL, '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', NOW());",
				GCConfig::$db->real_escape_string($post['go-search-pickup']),
				GCConfig::$db->real_escape_string($pickup->lat), 
				GCConfig::$db->real_escape_string($pickup->lng), 
				GCConfig::$db->real_escape_string($post['go-search-dest']), 
				GCConfig::$db->real_escape_string($dest->lat), 
				GCConfig::$db->real_escape_string($dest->lng), 
				GCConfig::$db->real_escape_string($pickupTime),
				GCConfig::$db->real_escape_string($post['go-message-mode']),
				GCConfig::$db->real_escape_string($post['go-callback-number']),
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
