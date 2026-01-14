<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . "/db.php";
header("Content-Type: application/json");

if (!isset($_POST['vehicle_id'])) {
    echo json_encode(["error" => "Missing vehicle_id"]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE vehicles
    SET
        status = ?,
        mileage = ?,
        daily_rate = ?
    WHERE vehicle_id = ?
");

$stmt->bind_param(
    "sidi",
    $_POST['status'],
    $_POST['mileage'],
    $_POST['daily_rate'],
    $_POST['vehicle_id']
);

$stmt->execute();

echo json_encode(["status" => "success"]);
