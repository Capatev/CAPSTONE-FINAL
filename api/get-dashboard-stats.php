<?php
require __DIR__ . "/db.php";
header("Content-Type: application/json");

// Total receivable
$totalReceivable = $conn->query("
    SELECT IFNULL(SUM(amount),0) total
    FROM invoices
    WHERE status = 'Pending'
")->fetch_assoc()['total'];

// Today's collections
$todaysCollections = $conn->query("
    SELECT IFNULL(SUM(amount),0) total
    FROM invoices
    WHERE status = 'Paid'
      AND DATE(created_at) = CURDATE()
")->fetch_assoc()['total'];

// Month revenue
$monthRevenue = $conn->query("
    SELECT IFNULL(SUM(amount),0) total
    FROM invoices
    WHERE status = 'Paid'
      AND MONTH(created_at) = MONTH(CURDATE())
      AND YEAR(created_at) = YEAR(CURDATE())
")->fetch_assoc()['total'];

// Pending payments
$pendingPayments = $conn->query("
    SELECT COUNT(*) total
    FROM invoices
    WHERE status = 'Pending'
")->fetch_assoc()['total'];

echo json_encode([
    "total_receivable" => $totalReceivable,
    "todays_collections" => $todaysCollections,
    "month_revenue" => $monthRevenue,
    "pending_payments" => $pendingPayments
]);
