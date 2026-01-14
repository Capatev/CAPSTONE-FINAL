<?php
require __DIR__ . "/db.php";
header("Content-Type: application/json");

$userId   = $_POST['user_id'];
$invoice  = $_POST['invoice'];
$amount   = $_POST['amount'];
$method   = $_POST['method']; // GCASH for now

$stmt = $conn->prepare("
  INSERT INTO payments
  (user_id, invoice, amount, method, status, payment_status)
  VALUES (?, ?, ?, ?, 'PAID', 'paid')
");

$stmt->bind_param("isds",
  $userId,
  $invoice,
  $amount,
  $method
);

$stmt->execute();

echo json_encode(["status" => "success"]);
