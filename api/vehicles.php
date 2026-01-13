<?php
require_once __DIR__ . "/db.php";
header("Content-Type: application/json; charset=utf-8");

$result = $conn->query("
    SELECT
        vehicle_id,
        vehicle_name,
        brand,
        model,
        daily_rate,
        availability,
        plate_number
    FROM vehicles
");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data, JSON_UNESCAPED_UNICODE);
exit;
