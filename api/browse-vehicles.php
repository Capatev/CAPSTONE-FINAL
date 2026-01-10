<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "mvrms_db");

if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$sql = "
    SELECT 
        v.vehicle_id,
        v.vehicle_name,
        v.brand,
        v.model,
        v.daily_rate,
        v.availability,
        v.image,
        t.type_name
    FROM vehicles v
    JOIN vehicle_types t ON v.type_id = t.type_id
";

$result = $conn->query($sql);

$vehicles = [];

while ($row = $result->fetch_assoc()) {
    $vehicles[] = $row;
}

echo json_encode($vehicles);
