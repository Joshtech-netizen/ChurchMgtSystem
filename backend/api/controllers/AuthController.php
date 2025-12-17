<?php
include_once __DIR__ . '/../utils/JwtHandler.php';

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function login() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->email) && !empty($data->password)) {
            $this->user->email = $data->email;

            if($this->user->emailExists()) {
                if(password_verify($data->password, $this->user->password)) {
                    $jwt = new JwtHandler();
                    $token_data = [
                        'user_id' => $this->user->id,
                        'email' => $this->user->email,
                        'role' => $this->user->role,
                        'exp' => time() + (60 * 60 * 24)
                    ];
                    $token = $jwt->encode($token_data);

                    http_response_code(200);
                    echo json_encode([
                        "message" => "Login successful.",
                        "token" => $token,
                        "user" => [
                            "first_name" => $this->user->first_name,
                            "last_name" => $this->user->last_name,
                            "role" => $this->user->role
                        ]
                    ]);
                } else {
                    http_response_code(401);
                    echo json_encode(["message" => "Invalid password."]);
                }
            } else {
                http_response_code(401);
                echo json_encode(["message" => "Email not found."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Data is incomplete."]);
        }
    }

    public function register() {
        $data = json_decode(file_get_contents("php://input"));

        if(
            !empty($data->first_name) &&
            !empty($data->last_name) &&
            !empty($data->email) &&
            !empty($data->password)
        ){
            $this->user->first_name = $data->first_name;
            $this->user->last_name = $data->last_name;
            $this->user->email = $data->email;
            $this->user->password = $data->password;
            // Default role is 'admin' for now, or you could make this 'finance', 'youth' via dropdown
            $this->user->role = 'admin'; 

            if($this->user->emailExists()){
                http_response_code(400);
                echo json_encode(["message" => "Email already exists."]);
            } else {
                if($this->user->create()){
                    http_response_code(201);
                    echo json_encode(["message" => "User registered successfully."]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to register user."]);
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }
}
?>