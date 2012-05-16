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

	/** Validate a date-time string
	 * format: mm/dd/yyyy hh:mm xm
	 */
	public static function futureDatetime($err) {
		return new VRule(function($val) {
			$t = strtotime($val);
			return $t >= time();
		/*
			$parts0 = explode(' ', trim($val));
			if(count($parts0) != 3)
				return false;

			$date = $parts0[0];
			$time = $parts0[1];
			$period = $parts0[2];

			$partsd = explode('/', $date);
			if(count($partsd) != 3) 
				return false;

			if(($partsd[0] >= 1 && $partsd[0] <= 31)
				&& ($partsd[1] < 
				*/


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
	
}

?>
