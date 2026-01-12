<?php
require "db.php";

$user_id = intval($_POST['user_id']);
$email = intval($_POST['email']);
$dark = intval($_POST['dark']);
$sound = intval($_POST['sound']);

$conn->query("
  INSERT INTO user_settings (user_id, email_notifications, dark_mode, sound_alerts)
  VALUES ($user_id, $email, $dark, $sound)
  ON DUPLICATE KEY UPDATE
    email_notifications=$email,
    dark_mode=$dark,
    sound_alerts=$sound
");
