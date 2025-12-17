<?php
class Attendance {
    private $conn;
    private $table = 'attendance';

    public $member_id;
    public $event_id;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    // GET ATTENDANCE FOR SPECIFIC EVENT
    public function getByEvent($event_id) {
        $query = "SELECT a.member_id, a.status, m.first_name, m.last_name 
                  FROM " . $this->table . " a
                  JOIN members m ON a.member_id = m.id
                  WHERE a.event_id = :event_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':event_id', $event_id);
        $stmt->execute();
        return $stmt;
    }

    // CHECK IN (Link to Event)
    public function checkIn() {
        // 1. Check duplicate
        $checkQuery = "SELECT id FROM " . $this->table . " 
                       WHERE member_id = :member_id AND event_id = :event_id";
        $stmt = $this->conn->prepare($checkQuery);
        $stmt->bindParam(':member_id', $this->member_id);
        $stmt->bindParam(':event_id', $this->event_id);
        $stmt->execute();

        if($stmt->rowCount() > 0) return true; 

        // 2. Insert
        // Note: We still save attendance_date for legacy/reporting, 
        // but logic relies on event_id now.
        $query = "INSERT INTO " . $this->table . " 
                  SET member_id=:member_id, event_id=:event_id, status=:status, attendance_date=CURDATE()";
        
        $stmt = $this->conn->prepare($query);

        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->event_id = htmlspecialchars(strip_tags($this->event_id));
        $this->member_id = htmlspecialchars(strip_tags($this->member_id));

        $stmt->bindParam(":member_id", $this->member_id);
        $stmt->bindParam(":event_id", $this->event_id);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) return true;
        return false;
    }
}
?>