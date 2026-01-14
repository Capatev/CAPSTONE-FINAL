<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . "/db.php";
header("Content-Type: application/json");

if (!isset($_POST['id'])) {
    echo json_encode(["error" => "Missing ID"]);
    exit;
}

$stmt = $conn->prepare("
    UPDATE assets
    SET name=?, type=?, value=?, `condition`=?, updated_at=NOW()
    WHERE id=?
");

$stmt->bind_param(
    "ssdsi",
    $_POST['name'],
    $_POST['type'],
    $_POST['value'],
    $_POST['condition'],
    $_POST['id']
);

$stmt->execute();

echo json_encode(["status" => "success"]);
