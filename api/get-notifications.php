<?php
require "db.php";
header("Content-Type: application/json");

$user_id = intval($_GET['user_id'] ?? 0);

$result = $conn->query("
  SELECT notification_id, title, message, is_read, created_at
  FROM notifications
  WHERE user_id = $user_id
  ORDER BY created_at DESC
  LIMIT 5
");

$data = [];
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
