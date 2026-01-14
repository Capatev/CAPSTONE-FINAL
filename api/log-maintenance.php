<?php
require "/db.php";

$stmt = $conn->prepare("
    INSERT INTO asset_maintenance (asset_id, details, maintenance_date)
    VALUES (?, ?, ?)
");

$stmt->bind_param(
    "iss",
    $_POST['asset_id'],
    $_POST['details'],
    $_POST['maintenance_date']
);

echo $stmt->execute()
    ? json_encode(["status" => "success"])
    : json_encode(["status" => "error"]);
