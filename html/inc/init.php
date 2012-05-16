<?

/* Load go-cab config & libraries */

date_default_timezone_set('America/Los_Angeles');

function __autoload($className) {
	require(GCConfig::CLS_PATH.'/'.str_replace('.', '', $className).'.php');
}

require('cls/GCConfig.php');
GCConfig::init();

?>
