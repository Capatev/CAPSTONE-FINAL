<?php
require "/db.php";

$data = [];

$data['total_assets'] = $conn->query(
    "SELECT COUNT(*) c FROM assets WHERE is_active = 1"
)->fetch_assoc()['c'];

$data['total_value'] = $conn->query(
    "SELECT SUM(value) v FROM assets WHERE is_active = 1"
)->fetch_assoc()['v'];

$data['good_condition'] = $conn->query(
    "SELECT COUNT(*) c FROM assets WHERE `condition` = 'good'"
)->fetch_assoc()['c'];

$data['needs_repair'] = $conn->query(
    "SELECT COUNT(*) c FROM assets WHERE `condition` IN ('fair','poor')"
)->fetch_assoc()['c'];

echo json_encode($data);
