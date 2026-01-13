<?php
include 'db.php';

$id = $_GET['id'];

$sql = "
SELECT c.full_name, cv.*
FROM client_verifications cv
JOIN clients c ON cv.client_id = c.client_id
WHERE cv.verification_id = $id
";

$result = $conn->query($sql);
$data = $result->fetch_assoc();
?>
<table border="1" cellpadding="10" cellspacing="0">
    <tr>
        <th>Client Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>ID Type</th>
        <th>Status</th>
        <th>Submitted</th>
        <th>Action</th>
    </tr>

    <?php while ($row = $result->fetch_assoc()): ?>
    <tr>
        <td><?= htmlspecialchars($row['full_name']) ?></td>
        <td><?= htmlspecialchars($row['email']) ?></td>
        <td><?= htmlspecialchars($row['phone']) ?></td>
        <td><?= htmlspecialchars($row['id_type']) ?></td>
        <td><?= htmlspecialchars($row['status']) ?></td>
        <td><?= htmlspecialchars($row['submitted_at']) ?></td>
        <td>
            <a href="review.php?id=<?= $row['verification_id'] ?>">
                <button>Review</button>
            </a>
        </td>
    </tr>
    <?php endwhile; ?>
</table>
