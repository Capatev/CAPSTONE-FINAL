<?php
require "db.php";
header("Content-Type: application/json");

/* TODO: check admin session */

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username']);
$password = $data['password'];

$hashed = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO users (username, password, role)
    VALUES (?, ?, 'staff')
");
$stmt->bind_param("ss", $username, $hashed);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "Staff account created"
]);
