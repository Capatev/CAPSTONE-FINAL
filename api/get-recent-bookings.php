<?php
require "db.php";
header("Content-Type: application/json");

$user_id = $_GET['user_id'] ?? null;

$result = $conn->query("
    SELECT v.vehicle_name, r.pickup_date, r.total_days, r.status
    FROM reservations r
    JOIN vehicles v ON r.vehicle_id = v.vehicle_id
    WHERE r.user_id=$user_id
    ORDER BY r.created_at DESC
    LIMIT 5
");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
