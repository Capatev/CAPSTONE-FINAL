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
        v.daily_rate,
        v.availability,
        v.image,
        t.type_id,
        t.type_name
    FROM vehicles v
    JOIN vehicle_types t ON v.type_id = t.type_id
";

$res = $conn->query($sql);

$data = [];

while ($row = $res->fetch_assoc()) {
    $data[] = [
        "vehicle_id"   => $row["vehicle_id"],
        "vehicle_name" => $row["vehicle_name"],
        "daily_rate"   => $row["daily_rate"],
        "availability" => $row["availability"],
        "image"        => $row["image"],
        "type" => [
            "type_id"   => $row["type_id"],
            "type_name" => $row["type_name"]
        ]
    ];
}

echo json_encode($data);
$conn->close();
