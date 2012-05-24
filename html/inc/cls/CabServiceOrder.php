<?php

class CabServiceOrder {

	public $id;
	protected $data, $csr, $station;

	function __construct($row) {
		$this->data = $row;
		$this->id = $row['id'];
		$this->csr = null;
		$this->station = null;
	}

	function __toString() {
		return 'order-'.$this->id;
	}

	/** @return 'accept', 'reject', or 'wait' */
	function dispatchStatus() {
		return 'accept';	
	}

	/** Is this order waiting for a dispatcher action
	 * @return bool
	 */
	function dispatchWaiting() {
		return false;
	}

	public static function create(CabServiceRequest $csr, CabServiceStation $station) {
		$q = sprintf("INSERT INTO gc_service_order VALUES(NULL, %d, %d, NOW());",
			$csr->id, $station->id);
		$r = GCConfig::$db->query($q) or die(GCConfig::$db->error);
		$id = GCConfig::$db->insert_id;
		return self::load($id);
	}

	public static function load($id) {
		$q = sprintf("SELECT * FROM gc_service_order WHERE id = %d;", $id);
		$r = GCConfig::$db->query($q) or die(GCConfig::$db->error);
		if($row = $r->fetch_assoc()) {
			return new CabServiceOrder($row);
		}
		return null;
	}

	public static function loadOrder($code) {
		$id = intval(str_replace('order-', '', $code));
		return self::load($id);
	}

}

?>
