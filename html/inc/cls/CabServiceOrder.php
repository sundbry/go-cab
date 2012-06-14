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

	/** Customer aborted their order */
	function abort() {
		$q = sprintf("UPDATE gc_service_order SET `status` = 'abort' WHERE id = %d;",
			$this->id);
		$r = GCConfig::$db->query($q);
		$this->data['status'] = 'abort';
	}

	function accept() {
		$q = sprintf("UPDATE gc_service_order SET `status` = 'accept' WHERE id = %d;",
			$this->id);
		$r = GCConfig::$db->query($q);
		$this->data['status'] = 'accept';
	}

	function reject() {
		$q = sprintf("UPDATE gc_service_order SET `status` = 'reject' WHERE id = %d;",
			$this->id);
		$r = GCConfig::$db->query($q);
		$this->data['status'] = 'reject';
	}

	/** @return 'accept', 'reject', or 'wait' */
	function dispatchStatus() {
		return $this->data['status'];
	}

	function request() {
		if(is_null($this->csr)) {
			$this->csr = CabServiceRequest::load($this->data['csr_id']);
		}
		return $this->csr;
	}

	function hasDispatchMessage() {
		return !empty($this->data['dispatch_message']);
	}

	function dispatchMessage() {
		return $this->data['dispatch_message'];
	}

	/** Is this order waiting for a dispatcher action
	 * @return bool
	 */
	function dispatchWaiting($resync = false) {
		if($resync) {
			$q = sprintf("SELECT `status` FROM gc_service_order WHERE id = %d;",
				$this->id);
			$r = GCConfig::$db->query($q);
			$row = $r->fetch_row();
			$this->data['status'] = $row[0];
		}
		return $this->data['status'] == 'wait';
	}

	function eta() {
		return $this->data['eta'];
	}

	function setEta($eta) {
		$q = sprintf("UPDATE gc_service_order SET `eta` = '%s' WHERE id = %d;",
			GCConfig::$db->real_escape_string($eta), $this->id);
		$r = GCConfig::$db->query($q);
		$this->data['eta'] = $eta;
	}

	function station() {
		if(is_null($this->station)) {
			$this->station = CabServiceStation::load($this->data['css_id']);
		}
		return $this->station;
	}

	function addDispatchMessage($msg) {
		$q = sprintf("UPDATE gc_service_order SET `dispatch_message` = '%s' WHERE id = %d;",
			GCConfig::$db->real_escape_string($msg), $this->id);
		$r = GCConfig::$db->query($q);
		$this->data['dispatch_message'] = $msg;
	}

	public static function create(CabServiceRequest $csr, CabServiceStation $station) {
		$q = sprintf("INSERT INTO gc_service_order VALUES(NULL, %d, %d, NOW(), 'wait', NULL, NULL);",
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
