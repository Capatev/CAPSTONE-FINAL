<?php
require "db.php";
header("Content-Type: application/json");

$user_id = intval($_GET['user_id'] ?? 0);

$res = $conn->query("
  SELECT email_notifications, dark_mode, sound_alerts
  FROM user_settings
  WHERE user_id = $user_id
");

echo json_encode($res->fetch_assoc());
