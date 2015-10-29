<?
$result = array();
$result['state'] = 'success';
//$result['state'] = 'error';
$result['message'] = '';

if ($_GET['state']) {
  $result['state'] = $_GET['state'];
};

if ($_GET['message']) {
  $result['message'] = $_GET['message'];
};

if ($_GET['nextUrl']) {
  $result['nextUrl'] = $_GET['nextUrl'];
};

echo json_encode($result);
exit;
?>