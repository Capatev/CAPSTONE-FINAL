<?php
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$role     = $data['role'] ?? '';

if (!$username || !$password || !$role) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing login credentials"
    ]);
    exit;
}

// fetch user
$stmt = $conn->prepare("
    SELECT user_id, full_name, email, username, password_hash, role, id_verified
    FROM users
    WHERE username = ? AND role = ?
");
$stmt->bind_param("ss", $username, $role);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid username or role"
    ]);
    exit;
}

$user = $result->fetch_assoc();

// verify password
if (!password_verify($password, $user['password_hash'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Incorrect password"
    ]);
    exit;
}

// success
echo json_encode([
    "status" => "success",
    "user" => [
        "user_id" => $user['user_id'],
        "username" => $user['username'],
        "fullName" => $user['full_name'],
        "email" => $user['email'],
        "role" => $user['role'],
        "idVerified" => $user['id_verified'],
        "loginTime" => date("c")
    ]
]);
