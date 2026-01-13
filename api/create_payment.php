<?php
require "/db.php";

$user_id = $_POST['user_id'];
$amount  = $_POST['amount'];

$invoice = uniqid("INV");

$sql = "INSERT INTO payments (user_id, invoice, amount, method, status, created_at)
        VALUES (?, ?, ?, 'GCASH', 'PENDING')";

$stmt = $conn->prepare($sql);
$stmt->bind_param("isd", $user_id, $invoice, $amount);
$stmt->execute();

echo json_encode([
  "success" => true,
  "invoice" => $invoice
]);
