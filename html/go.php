<?
require('inc/header.php');

function preset($field) {
	$values = array(
		
	);
	return $values[$field];
}

?>
<form data-role="page" id="go-1" method="post" action="go-2.php">
<div data-role="collapsible-set">
	<div data-role="collapsible" data-collapsed="false">
		<h3>Destination</h3>
		<input type="search" name="go-search-dest" id="go-search-dest" value="1 Grand Ave, San Luis Obispo, CA" />
		<div class="map-canvas" id="map-canvas-dest" style="width: 200px; height: 200px;"></div>
	</div>
	<div data-role="collapsible" data-collapsed="true">
		<h3>Pick-up</h3>
		<input type="search" name="go-search-pickup" id="go-search-pickup" value="1050 Monterey St, San Luis Obispo, CA" />
		<div class="map-canvas" id="map-canvas-pickup" style="width: 200px; height: 200px;"></div>
		<div data-role="fieldcontain">
			<label for="go-datetime-pickup">Date &amp; Time:</label>
			<input type="text" name="go-datetime-pickup" id="go-datetime-pickup" value="<?=preset('go-datetime-pickup');?>" /><br />
		</div>
	</div>
	<div data-role="collapsible" data-collapsed="true">
		<h3>Contact</h3>
		<fieldset data-role="controlgroup" data-type="horizontal">
			<div data-role="fieldcontain">
				<input type="radio" name="go-message-mode" id="go-message-mode-text" value="text" checked="checked" />
				<label for="go-message-mode-text">Text Me</label>
				<input type="radio" name="go-message-mode" id="go-message-mode-call" value="call" />
				<label for="go-message-mode-call">Call Me</label>
			</div>
			<div data-role="fieldcontain">
				<label for="go-callback-number">My Number:</label>
				<input type="text" name="go-callback-number" id="go-callback-number" value="<?=preset('go-callback-number');?>" />
			</div>
			<div data-role="fieldcontain">
				<textarea name="go-message-text" id="go-message-text" placeholder="Please send a cab!"></textarea>
			</div>
		</fieldset>
	</div>
</div>
<button type="submit">Find a cab!</button>
</form>
<?
require('inc/footer.php');
?>
