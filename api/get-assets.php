<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . "/db.php";
header("Content-Type: application/json");

$sql = "
    SELECT id, asset_code, name, type, value, `condition`, updated_at
    FROM assets
    WHERE is_active = 1
    ORDER BY id ASC
";

$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["error" => $conn->error]);
    exit;
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
