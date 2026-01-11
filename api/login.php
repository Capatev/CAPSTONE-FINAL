<?php
header("Content-Type: application/json");
error_reporting(0);

$conn = new mysqli("localhost", "root", "", "mvrms_db");

if ($conn->connect_error) {
    echo json_encode(["status"=>"error","message"=>"DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"] ?? "";
$password = $data["password"] ?? "";
$role     = $data["role"] ?? "";

if (!$username || !$password || !$role) {
    echo json_encode(["status"=>"error","message"=>"Missing fields"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT user_id, username, password_hash, role
    FROM users
    WHERE username = ? AND role = ?
    LIMIT 1
");

$stmt->bind_param("ss", $username, $role);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {

    if (!password_verify($password, $row["password_hash"])) {
        echo json_encode(["status"=>"error","message"=>"Invalid password"]);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "user" => [
            "user_id" => $row["user_id"],
            "username" => $row["username"],
            "role" => $row["role"]
        ]
    ]);
    exit;
}

echo json_encode(["status"=>"error","message"=>"Invalid login"]);