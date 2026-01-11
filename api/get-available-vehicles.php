<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost","root","","mvrms_db");
if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$sql = "SELECT vehicle_id, vehicle_name, daily_rate, availability, image FROM vehicles";
$res = $conn->query($sql);

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
$conn->close();