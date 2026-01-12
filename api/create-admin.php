<?php
require "db.php";

$username = "admin";
$password = password_hash("admin123", PASSWORD_DEFAULT);

$conn->query("
  INSERT INTO users (username, password, role)
  VALUES ('$username', '$password', 'admin')
");

echo "Admin created";
