<?php
require "/db.php";
header("Content-Type: application/json");

$photoPath = null;

/* UPLOAD PHOTO */
if (!empty($_FILES['photo']['name'])) {
    $uploadDir = "../uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $photoPath = "uploads/" . time() . "_" . basename($_FILES['photo']['name']);
    move_uploaded_file($_FILES['photo']['tmp_name'], "../" . $photoPath);
}

/* UPDATE CURRENT ASSET CONDITION */
$update = $conn->prepare(
    "UPDATE assets SET `condition` = ? WHERE id = ?"
);
$update->bind_param("si", $_POST['condition'], $_POST['asset_id']);
$update->execute();

/* INSERT CONDITION HISTORY */
$insert = $conn->prepare(
    "INSERT INTO asset_conditions (asset_id, `condition`, photo, notes)
     VALUES (?, ?, ?, ?)"
);
$insert->bind_param(
    "isss",
    $_POST['asset_id'],
    $_POST['condition'],
    $photoPath,
    $_POST['notes']
);
$insert->execute();

echo json_encode(["status" => "success"]);
