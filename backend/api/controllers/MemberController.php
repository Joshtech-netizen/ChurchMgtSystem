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

    // Handle /members (GET ALL, POST)
    private function processCollectionRequest($method) {
        switch ($method) {
            case 'GET':
                $stmt = $this->member->read();
                $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($members);
                break;

            case 'POST':
                $data = json_decode(file_get_contents("php://input"));
                if($this->validate($data)) {
                    $this->fillModel($data);
                    if($this->member->create()) {
                        http_response_code(201);
                        echo json_encode(["message" => "Member created."]);
                    } else {
                        http_response_code(503);
                        echo json_encode(["message" => "Unable to create member."]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Incomplete data."]);
                }
                break;

            default:
                http_response_code(405); break;
        }
    }

    // Handle /members/{id} (GET ONE, PUT, DELETE)
    private function processResourceRequest($method, $id) {
        $this->member->id = $id;
        
        // Ensure member exists
        if($this->member->read_single()->rowCount() == 0) {
            http_response_code(404);
            echo json_encode(["message" => "Member not found."]);
            return;
        }

        switch ($method) {
            case 'GET':
                $row = $this->member->read_single()->fetch(PDO::FETCH_ASSOC);
                echo json_encode($row);
                break;

            case 'PUT': // Update
                $data = json_decode(file_get_contents("php://input"));
                if($this->validate($data)) {
                    $this->fillModel($data);
                    if($this->member->update()) {
                        echo json_encode(["message" => "Member updated."]);
                    } else {
                        http_response_code(503);
                        echo json_encode(["message" => "Unable to update member."]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["message" => "Incomplete data."]);
                }
                break;

            case 'DELETE': // Delete
                if($this->member->delete()) {
                    echo json_encode(["message" => "Member deleted."]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to delete member."]);
                }
                break;

            default:
                http_response_code(405); break;
        }
    }

    private function validate($data) {
        return !empty($data->first_name) && !empty($data->last_name) && !empty($data->email);
    }

    private function fillModel($data) {
        $this->member->first_name = $data->first_name;
        $this->member->last_name = $data->last_name;
        $this->member->email = $data->email;
        $this->member->phone = $data->phone ?? '';
        $this->member->status = $data->status ?? 'active';
    }
}
?>