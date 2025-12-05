<?php
class Attendance {
    private $conn;
    private $table = 'attendance';

    public $member_id;
    public $attendance_date;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    // GET ALL ATTENDANCE FOR A SPECIFIC DATE
    public function getByDate($date) {
        // We join with members to get names
        $query = "SELECT a.id, a.member_id, a.status, m.first_name, m.last_name 
                  FROM " . $this->table . " a
                  JOIN members m ON a.member_id = m.id
                  WHERE a.attendance_date = :date";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':date', $date);
        $stmt->execute();
        return $stmt;
    }

    // CHECK IN (Create or Update)
    public function checkIn() {
        // 1. Check if record already exists
        $checkQuery = "SELECT id FROM " . $this->table . " 
                       WHERE member_id = :member_id AND attendance_date = :date";
        $stmt = $this->conn->prepare($checkQuery);
        $stmt->bindParam(':member_id', $this->member_id);
        $stmt->bindParam(':date', $this->attendance_date);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            // Already checked in, return true (or we could toggle it off)
            return true; 
        }

        // 2. Create new record
        $query = "INSERT INTO " . $this->table . " 
                  SET member_id=:member_id, attendance_date=:date, status=:status";
        
        $stmt = $this->conn->prepare($query);

        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->attendance_date = htmlspecialchars(strip_tags($this->attendance_date));
        $this->member_id = htmlspecialchars(strip_tags($this->member_id));

        $stmt->bindParam(":member_id", $this->member_id);
        $stmt->bindParam(":date", $this->attendance_date);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>