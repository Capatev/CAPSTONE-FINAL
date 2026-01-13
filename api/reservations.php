<?php
require_once __DIR__ . "/db.php";
header("Content-Type: application/json");

$method = $_SERVER["REQUEST_METHOD"];

/* =========================
   GET BOOKINGS
========================= */
if ($method === "GET") {
    $result = $conn->query("
        SELECT
            booking_id,
            client_name,
            vehicle,
            start_date,
            end_date,
            status,
            amount
        FROM bookings
        ORDER BY created_at DESC
    ");

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode($data);
    exit;
}

/* =========================
   CREATE BOOKING
========================= */
if ($method === "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (
        empty($input["clientId"]) ||
        empty($input["clientName"]) ||
        empty($input["vehicle"]) ||
        empty($input["pickupDate"]) ||
        empty($input["returnDate"]) ||
        empty($input["amount"])
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required fields"
        ]);
        exit;
    }

    $sql = "
        INSERT INTO bookings
        (client_id, client_name, vehicle, start_date, end_date, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
    ";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode([
            "success" => false,
            "message" => $conn->error
        ]);
        exit;
    }

    $stmt->bind_param(
        "issssd",
        $input["clientId"],
        $input["clientName"],
        $input["vehicle"],
        $input["pickupDate"],
        $input["returnDate"],
        $input["amount"]
    );

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Booking created successfully"
    ]);
    exit;
}
