<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "coc-eff_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed"]));
}

// 1. Get Total Members
$memberQuery = $conn->query("SELECT COUNT(*) as count FROM members WHERE status='Active'");
$memberCount = $memberQuery->fetch_assoc()['count'];

// 2. Get Total Revenue (All Time)
$financeQuery = $conn->query("SELECT SUM(amount) as total FROM contributions");
$financeTotal = $financeQuery->fetch_assoc()['total'] ?? 0;

// 3. Get Recent Activity (Last 5 events for a timeline)
$historyQuery = $conn->query("
    (SELECT 'member' as type, CONCAT(first_name, ' ', surname) as text, id as ref_id, NULL as date_val FROM members ORDER BY id DESC LIMIT 3)
    UNION
    (SELECT 'finance' as type, CONCAT(category, ': GHS ', amount) as text, id as ref_id, date as date_val FROM contributions ORDER BY id DESC LIMIT 3)
    LIMIT 5
");

$recent = [];
while($row = $historyQuery->fetch_assoc()) {
    $recent[] = $row;
}

echo json_encode([
    "total_members" => $memberCount,
    "total_revenue" => $financeTotal,
    "recent_activity" => $recent
]);

$conn->close();
?>