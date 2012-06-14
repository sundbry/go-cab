<?
require('inc/init.php');
require('inc/header.php');
?>
<div data-role="page" class="index">
<div class="main-button">
	<a href="go.php" data-role="button" data-theme="e">Order a Cab</a>
</div>
<? /*
<div class="ui-grid-a">
	<div class="ui-block-a">
		<button type="submit" value="history">History</button>
	</div>
	<div class="ui-block-b">
		<button type="submit" value="profile">Profile</button>
	</div>
</div>
*/ ?>
<h5>Testing Shortcuts</h5>
<ul>
<li><a href="go-2.php?csr=csr-3">csr 3</a></li>
<li><a href="go-4.php?order=order-79">order 79</a></li>
</ul>
</div>
<?
require('inc/footer.php');
?>
