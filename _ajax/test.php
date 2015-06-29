<?
$result = array();
$result['status'] = 'success';
//$result['status'] = 'error';
$result['message'] = '<p>This a test.</p><p>Status: ' . $result['status'] . '</p>';

if ($_GET['next']) {
  $result['nextUrl'] = $_GET['next'];
};

echo json_encode($result);
exit;
?>