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
    SET is_active = 0
    WHERE id = ?
");

$stmt->bind_param("i", $_POST['id']);
$stmt->execute();

echo json_encode(["status" => "deleted"]);
