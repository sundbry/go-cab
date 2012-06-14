<!DOCTYPE html>
<html>
<head>
<title>GoCab - Start</title>
<link rel="stylesheet" href="css/gocab.css?nocache=<?=time();?>" />
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.css" />
<link rel="stylesheet" href="css/mobiscroll.css" />
<link rel="stylesheet" href="css/jquery.rating.css" />
<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
<script src="http://code.jquery.com/mobile/1.1.0/jquery.mobile-1.1.0.min.js"></script>
<script src="js/mobiscroll.js"></script>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?key=<?=GCConfig::GOOGLE_MAPS_KEY;?>&sensor=true&libraries=places"></script>
<script type="text/javascript" src="js/jquery.rating.pack.js"></script>
<script type="text/javascript" src="js/gocab.js?nocache=<?=time();?>"></script>
<script type="text/javascript">
	gocab.googleMapsKey = '<?=GCConfig::GOOGLE_MAPS_KEY;?>';
	gocab.googleMapsServerKey = '<?=GCConfig::GOOGLE_MAPS_SERVER_KEY;?>';
</script>
</head>
<body>
