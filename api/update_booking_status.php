<?php
require_once "/db.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$booking_id = $data['booking_id'];
$status     = $data['status'];

$stmt = $conn->prepare("
    UPDATE bookings 
    SET status = ? 
    WHERE booking_id = ?
");

$stmt->bind_param("si", $status, $booking_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
