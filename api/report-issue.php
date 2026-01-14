<?php
require "/db.php";

$stmt = $conn->prepare("
    INSERT INTO asset_issues (asset_id, description, severity)
    VALUES (?, ?, ?)
");

$stmt->bind_param(
    "iss",
    $_POST['asset_id'],
    $_POST['description'],
    $_POST['severity']
);

echo $stmt->execute()
    ? json_encode(["status" => "success"])
    : json_encode(["status" => "error"]);
