<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "mvrms_db");

if ($conn->connect_error) {
    echo json_encode([]);
    exit;
}

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode([]);
    exit;
}

$sql = "
    SELECT
        r.reservation_id,
        v.vehicle_name,
        r.pickup_date,
        r.return_date,
        r.total_days,
        r.total_cost,
        r.status,
        IFNULL(rt.rating, 0) AS rating
    FROM reservations r
    INNER JOIN vehicles v ON r.vehicle_id = v.vehicle_id
    LEFT JOIN vehicle_ratings rt 
        ON rt.reservation_id = r.reservation_id
    WHERE r.user_id = ?
      AND r.status = 'Completed'
    ORDER BY r.created_at DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();