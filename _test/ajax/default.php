<?
$result = array();
$result['status'] = 'success';
//$result['status'] = 'error';
$result['message'] = '';

if ($_GET['status']) {
  $result['status'] = $_GET['status'];
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