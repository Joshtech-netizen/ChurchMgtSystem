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
                // 1. Check if this is a File Upload (Form Data) or JSON
                $data = null;
                $photoName = null;

                if (!empty($_FILES)) {
                    // --- HANDLE FILE UPLOAD ---
                    // a. Validate Data from $_POST (because FormData puts text in $_POST)
                    $data = (object) $_POST;
                    
                    // b. Validate Image
                    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                        $fileTmpPath = $_FILES['photo']['tmp_name'];
                        $fileName = $_FILES['photo']['name'];
                        $fileSize = $_FILES['photo']['size'];
                        $fileNameCmps = explode(".", $fileName);
                        $fileExtension = strtolower(end($fileNameCmps));

                        // ALLOWED EXTENSIONS
                        $allowedfileExtensions = array('jpg', 'gif', 'png', 'jpeg');

                        // 1MB LIMIT (1048576 bytes)
                        if ($fileSize > 1048576) {
                            http_response_code(400);
                            echo json_encode(["message" => "File too large. Max 1MB."]);
                            return;
                        }

                        if (in_array($fileExtension, $allowedfileExtensions)) {
                            // Generate unique name to prevent overwriting
                            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;
                            $uploadFileDir = __DIR__ . '/../uploads/';
                            
                            // Create directory if it doesn't exist
                            if (!is_dir($uploadFileDir)) {
                                mkdir($uploadFileDir, 0755, true);
                            }

                            $dest_path = $uploadFileDir . $newFileName;

                            if(move_uploaded_file($fileTmpPath, $dest_path)) {
                                $photoName = $newFileName;
                            } else {
                                http_response_code(500);
                                echo json_encode(["message" => "Error moving file to upload folder."]);
                                return;
                            }
                        } else {
                            http_response_code(400);
                            echo json_encode(["message" => "Invalid file type. Only JPG, PNG, GIF allowed."]);
                            return;
                        }
                    }
                } else {
                    // Standard JSON Request (No file)
                    $data = json_decode(file_get_contents("php://input"));
                }

                // 2. Save to Database
                if($this->validate($data)) {
                    $this->fillModel($data);
                    // Add the photo name to the model
                    $this->member->photo = $photoName;

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