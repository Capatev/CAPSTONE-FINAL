<?php
header("Content-Type: application/json");
error_reporting(0);

require "../config/db.php";

if (!isset($_FILES['receipt'], $_POST['invoice'])) {
    echo json_encode(["success" => false, "message" => "Missing data"]);
    exit;
}

$invoice = $_POST['invoice'];
$file = $_FILES['receipt'];

$filename = time() . "_" . $file['name'];
$path = "../receipts/" . $filename;

move_uploaded_file($file['tmp_name'], $path);

$stmt = $conn->prepare(
    "UPDATE payments SET receipt=?, status='FOR_VERIFICATION' WHERE invoice=?"
);
$stmt->bind_param("ss", $filename, $invoice);
$stmt->execute();

echo json_encode([
    "success" => true,
    "message" => "Receipt uploaded successfully"
]);