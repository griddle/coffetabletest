<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<link rel="stylesheet" type="text/css" href="http://reset5.googlecode.com/hg/reset.min.css" />
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script src="js/twitter_bootstrap/bootstrap-tooltip.js"></script>
	<script src="js/twitter_bootstrap/bootstrap-popover.js"></script>
	<script src="js/global.js"></script>
	<script src="js/rect_drawer.js"></script>
</head>
<body>

	
	<div id="main_container">
		<img id="page_img" alt="" />
	</div>
	
	<div id="input_form_template" class="input_form">
		<div class="close_box">[close]</div>
		<div class="select_product">
			<select class="input_select"></select>
		</div>
		<div class="product_info">
		</div>
	</div>
	
	<script>
		var g_issue_id = <?php echo (isset($_GET['issue_id'])) ? $_GET['issue_id'] : "null"; ?>;
		var g_ct = {
			url_meta : function(issue_id){
				return "proxy/superCrazyGenericProxy.php?url=http://api.coffeetable.com/api/v1/issues/" + String(issue_id);
			},
			url_product : function(issue_id){
				return "proxy/superCrazyGenericProxy.php?url=http://api.coffeetable.com/api/v1/products/?issue_id=" + String(issue_id);
			}
		};
		function g_has_issue(){
			return (g_issue_id != null);
		}
	</script>
	<script src="js/ct.js"></script>
</body>