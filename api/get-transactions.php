<?php
require __DIR__ . "/db.php";
header("Content-Type: application/json");

$search = $_GET['search'] ?? '';
$method = $_GET['method'] ?? '';

$sql = "
  SELECT
    id,
    invoice,
    amount,
    method,
    status,
    created_at
  FROM payments
  WHERE 1=1
";

if ($method !== '') {
  $sql .= " AND method = '".$conn->real_escape_string($method)."'";
}

if ($search !== '') {
  $sql .= " AND (
      invoice LIKE '%".$conn->real_escape_string($search)."%'
      OR id LIKE '%".$conn->real_escape_string($search)."%'
  )";
}

$sql .= " ORDER BY created_at DESC";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
