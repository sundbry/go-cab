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

	echo '<div data-role="page" id="go-5"><div class="pad">';

	if(isset($_POST['rating'])) {
		$company->addRating($_POST['rating']);
		?>
		<script type="text/javascript">
			$.mobile.changePage("/");
		</script>
		<?
	}

	else {
		switch($order->dispatchStatus()) {
			case 'accept':
				?>
				<form method="post" action="go-5.php">
				<input type="hidden" name="order" value="<?=$order->__toString();?>" />
				<h2>Please rate your service.</h2>
				<h3><?=htmlentities($company->name());?></h3>
				<div class="rating-ctnr">
					<?
					for($i = 0; $i < CabServiceStation::MAX_RATING; $i++) { 
						echo '<input name="rating" type="radio" class="star" data-role="none" value="', ($i + 1), '" />';
					}
					?>
				</div>
				<div class="go-5-done">
					<button type="submit" data-theme="e">Done</button>
				</div>
				<?
				break;

			default:
			echo $order->dispatchStatus();
				echo "Error";

				break;
		}
	}

	echo '</div></div>';
}
else {
	require('inc/header.php');
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
