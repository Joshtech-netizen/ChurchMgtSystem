<?php
// church-system/api/members.php

// 1. HEADERS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle Preflight Requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. DATABASE CONFIG
$host = "sql103.infinityfree.com";
$user = "if0_40851054";
$pass = "coceffiduase25";
$db_name = "if0_40851054_church"; 

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
        // --- FETCH MEMBERS ---
        $sql = "SELECT * FROM members ORDER BY id DESC";
        $result = $conn->query($sql);
        
        $members = [];
        if ($result) {
            while($row = $result->fetch_assoc()) {
                // Ensure ID is an integer for React keys
                $row['id'] = (int)$row['id'];
                $members[] = $row;
            }
        }
        echo json_encode($members);
        break;

    case 'POST':
        // --- ADD MEMBER (With Photo Support) ---
        
        // A. HANDLE PHOTO UPLOAD FIRST
        $photo_url = ""; 
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0) {
            $upload_dir = "uploads/";
            
            // Create folder if it doesn't exist
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            // Create unique name
            $file_name = "member_" . time() . "_" . basename($_FILES['photo']['name']);
            $target_file = $upload_dir . $file_name;

            if (move_uploaded_file($_FILES['photo']['tmp_name'], $target_file)) {
                $photo_url = "http://localhost/church-system/api/" . $target_file;
            }
        }

        // B. PREPARE DATA (Use $_POST because we are using FormData)
        // We do NOT use json_decode here because files are involved.
        
        $first_name = $_POST['first_name'] ?? '';
        $surname = $_POST['surname'] ?? '';
        $gender = $_POST['gender'] ?? 'Male';       // Default if missing
        $ministry = $_POST['ministry'] ?? 'General'; // Default if missing
        $other_names = $_POST['other_names'] ?? '';
        $dob = $_POST['dob'] ?? NULL;
        $address = $_POST['address'] ?? '';
        $mobile = $_POST['mobile'] ?? '';
        $email = $_POST['email'] ?? '';
        $role = $_POST['role'] ?? 'Member';
        $status = $_POST['status'] ?? 'Active';

        // Check required fields
        if (empty($first_name) || empty($surname)) {
            http_response_code(400);
            echo json_encode(["message" => "First Name and Surname are required"]);
            exit();
        }

        // C. INSERT INTO DATABASE
        $sql = "INSERT INTO members (first_name, surname, gender, ministry, other_names, dob, address, mobile, email, photo_url, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["message" => "Database Error: " . $conn->error]);
            exit();
        }

        $stmt->bind_param("ssssssssssss", 
            $first_name, 
            $surname, 
            $gender, 
            $ministry, 
            $other_names, 
            $dob, 
            $address, 
            $mobile, 
            $email, 
            $photo_url, // Now this variable actually has a value!
            $role, 
            $status
        );

        if($stmt->execute()) {
            echo json_encode(["message" => "Member added successfully", "id" => $conn->insert_id]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Execute Error: " . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'DELETE':
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