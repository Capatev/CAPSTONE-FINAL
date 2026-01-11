<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "mvrms_db");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

$stmt = $conn->prepare("
    SELECT 
        r.reservation_id,
        v.vehicle_name,
        r.pickup_date,
        r.return_date,
        r.total_cost,
        r.status
    FROM reservations r
    JOIN vehicles v ON r.vehicle_id = v.vehicle_id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
");

if (!$stmt) {
    echo json_encode([]);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);
