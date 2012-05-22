<?php

class Geometry {

	const RADIUS_EARTH = 3963.2; # miles

	/** Calculate the distance in miles between two points */
	static function distance(LatLng $a, LatLng $b) {
		// http://mathforum.org/library/drmath/view/54680.html
		$c = (sin($a->rlat) * sin($b->rlat))
			+ (cos($a->rlng - $b->rlng) * cos($a->rlat) * cos($b->rlat));
		return self::RADIUS_EARTH * acos($c);
	}

}

?>
