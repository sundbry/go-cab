<?
require('inc/init.php');
require('inc/header.php');

$valid = new Validate(array(
	'order' => VRule::required('Missing order number')));

if(isset($_GET['order'])) {
	$_POST['order'] = $_GET['order'];
}

if($valid->run($_POST)
	&& $order = CabServiceOrder::loadOrder($_POST['order'])) {

	$company = $order->station();

	switch($order->dispatchStatus()) {
		case 'accept':
			?>
				<div data-role="page" id="go-4-accept" class="go-4">
				<input type="hidden" name="order-number" id="order-number" value="<?=$order->__toString();?>" />
				<input type="hidden" name="csr-hash" id="csr-hash" value="<?=$order->request()->__toString();?>" />
				<div class="pad">
					<h1>Order Accepted</h1>
					<dl class="dispatch-info">
						<dt>Pick-up E.T.A.</dt>
						<dd><?=htmlentities($order->eta());?></dd>
						<dt>Company</dt>
						<dd><?=htmlentities($company->name());?></dd>
						<dt>Phone Number</dt>
						<dd><a href="tel:+<?=$company->phoneNumberDigits();?>"><?=htmlentities($company->phoneNumber());?></a></dd>
					</dl>
				<?
					if($order->hasDispatchMessage()) {
						echo '<dl class="dispatch-message">
						<dt>Dispatcher Message</dt>
						<dd>', htmlentities($order->dispatchMessage()), '</dd>
						</dl>';
					}
				?>
					<div class="ui-grid-a">
						<div class="ui-block-a go-4-arrived">
							<a data-role="button" data-theme="e" data-icon="star" href="go-5.php?order=<?=$order->__toString();?>">Cab Arrived</a>
						</div>
						<div class="ui-block-b go-4-abort">
							<a data-role="button" data-theme="a" data-icon="delete">Cancel Order</a>
						</div>
					</div>
				</div>
				</div>
			<?
			break;

		case 'reject':
			?>
			<div data-role="page" id="go-4-reject" class="go-4">
			<div data-role="header"><h1>Sorry</h1></div>
			<div data-role="content">
				<dl class="refused-dispatcher-message">
					<dt>Company</dt>
					<dd><?=htmlentities($company->name());?></dd>
					<dt>Your order was refused for the following reason:</dt>
					<dd><?=$order->hasDispatchMessage() ? htmlentities($order->dispatchMessage()) : 'No reason indicated.';?></dd>
				</dl>
				<div style="text-align: center;">
					<a data-role="button" data-icon="back" data-theme="a" href="go-2.php?csr=<?=$order->request()->__toString();?>">Back</a>
				</div>
			</div>
			</div>
			<?
			break;

		default:
		case 'wait':
			echo "Error";

			break;
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
