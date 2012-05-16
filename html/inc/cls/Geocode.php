<?

class Geocode {

	public $point;

	public function __construct(array $point) {
		$this->point = $point;
	}

	public static function parse($orderedPair) {
		if(preg_match('/\(([\-\.0-9]+),\s([\-\.0-9]+)\)/', $orderedPair, $matches)) {
			return new Geocode(array($matches[1], $matches[2]));
		}
		return null;
	}

}

?>
