<?
require('inc/init.php');
require('inc/header.php');

$valid = new Validate(array(
	'csr' => VRule::required('Missing service request')));

if(isset($_GET['csr'])) {
	$_POST['csr'] = $_GET['csr'];
}

if($valid->run($_POST) && ($csr = CabServiceRequest::loadCSR($_POST['csr']))) {
	$offers = $csr->findServiceOfferings();

	$pickupLoc = $csr->pickupLocation();

	echo '<div data-role="page" id="go-2">', "\n";
	echo '<input type="hidden" name="pickup-lat" id="pickup-lat" value="', rtrim($pickupLoc->lat, '0'), '" />';
	echo '<input type="hidden" name="pickup-lng" id="pickup-lng" value="', rtrim($pickupLoc->lng, '0'), '" />';
	echo '<ul data-role="listview" data-divider-theme="e" id="service-list">', "\n";
	echo '<li data-role="list-divider"><h2>Go-Cab Taxi Services</h2></li>', "\n";


	foreach($offers as $offer) {
		$rating = $offer->station->rating();

		# absolute positioning used b/c ul-li-aside not working as advertised
		echo '<li style="position: relative;" ', ($offer->hasRefused() ? 'class="refused" data-theme="a"' : 'data-theme="c"'), '><a href="go-3.php?csr=', $csr->__toString(), '&css=', $offer->station->__toString(), '" data-rel="dialog">
			<p class="ul-li-aside" style="position: absolute; right: 10px;"><strong><span class="phone-number" href="tel:+', $offer->station->phoneNumberDigits(), '">', $offer->station->phoneNumber(), '</span></strong></p>
			<p>Cost Estimate: <strong>$', $offer->estPrice(), '</strong> ('.$offer->roundDistance(), ' mi)</p>
			<h3>', htmlentities($offer->station->name()), ($offer->hasRefused() ? ' <span class="refused">(refused service)</span>' : ''), '</h3>';

			for($star = 1; $star <= CabServiceStation::MAX_RATING; $star++) {
				echo '<div class="show-star show-star-', ($rating >= $star ? 'full' : 'empty'), '"></div>';
			}
			echo '&nbsp;&nbsp;<em class="num-ratings">(', $offer->station->numRatings(), ' rating', ($offer->station->numRatings() == 1 ? '' : 's'), ')</em>';
		echo '</a></li>';
	}

	echo '<li data-role="list-divider"><h2>Other Taxi Services</h2></li>', "\n";

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
