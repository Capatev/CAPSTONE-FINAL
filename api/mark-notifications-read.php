<?php
require "db.php";
$user_id = intval($_POST['user_id'] ?? 0);

$conn->query("
  UPDATE notifications
  SET is_read = 1
  WHERE user_id = $user_id
");
