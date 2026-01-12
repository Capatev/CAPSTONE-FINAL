<?php
require "db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$role = $data['role'] ?? '';

/* ROLE CHECK */
if (!in_array($role, ['client','driver'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid role"
    ]);
    exit;
}

if ($username === '' || $password === '') {
    echo json_encode([
        "status" => "error",
        "message" => "Missing fields"
    ]);
    exit;
}

/* CHECK USERNAME */
$stmt = $conn->prepare("SELECT user_id FROM users WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Username already exists"
    ]);
    exit;
}

/* CREATE ACCOUNT */
$hashed = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
");
$stmt->bind_param("ssss", $username, $email, $hashed, $role);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "Account created successfully"
]);
