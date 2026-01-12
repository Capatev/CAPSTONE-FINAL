<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost","root","","mvrms_db");

$data = json_decode(file_get_contents("php://input"), true);

$invoice_id = $data['invoice_id'];
$user_id = $data['user_id'];
$amount = $data['amount'];
$method = $data['method'];

$conn->query("
INSERT INTO payments (invoice_id,user_id,amount,method)
VALUES ($invoice_id,$user_id,$amount,'$method')
");

$conn->query("UPDATE invoices SET status='Paid' WHERE invoice_id=$invoice_id");

echo json_encode(["status"=>"success"]);

$conn->query("
    UPDATE reservations 
    SET status = 'Completed' 
    WHERE reservation_id = $reservation_id
");