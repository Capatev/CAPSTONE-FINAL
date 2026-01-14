<?php
require "/db.php";
session_start();
header("Content-Type: application/json");

/* SAFETY CHECK */
if (
    empty($_SESSION['client_id']) ||
    empty($_FILES['id_image']['name'])
) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$clientId = $_SESSION['client_id'];

if (empty($_POST['id_type'])) {
    echo json_encode(["status" => "error", "message" => "ID type required"]);
    exit;
}

$dir = "/uploads/verifications/";
if (!is_dir($dir)) mkdir($dir, 0777, true);

/* FILE UPLOAD */
$fileName = time() . "_" . basename($_FILES['id_image']['name']);
$fullPath = $dir . $fileName;
$dbPath   = "uploads/verifications/" . $fileName;

move_uploaded_file($_FILES['id_image']['tmp_name'], $fullPath);

/* INSERT */
$stmt = $conn->prepare("
    INSERT INTO client_verifications
    (client_id, id_type, id_number, id_image, submitted_at)
    VALUES (?, ?, ?, ?, CURDATE())
");

$stmt->bind_param(
    "isss",
    $clientId,
    $_POST['id_type'],
    $_POST['id_number'],
    $dbPath
);

$stmt->execute();

echo json_encode(["status" => "success"]);
