<?php
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status"=>"error","message"=>"No data received"]);
    exit;
}

$fullname = trim($data['fullname'] ?? '');
$email    = trim($data['email'] ?? '');
$phone    = trim($data['phone'] ?? '');
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

$idData   = $data['idData'] ?? null;

if (!$fullname || !$email || !$phone || !$username || !$password) {
    echo json_encode(["status"=>"error","message"=>"Missing required fields"]);
    exit;
}

// CHECK DUPLICATE
$check = $conn->prepare("SELECT user_id FROM users WHERE email=? OR username=?");
$check->bind_param("ss", $email, $username);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["status"=>"error","message"=>"Email or username already exists"]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// INSERT USER
$stmt = $conn->prepare("
    INSERT INTO users (full_name, email, phone, username, password_hash, id_verified)
    VALUES (?, ?, ?, ?, ?, ?)
");

$idVerified = $idData ? 1 : 0;

$stmt->bind_param(
    "sssssi",
    $fullname,
    $email,
    $phone,
    $username,
    $passwordHash,
    $idVerified
);

if (!$stmt->execute()) {
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
    exit;
}

$userId = $stmt->insert_id;

// INSERT ID DATA
if ($idData) {
    $stmt2 = $conn->prepare("
        INSERT INTO user_id_verifications
        (user_id, id_type, id_number, date_of_birth, expiration_date, issuing_country, id_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt2->bind_param(
        "issssss",
        $userId,
        $idData['type'],
        $idData['number'],
        $idData['dob'],
        $idData['expiry'],
        $idData['country'],
        $idData['image']
    );

    if (!$stmt2->execute()) {
        echo json_encode(["status"=>"error","message"=>$stmt2->error]);
        exit;
    }
}

echo json_encode(["status"=>"success"]);
