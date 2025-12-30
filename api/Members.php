<?php
// church-system/api/members.php

// 1. HEADERS (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

// 2. DATABASE CREDENTIALS (Adjust if yours are different)
$host = "localhost";
$user = "root";     // Default XAMPP user
$pass = "";         // Default XAMPP password (usually empty)
$db_name = "church_db"; // <--- CHANGE THIS to your actual DB name

// 3. CONNECT
$conn = new mysqli($host, $user, $pass, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500); // Server Error
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// 4. QUERY
$sql = "SELECT id, name, email, role, status FROM members";
$result = $conn->query($sql);

$members = [];

if ($result->num_rows > 0) {
    // Loop through results and add to array
    while($row = $result->fetch_assoc()) {
        // Ensure ID is a number (sometimes PHP sends it as string)
        $row['id'] = (int)$row['id'];
        $members[] = $row;
    }
}

// 5. OUTPUT
echo json_encode($members);

// Close connection
$conn->close();
?>