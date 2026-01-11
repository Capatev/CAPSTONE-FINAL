<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "mvrms_db");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';
$role     = $data['role'] ?? '';

if (!$username || !$password || !$role) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT user_id, username, password, role
    FROM users
    WHERE username = ? AND role = ?
");
$stmt->bind_param("ss", $username, $role);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {

    // OPTIONAL: if password is hashed, use password_verify()
    if ($user['password'] !== $password) {
        echo json_encode(["status" => "error", "message" => "Invalid password"]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "user" => [
            "user_id" => $user['user_id'],
            "username" => $user['username'],
            "role" => $user['role']
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "User not found"]);
}

$stmt->close();
$conn->close();
