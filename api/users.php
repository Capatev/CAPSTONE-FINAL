<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . "/db.php";
header("Content-Type: application/json");

// SIMPLE TEST QUERY
$result = $conn->query("SELECT * FROM users");

if (!$result) {
    die("SQL ERROR: " . $conn->error);
}

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
