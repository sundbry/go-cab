<?

/** A Validation rule */
class VRule {

	private $test, $message;

	/** Construct a rule from a boolean function and an error message */
	function __construct($func, $msg) {
		$this->test = $func;
		$this->msg = $msg;
	}

	public function test($val) {
		return call_user_func($this->test, $val);
	}

	public function errorMessage() {
		return $this->msg;
	}

	/* General purpose rules */

	public static function intval($err) {
		return new VRule(function($val) {
			return preg_replace('/\D/', '', $val) == $val;
		}, $err);
	}

	/** Validate a latitude */
	public static function latitude($err) {
		return new VRule(function($val) {
			return is_numeric($val);
		}, $err);
	}

	public static function longitude($err) {
		return new VRule(function($val) {
			return is_numeric($val);
		}, $err);
	}

	/** Validate a phone number */
	public static function phone($err) { 
		return new VRule(function($val) {
			return preg_match('/(\d{10,})/', preg_replace('/\D/', '', $val)) > 0;
		}, $err);
	}

	/** Require a non-empty field */
	public static function required($err) {
		return new VRule(function($val) {
			$val = trim($val);
			return !empty($val);
		}, $err);
	}

	public static function stateCode($err) {
		return new VRule(function($val) {
			return strlen($val) == 2;
		}, $err);
	}
	
}

?>
