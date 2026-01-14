<?php
require __DIR__ . "/db.php";
header("Content-Type: application/json");

if (!isset($_POST['invoice_id'])) {
    echo json_encode(["error" => "Missing invoice_id"]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE invoices
    SET status = 'Paid'
    WHERE invoice_id = ?
");

$stmt->bind_param("i", $_POST['invoice_id']);
$stmt->execute();

echo json_encode(["status" => "success"]);
