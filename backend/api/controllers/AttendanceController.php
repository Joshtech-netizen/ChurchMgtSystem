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
                // Expect URL like: /attendance?date=2023-10-25
                $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
                $this->getAttendanceForDate($date);
                break;

            case 'POST':
                $this->markPresent();
                break;
                
            default:
                http_response_code(405); break;
        }
    }

    private function getAttendanceForDate($date) {
        $stmt = $this->attendance->getByDate($date);
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($records);
    }

    private function markPresent() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->member_id) && !empty($data->date)) {
            $this->attendance->member_id = $data->member_id;
            $this->attendance->attendance_date = $data->date;
            $this->attendance->status = $data->status ?? 'present';

            if($this->attendance->checkIn()) {
                http_response_code(201);
                echo json_encode(["message" => "Checked in successfully."]);
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