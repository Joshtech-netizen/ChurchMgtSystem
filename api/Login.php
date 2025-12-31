<?php
// church-system/api/login.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

$conn = new mysqli("localhost", "root", "", "coc-eff_db");

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->username) && !empty($data->password)) {
    $username = $conn->real_escape_string($data->username);
    
    // 1. Find User
    $sql = "SELECT id, username, password_hash, role FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // 2. Verify Password
        if(password_verify($data->password, $user['password_hash'])) {
            // SUCCESS: Return a simple "token" (In a real app, use JWT)
            // We return the user info so React knows who logged in
            echo json_encode([
                "message" => "Login successful",
                "token" => bin2hex(random_bytes(16)), // Simple fake token
                "user" => [
                    "id" => $user['id'],
                    "username" => $user['username'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(["message" => "Invalid password"]);
        }
    } else {
        http_response_code(404); // User not found
        echo json_encode(["message" => "User not found"]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete credentials"]);
}
$conn->close();
?>