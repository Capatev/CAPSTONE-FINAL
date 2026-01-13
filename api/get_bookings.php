<?php
require_once "/db.php";
header("Content-Type: application/json");

$search = $_GET['search'] ?? '';
$status = $_GET['status'] ?? '';

$sql = "SELECT * FROM bookings WHERE 1";

if ($search) {
    $sql .= " AND (client_name LIKE '%$search%' OR vehicle LIKE '%$search%')";
}

if ($status && $status !== "All") {
    $sql .= " AND status='$status'";
}

$sql .= " ORDER BY created_at DESC";

$result = $conn->query($sql);

$bookings = [];

while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode($bookings);
