<?php
require __DIR__ . "/db.php";
header("Content-Type: application/json");

$search = $_GET['search'] ?? '';
$status = $_GET['status'] ?? '';

$sql = "
    SELECT
        invoice_id,
        user_id,
        amount,
        due_date,
        status,
        created_at
    FROM invoices
    WHERE 1=1
";

if ($status !== '') {
    $sql .= " AND status = '" . $conn->real_escape_string($status) . "'";
}

if ($search !== '') {
    $sql .= " AND invoice_id LIKE '%" . $conn->real_escape_string($search) . "%'";
}

$sql .= " ORDER BY created_at DESC";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
