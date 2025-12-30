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
        $first_name = $_POST['first_name'] ?? '';
        $surname = $_POST['surname'] ?? '';
        $other_names = $_POST['other_names'] ?? '';
        $dob = $_POST['dob'] ?? '';
        $address = $_POST['address'] ?? '';
        $mobile = $_POST['mobile'] ?? '';
        $role = $_POST['role'] ?? 'Member';
        $status = $_POST['status'] ?? 'Active';
        $email = $_POST['email'] ?? '';

        if(empty($first_name) || empty($surname)) {
            http_response_code(400);
            echo json_encode(["message" => "Name fields are required."]);
            exit();
        }

        // 2. HANDLE PHOTO UPLOAD
        $photo_url = ""; // Default empty
        
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
            $upload_dir = "uploads/";
            // Create unique name: member_TIMESTAMP_filename.jpg
            $file_name = "member_" . time() . "_" . basename($_FILES['photo']['name']);
            $target_file = $upload_dir . $file_name;

            if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
                // Save the full URL so React can display it easily
                $photo_url = "http://localhost/church-system/api/" . $target_file;
            }
        }

        // 3. INSERT INTO DB
        $stmt = $conn->prepare("INSERT INTO members (first_name, surname, other_names, dob, address, mobile, email, role, status, photo_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param("ssssssssss", $first_name, $surname, $other_names, $dob, $address, $mobile, $email, $role, $status, $photo_url);
        
        if($stmt->execute()) {
            echo json_encode(["message" => "Member created", "id" => $conn->insert_id, "photo_url" => $photo_url]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Database error: " . $stmt->error]);
        }
        $stmt->close();
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