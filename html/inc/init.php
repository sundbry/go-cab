<?

/* Load go-cab config & libraries */

date_default_timezone_set('America/Los_Angeles');

function __autoload($className) {
	require(GCConfig::CLS_PATH.'/'.str_replace('.', '', $className).'.php');
}

/** Filter strings so they are safe from cross-site scripting attacks */
function xssSafe($str) {
	// used for tokens like csr-123 css-12434 etc, so the alphabet is limited
	return preg_replace('/[^a-zA-Z0-9\s\-\_]/', '', $str);
}

require('cls/GCConfig.php');
GCConfig::init();

?>
