<?php
require "db.php";
header("Content-Type: application/json");

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
if ($user_id <= 0) {
    echo json_encode(["error" => "Invalid user ID"]);
    exit;
}

/* ================= ACTIVE BOOKINGS ================= */
$active = 0;
$res = $conn->query("
    SELECT COUNT(*) AS total
    FROM reservations
    WHERE user_id = $user_id AND status = 'active'
");
if ($res && $row = $res->fetch_assoc()) {
    $active = (int)$row['total'];
}

/* ================= COMPLETED RENTALS ================= */
$completed = 0;
$res = $conn->query("
    SELECT COUNT(*) AS total
    FROM reservations
    WHERE user_id = $user_id AND status = 'completed'
");
if ($res && $row = $res->fetch_assoc()) {
    $completed = (int)$row['total'];
}

/* ================= TOTAL SPENT (PAID ONLY) ================= */
$totalSpent = 0;
$res = $conn->query("
    SELECT IFNULL(SUM(amount), 0) AS total
    FROM payments
    WHERE user_id = $user_id AND status = 'PAID'
");
if ($res && $row = $res->fetch_assoc()) {
    $totalSpent = (float)$row['total'];
}

/* ================= LATEST PAYMENT STATUS ================= */
$paymentStatus = "Unpaid";
$res = $conn->query("
    SELECT status
    FROM payments
    WHERE user_id = $user_id
    ORDER BY created_at DESC
    LIMIT 1
");
if ($res && $row = $res->fetch_assoc()) {
    $paymentStatus = ucfirst(strtolower($row['status']));
}

echo json_encode([
    "activeBookings" => $active,
    "completedRentals" => $completed,
    "totalSpent" => $totalSpent,
    "paymentStatus" => $paymentStatus
]);

