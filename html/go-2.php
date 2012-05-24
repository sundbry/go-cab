<?
require('inc/init.php');
require('inc/header.php');

$valid = new Validate(array(
	'continue' => VRule::required('Missing service request')));

if(isset($_GET['continue'])) {
	$_POST['continue'] = $_GET['continue'];
}

if($valid->run($_POST) && ($csr = CabServiceRequest::loadCSR($_POST['continue']))) {
	$offers = $csr->findServiceOfferings();

	echo '<div data-role="page" id="go-2">', "\n";
	echo '<h4>Trip distance: ', $csr->roundDistance(), " mi</h4>\n";
	echo '<ul data-role="listview">', "\n";

	foreach($offers as $offer) {
		$rating = $offer->station->rating();

		# absolute positioning used b/c ul-li-aside not working as advertised
		echo '<li style="position: relative;"><a href="go-3.php?csr=', $csr->__toString(), '&css=', $offer->station->__toString(), '" data-rel="dialog">
			<p class="ul-li-aside" style="position: absolute; right: 10px;"><strong><span class="phone-number" href="tel:+', $offer->station->phone(), '">', $offer->station->fancyPhone(), '</span></strong></p>
			<p>Cost Estimate: <strong>$', $offer->estPrice(), '</strong> ('.$offer->roundDistance(), ' mi)</p>
			<h3>', htmlentities($offer->station->name()), '</h3>';

			echo '<p>';
			for($star = 0; $star < 5; $star++) {
				echo '<div class="show-star show-star-', ($rating >= $star ? 'full' : 'empty'), '"></div>';
			}
			echo '</p>';
		echo '</a></li>';
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
