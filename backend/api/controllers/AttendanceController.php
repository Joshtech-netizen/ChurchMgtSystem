<?php
class AttendanceController {
    private $db;
    private $attendance;

    public function __construct($db) {
        $this->db = $db;
        $this->attendance = new Attendance($db);
    }

    public function processRequest($method) {
        switch ($method) {
            case 'GET':
                // Expect URL: /attendance?event_id=5
                $event_id = isset($_GET['event_id']) ? $_GET['event_id'] : null;
                if ($event_id) {
                    $this->getAttendanceForEvent($event_id);
                } else {
                    echo json_encode([]);
                }
                break;

            case 'POST':
                $this->markPresent();
                break;
                
            default: http_response_code(405); break;
        }
    }

    private function getAttendanceForEvent($event_id) {
        $stmt = $this->attendance->getByEvent($event_id);
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($records);
    }

    private function markPresent() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->member_id) && !empty($data->event_id)) {
            $this->attendance->member_id = $data->member_id;
            $this->attendance->event_id = $data->event_id;
            $this->attendance->status = $data->status ?? 'present';

            if($this->attendance->checkIn()) {
                http_response_code(201);
                echo json_encode(["message" => "Checked in."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Check-in failed."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }
}
?>