<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . "/db.php";
header("Content-Type: application/json");

$sql = "
    SELECT
        cv.verification_id,
        cv.id_type,
        cv.id_number,
        cv.id_image,
        cv.status,
        cv.submitted_at,
        CONCAT(c.first_name,' ',c.last_name) AS client_name
    FROM client_verifications cv
    JOIN clients c ON c.client_id = cv.client_id
    ORDER BY cv.submitted_at DESC
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