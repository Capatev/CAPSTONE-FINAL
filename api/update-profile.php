<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost","root","","mvrms_db");

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(["status"=>"error","message"=>"User ID required"]);
    exit;
}

/* Update users table */
$stmt = $conn->prepare("
UPDATE users SET
    full_name = ?,
    email = ?,
    phone = ?,
    address = ?
WHERE user_id = ?
");

$stmt->bind_param(
    "ssssi",
    $data['full_name'],
    $data['email'],
    $data['phone'],
    $data['address'],
    $user_id
);
$stmt->execute();

/* Insert or update profile */
$conn->query("
INSERT INTO user_profile (user_id, driver_license_no, member_since)
VALUES ($user_id, '{$data['driver_license_no']}', CURDATE())
ON DUPLICATE KEY UPDATE
driver_license_no='{$data['driver_license_no']}'
");

echo json_encode(["status"=>"success","message"=>"Profile updated"]);