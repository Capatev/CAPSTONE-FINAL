<?php
require "/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare("
    INSERT INTO assets (asset_code, name, type, value, `condition`, description)
    VALUES (?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "sssiss",
    $data['asset_code'],
    $data['name'],
    $data['type'],
    $data['value'],
    $data['condition'],
    $data['description']
);

echo $stmt->execute()
    ? json_encode(["status" => "success"])
    : json_encode(["status" => "error", "message" => $conn->error]);
