<?
require('inc/init.php');
require('inc/header.php');

$valid = new Validate(array(
	'continue' => VRule::required('Missing service request')));

if(isset($_GET['continue'])) {
	$_POST['continue'] = $_GET['continue'];
}

if($valid->run($_POST) && $csr = CabServiceRequest::loadCSR($_POST['continue'])) {
	$offers = $csr->findServiceOfferings();

	echo '<div data-role="page" id="go-2">', "\n";
	echo '<h4>Trip distance: ', $csr->roundDistance(), " mi</h4>\n";
	echo '<ul data-role="listview">', "\n";

	foreach($offers as $offer) {
		echo '<li><a href="go-3.html">
			<p class="ul-li-aside">Cost Estimate: <strong>$', $offer->estPrice(), '</strong> ('.$offer->distance(), ' mi)</p>
			<h3>', htmlentities($offer->station->name()), '</h3>
			<p><strong><a href="tel:+', $offer->station->phone(), '">', $offer->station->fancyPhone(), '</a></strong></p>
		</a></li>';
		
	}

	echo "</ul>\n";

	echo "</div>\n";
	/*
	?>
	<h2>Taxi Service Providers</h2>
	<ul data-role="listview">
		<li><a href="go-3.html?cab=1">
			<p class="ul-li-aside">Cost Estimate: <strong>$9.35</strong></p>
			<h3>Beach Cities Cab Co</h3>
			<p><strong>(805) 543-1234</strong></p>
		</a></li>
		<li><a href="go-3.html?cab=2">
			<p class="ul-li-aside">Cost Estimate: <strong>$9.75</strong></p>
			<h3>234 Taxi</h3>
			<p><strong>(805) 555-5555</strong></p>
		</a></li>
	</ul>
	</div>
	<?
	*/
}
else {
	?>
	<script type="text/javascript">
		gocab.error('<?=$valid->hasError() ? $valid->firstErrorMessage() : 'Invalid service request';?>');
	</script>
	<?
}
?>
<?
require('inc/footer.php');
?>
