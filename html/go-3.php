<?
require('inc/init.php');
require('inc/header.php');

$valid = new Validate(array(
	'csr' => VRule::required('Missing service request'),
	'css' => VRule::required('Missing service station')));

if(isset($_GET['csr'])) {
	$_POST['csr'] = $_GET['csr'];
}

if(isset($_GET['css'])) {
	$_POST['css'] = $_GET['css'];
}

if(isset($_GET['confirm'])) {
	$_POST['confirm'] = $_GET['confirm'];
}

if($valid->run($_POST)
	&& ($csr = CabServiceRequest::loadCSR($_POST['csr']))
	&& ($station = CabServiceStation::loadCSS($_POST['css']))) {

	if(isset($_POST['confirm']) && intval($_POST['confirm']) == 1) {
		$order = CabServiceOrder::create($csr, $station);

		$estWaitTime = $station->estimatedDispatchResponseTime();
		$estWait = sprintf("%d:%02d", floor($estWaitTime / 60), $estWaitTime % 60);

		echo '<div data-role="page" id="go-3" data-close-btn-text="Cancel">
			<input type="hidden" name="order-number" id="order-number" value="', $order->__toString(), '" />
			<div data-role="header"><h1>Waiting for Dispatcher</h1></div>
			<div data-role="content">
				<h3>Please wait while the dispatcher processes your order.</h3>
				<h3><em>', htmlentities($station->name()), '</em></h3>
				<div class="ui-grid-a">
					<div class="ui-block-a" style="text-align: center;">
						<img src="/img/loading-bar-circle.gif" />
					</div>
					<div class="ui-block-b">
						Waiting Time: <span id="waiting-time">0:00</span><br />
						Estimated Wait Time: <span id="average-waiting-time">', $estWait, '</span>
					</div>
				</div>
				<div class="go-3-abort">
					<button type="button" value="cancel" data-icon="back">Cancel</button>
				</div>
			</div>
		</div>';
	}

	else {
		echo '<div data-role="page" id="go-3-confirm" data-close-btn-text="Cancel">
			<div data-role="header"><h1>Confirm your order</h1></div>
			<div data-role="content">
				<h3>Please confirm your order.</h3>
				<h3><em>', htmlentities($station->name()), '</em></h3>
				<h4>Pickup: <em>', htmlentities($csr->pickupAddress()), '</em></h4>
				<h4>Pickup Time: <em>', $csr->pickupDate('F j \a\t h:i a'), '</em></h4>
				<div class="ui-grid-a">
					<div class="ui-block-a go-3-confirm">
						<a href="go-3.php?csr=', xssSafe($_POST['csr']), '&css=', xssSafe($_POST['css']), '&confirm=1" data-role="button" data-theme="b" data-icon="check" data-rel="dialog">Confirm</a>
					</div>
					<div class="ui-block-b go-3-abort">
						<button type="button" value="cancel" data-icon="back">Cancel</button>
					</div>
				</div>
			</div>
		</div>';
	}
}
else {
	?>
	<script type="text/javascript">
		gocab.error('<?=$valid->hasError() ? $valid->firstErrorMessage() : 'Invalid request';?>');
	</script>
	<?
}
?>
<?
require('inc/footer.php');
?>
