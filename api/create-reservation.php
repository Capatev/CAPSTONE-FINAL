<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "mvrms_db");

if ($conn->connect_error) {
    echo json_encode(["status"=>"error","message"=>"Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status"=>"error","message"=>"Invalid JSON input"]);
    exit;
}

/* GET USER ID USING USERNAME */
$username = $data['username'] ?? null;

if (!$username) {
    echo json_encode(["status"=>"error","message"=>"Username is required"]);
    exit;
}

$getUser = $conn->prepare("SELECT user_id FROM users WHERE username = ?");
$getUser->bind_param("s", $username);
$getUser->execute();
$result = $getUser->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(["status"=>"error","message"=>"User not found"]);
    exit;
}

$user_id = $user['user_id'];

/* OTHER DATA */
$vehicle_id = $data['vehicle_id'] ?? null;
$pickup_date = $data['pickup_date'] ?? null;
$return_date = $data['return_date'] ?? null;
$pickup_location = $data['pickup_location'] ?? '';
$dropoff_location = $data['dropoff_location'] ?? '';
$notes = $data['notes'] ?? '';

if (!$vehicle_id || !$pickup_date || !$return_date) {
    echo json_encode(["status"=>"error","message"=>"Missing required fields"]);
    exit;
}

/* INSERT RESERVATION */
$stmt = $conn->prepare("
    INSERT INTO reservations
    (user_id, vehicle_id, pickup_date, return_date, pickup_location, dropoff_location, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
");

$stmt->bind_param(
    "iisssss",
    $user_id,
    $vehicle_id,
    $pickup_date,
    $return_date,
    $pickup_location,
    $dropoff_location,
    $notes
);

if ($stmt->execute()) {
    echo json_encode(["status"=>"success","message"=>"Reservation created"]);
} else {
    echo json_encode(["status"=>"error","message"=>"Failed to save reservation"]);
}
if (empty($user_id) && empty($data['username'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Username is required"
    ]);
    exit;
}
// AFTER reservation insert
$update = $conn->prepare(
    "UPDATE vehicles SET availability='Rented' WHERE vehicle_id=?"
);
$update->bind_param("i", $vehicle_id);
$update->execute();
$update->close();

$stmt->close();
$conn->close();
