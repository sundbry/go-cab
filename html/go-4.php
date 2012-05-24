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

	echo '<div data-role="page" id="go-4">';
	echo 'go-4';
	echo '</div>';
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
