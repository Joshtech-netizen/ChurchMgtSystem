<?php
// church-system/api/members.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle Preflight Requests (Security check from browser)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. DATABASE CONFIG
$host = "localhost";
$user = "root";
$pass = "";
$db_name = "coc-eff_db";

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// 3. ROUTER LOGIC
switch ($method) {
    case 'GET':
        // --- FETCH ALL MEMBERS ---
        $sql = "SELECT id, name, email, role, status FROM members ORDER BY id DESC";
        $result = $conn->query($sql);
        $members = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
                $members[] = $row;
            }
        }
        echo json_encode($members);
        break;

    case 'POST':
        // --- ADD NEW MEMBER ---
        // Read the JSON sent by React
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->name) && !empty($data->role)) {
            // Prepare statement to prevent hacking (SQL Injection)
            $stmt = $conn->prepare("INSERT INTO members (name, email, role, status) VALUES (?, ?, ?, ?)");
            $status = "Active"; // Default
            $stmt->bind_param("ssss", $data->name, $data->email, $data->role, $status);
            
            if($stmt->execute()) {
                // Send back the new ID so React can update the list immediately
                echo json_encode(["message" => "Member created", "id" => $conn->insert_id]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to create member."]);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
        break;

    case 'DELETE':
        // --- DELETE MEMBER ---
        // Get ID from URL (e.g. members.php?id=5)
        if (isset($_GET['id'])) {
            $id = intval($_GET['id']);
            $sql = "DELETE FROM members WHERE id = $id";
            
            if ($conn->query($sql) === TRUE) {
                echo json_encode(["message" => "Member deleted"]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to delete member"]);
            }
        }
        break;
}

$conn->close();
?>