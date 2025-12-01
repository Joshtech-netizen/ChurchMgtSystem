<?php
class MemberController {
    private $db;
    private $member;

    public function __construct($db) {
        $this->db = $db;
        $this->member = new Member($db);
    }

    public function processRequest($method, $id) {
        if ($id) {
            $this->processResourceRequest($method, $id);
        } else {
            $this->processCollectionRequest($method);
        }
    }

    // Handles /members (GET all, POST new)
    private function processCollectionRequest($method) {
        switch ($method) {
            case 'GET':
                $stmt = $this->member->read();
                $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($members);
                break;

            case 'POST':
                // Get raw JSON data
                $data = json_decode(file_get_contents("php://input"));

                // Validate basic data
                if(!empty($data->first_name) && !empty($data->last_name) && !empty($data->email)) {
                    $this->member->first_name = $data->first_name;
                    $this->member->last_name = $data->last_name;
                    $this->member->email = $data->email;
                    $this->member->phone = $data->phone ?? '';
                    $this->member->status = $data->status ?? 'active';

                    if($this->member->create()) {
                        http_response_code(201);
                        echo json_encode(["message" => "Member created successfully."]);
                    } else {
                        http_response_code(503);
                        echo json_encode(["message" => "Unable to create member."]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Incomplete data. First Name, Last Name and Email are required."]);
                }
                break;

            default:
                http_response_code(405); // Method Not Allowed
                header("Allow: GET, POST");
                break;
        }
    }

    // Handles /members/{id} (GET one, PUT update, DELETE)
    private function processResourceRequest($method, $id) {
        $this->member->id = $id;
        
        // Check if ID exists first
        $check = $this->member->read_single();
        if($check->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(["message" => "Member not found."]);
            return;
        }

        switch ($method) {
            case 'GET':
                $row = $check->fetch(PDO::FETCH_ASSOC);
                echo json_encode($row);
                break;
            // PUT and DELETE can be added here later
            default:
                http_response_code(405);
                break;
        }
    }
}
?>