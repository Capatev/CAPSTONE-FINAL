<?php
require_once "/db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$client_id   = $data['client_id'];
$client_name = $data['client_name'];
$vehicle     = $data['vehicle'];
$start_date  = $data['start_date'];
$end_date    = $data['end_date'];
$amount      = $data['amount'];

$stmt = $conn->prepare("
    INSERT INTO bookings 
    (client_id, client_name, vehicle, start_date, end_date, amount)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "issssd",
    $client_id,
    $client_name,
    $vehicle,
    $start_date,
    $end_date,
    $amount
);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
