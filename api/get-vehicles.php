<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . "/db.php";
header("Content-Type: application/json");

$sql = "
    SELECT
        vehicle_id,
        vehicle_name,
        brand,
        model,
        plate_number,
        status,
        mileage,
        daily_rate
    FROM vehicles
    WHERE is_active = 1
    ORDER BY vehicle_name ASC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
