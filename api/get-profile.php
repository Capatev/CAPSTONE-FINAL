<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost","root","","mvrms_db");

$user_id = $_GET['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(["status"=>"error","message"=>"User ID required"]);
    exit;
}

$sql = "
SELECT 
    u.username,
    u.full_name,
    u.email,
    u.phone,
    u.address,
    p.driver_license_no,
    p.license_status,
    p.verification_status,
    p.member_since
FROM users u
LEFT JOIN user_profile p ON u.user_id = p.user_id
WHERE u.user_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode([
    "status"=>"success",
    "data"=>$result->fetch_assoc()
]);
