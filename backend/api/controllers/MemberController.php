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

    // Handle /members (GET ALL, POST Create)
    private function processCollectionRequest($method) {
        switch ($method) {
            case 'GET':
                $stmt = $this->member->read();
                $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($members);
                break;

            case 'POST':
                $data = (object) $_POST; // Use $_POST for FormData
                if ($this->validate($data)) {
                    $this->fillModel($data);
                    // Handle File Upload
                    $this->member->photo = $this->handleFileUpload();

                    if($this->member->create()) {
                        http_response_code(201);
                        echo json_encode(["message" => "Member created."]);
                    } else {
                        http_response_code(503);
                        echo json_encode(["message" => "Unable to create member."]);
                    }
                } else {
                    $this->sendBadRequest();
                }
                break;
            default: http_response_code(405); break;
        }
    }

    // Handle /members/{id} (GET One, POST Update, DELETE)
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

            // USE POST FOR UPDATES WITH FILES (Trick to bypass PUT limitations)
            case 'POST': 
            case 'PUT':
                // Check if it's FormData (POST) or Raw JSON (PUT)
                $data = !empty($_POST) ? (object) $_POST : json_decode(file_get_contents("php://input"));
                
                if ($this->validate($data)) {
                    $this->fillModel($data);
                    
                    // Handle File Upload (Returns filename or null)
                    $newPhoto = $this->handleFileUpload();
                    if ($newPhoto) {
                        $this->member->photo = $newPhoto;
                    }

                    if($this->member->update()) {
                        echo json_encode(["message" => "Member updated."]);
                    } else {
                        http_response_code(503);
                        echo json_encode(["message" => "Unable to update member."]);
                    }
                } else {
                    $this->sendBadRequest();
                }
                break;

            case 'DELETE':
                if($this->member->delete()) {
                    echo json_encode(["message" => "Member deleted."]);
                } else {
                    http_response_code(503);
                    echo json_encode(["message" => "Unable to delete."]);
                }
                break;
            default: http_response_code(405); break;
        }
    }

    // --- HELPER FUNCTIONS ---

    private function handleFileUpload() {
        if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $_FILES['photo']['tmp_name'];
            $fileName = $_FILES['photo']['name'];
            $fileSize = $_FILES['photo']['size'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));

            $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg');

            if ($fileSize > 1048576) { // 1MB
                return null; // Fail silently or throw error in real app
            }

            if (in_array($fileExtension, $allowedfileExtensions)) {
                $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
                $uploadFileDir = __DIR__ . '/../uploads/';
                
                if (!is_dir($uploadFileDir)) { mkdir($uploadFileDir, 0755, true); }
                
                if(move_uploaded_file($fileTmpPath, $uploadFileDir . $newFileName)) {
                    return $newFileName;
                }
            }
        }
        return null;
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

    private function sendBadRequest() {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }
}
?>