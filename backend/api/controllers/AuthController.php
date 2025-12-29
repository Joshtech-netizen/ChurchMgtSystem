<?php
include_once __DIR__ . '/../utils/JwtHandler.php';

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    // ... Login and Register functions remain the same ...
    public function login() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->email) && !empty($data->password)) {
            $this->user->email = $data->email;
            if($this->user->emailExists()) {
                if(password_verify($data->password, $this->user->password)) {
                    $jwt = new JwtHandler();
                    $token = $jwt->encode([
                        'user_id' => $this->user->id,
                        'email' => $this->user->email,
                        'role' => $this->user->role,
                        'exp' => time() + (60 * 60 * 24)
                    ]);
                    http_response_code(200);
                    echo json_encode([
                        "message" => "Login successful.",
                        "token" => $token,
                        "user" => [
                            "id" => $this->user->id, // Important for profile update
                            "first_name" => $this->user->first_name,
                            "last_name" => $this->user->last_name,
                            "role" => $this->user->role,
                            "email" => $this->user->email
                        ]
                    ]);
                } else {
                    http_response_code(401); echo json_encode(["message" => "Invalid password."]);
                }
            } else {
                http_response_code(401); echo json_encode(["message" => "Email not found."]);
            }
        } else {
            http_response_code(400); echo json_encode(["message" => "Incomplete data."]);
        }
    }

    public function register() {
        // ... (Keep existing register logic) ...
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->first_name) && !empty($data->last_name) && !empty($data->email) && !empty($data->password)){
            $this->user->first_name = $data->first_name;
            $this->user->last_name = $data->last_name;
            $this->user->email = $data->email;
            $this->user->password = $data->password;
            $this->user->role = $data->role ?? 'admin'; 

            if($this->user->emailExists()){
                http_response_code(400); echo json_encode(["message" => "Email exists."]);
            } else {
                if($this->user->create()){
                    http_response_code(201); echo json_encode(["message" => "User registered."]);
                } else {
                    http_response_code(503); echo json_encode(["message" => "Unable to register."]);
                }
            }
        } else {
            http_response_code(400); echo json_encode(["message" => "Incomplete data."]);
        }
    }

    // --- NEW: UPDATE PROFILE ---
    public function updateProfile() {
        $data = json_decode(file_get_contents("php://input"));
        
        // We need the ID to know who to update
        if (!empty($data->id)) {
            $this->user->id = $data->id;
            $this->user->first_name = $data->first_name;
            $this->user->last_name = $data->last_name;
            $this->user->email = $data->email;
            
            // Only update password if a new one is provided
            if (!empty($data->password)) {
                $this->user->password = $data->password; // Will be hashed in Model
            }

            if($this->user->update()){
                http_response_code(200);
                echo json_encode(["message" => "Profile updated successfully."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to update profile."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Missing User ID."]);
        }
    }

    // --- ADMIN: GET ALL USERS ---
    public function getAllUsers() {
        // Simple query to get all staff
        $query = "SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY role ASC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // --- ADMIN: CREATE USER ---
    public function adminCreateUser() {
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->first_name) && !empty($data->last_name) && !empty($data->email) && !empty($data->password) && !empty($data->role)){
            $this->user->first_name = $data->first_name;
            $this->user->last_name = $data->last_name;
            $this->user->email = $data->email;
            $this->user->password = $data->password;
            $this->user->role = $data->role;

            if($this->user->emailExists()){
                http_response_code(400); echo json_encode(["message" => "Email exists."]);
            } else {
                if($this->user->create()){
                    http_response_code(201); echo json_encode(["message" => "User created."]);
                } else {
                    http_response_code(503); echo json_encode(["message" => "Unable to create user."]);
                }
            }
        } else {
            http_response_code(400); echo json_encode(["message" => "Incomplete data. Please provide all required fields."]);
        }
    }

    // --- ADMIN: DELETE USER ---
    public function deleteUser($id) {
        $query = "DELETE FROM users WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "User deleted."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete."]);
        }
    }
}
?>