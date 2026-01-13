<?php
include 'db.php';

$sql = "
SELECT 
    cv.verification_id,
    c.full_name,
    c.email,
    c.phone,
    cv.id_type,
    cv.status,
    cv.submitted_at
FROM client_verifications cv
JOIN clients c ON cv.client_id = c.client_id
ORDER BY cv.submitted_at DESC
";

$result = $conn->query($sql);
?>
