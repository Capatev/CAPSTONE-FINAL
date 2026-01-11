<?php
header("Content-Type: application/json");
$conn = new mysqli("localhost","root","","mvrms_db");

$user_id = $_GET['user_id'] ?? 0;

$stmt = $conn->prepare("
    SELECT 
        i.invoice_id,
        i.reservation_id,
        i.amount,
        i.due_date,
        i.status
    FROM invoices i
    WHERE i.user_id = ? AND i.status = 'Pending'
");

$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
