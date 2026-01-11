<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost","root","","mvrms_db");

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? null;
$vehicle_id = $data['vehicle_id'] ?? null;
$pickup_date = $data['pickup_date'] ?? null;
$return_date = $data['return_date'] ?? null;
$pickup_location = $data['pickup_location'] ?? '';
$dropoff_location = $data['dropoff_location'] ?? '';
$notes = $data['notes'] ?? '';
$total_days = $data['total_days'] ?? 0;
$daily_rate = $data['daily_rate'] ?? 0;
$total_cost = $data['total_cost'] ?? 0;

if (!$username || !$vehicle_id) {
    echo json_encode(["status"=>"error","message"=>"Missing data"]);
    exit;
}

/* GET USER */
$getUser = $conn->prepare("SELECT user_id FROM users WHERE username=?");
$getUser->bind_param("s",$username);
$getUser->execute();
$user = $getUser->get_result()->fetch_assoc();
$user_id = $user['user_id'];

/* INSERT RESERVATION */
$stmt = $conn->prepare("
INSERT INTO reservations
(user_id, vehicle_id, pickup_date, return_date, pickup_location, dropoff_location, notes, total_days, daily_rate, total_cost)
VALUES (?,?,?,?,?,?,?,?,?,?)
");
$stmt->bind_param(
    "iisssssidd",
    $user_id,$vehicle_id,$pickup_date,$return_date,
    $pickup_location,$dropoff_location,$notes,
    $total_days,$daily_rate,$total_cost
);
if ($stmt->execute()) {

    $reservation_id = $conn->insert_id;

    // CREATE INVOICE AUTOMATICALLY
    $invoice = $conn->prepare("
        INSERT INTO invoices 
        (reservation_id, user_id, amount, due_date, status)
        VALUES (?, ?, ?, ?, 'Pending')
    ");

    $due_date = date("Y-m-d", strtotime("+1 day"));

    $invoice->bind_param(
        "iids",
        $reservation_id,
        $user_id,
        $total_cost,
        $due_date
    );
    $invoice->execute();

    // UPDATE VEHICLE STATUS
    $conn->query("UPDATE vehicles SET availability='Rented' WHERE vehicle_id=$vehicle_id");

    echo json_encode([
        "status" => "success",
        "message" => "Reservation + Invoice created"
    ]);
}