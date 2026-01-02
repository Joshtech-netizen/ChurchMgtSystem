<?php
// church-system/api/profile.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

$host = "localhost"; $user = "root"; $pass = ""; $db_name = "coc-eff_db";
$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500); 
    echo json_encode(["message" => "Database connection failed"]); 
    exit();
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->current_password) && !empty($data->new_password)) {
    
    $user_id = intval($data->user_id);
    
    // 1. FETCH CURRENT HASH
    $sql = "SELECT password_hash FROM users WHERE id = $user_id";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        
        // 2. VERIFY CURRENT PASSWORD
        if (password_verify($data->current_password, $row['password_hash'])) {
            
            // 3. HASH NEW PASSWORD & UPDATE
            $new_hash = password_hash($data->new_password, PASSWORD_DEFAULT);
            $update_sql = "UPDATE users SET password_hash = '$new_hash' WHERE id = $user_id";
            
            if ($conn->query($update_sql)) {
                echo json_encode(["message" => "Password updated successfully"]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to update password"]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Current password is incorrect"]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "User not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Missing required fields"]);
}

$conn->close();
?>