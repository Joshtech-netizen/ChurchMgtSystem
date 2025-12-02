<?php
class Donation {
    private $conn;
    private $table = 'donations';

    public $id;
    public $member_id;
    public $amount;
    public $type;
    public $donation_date;
    public $notes;
    // Extra properties for the JOIN (Member Name)
    public $member_name; 

    public function __construct($db) {
        $this->conn = $db;
    }

    // READ (with Member Name)
    public function read() {
        // We select all donation columns + the member's name
        $query = "SELECT 
                    d.id, d.member_id, d.amount, d.type, d.donation_date, d.notes,
                    m.first_name, m.last_name
                  FROM " . $this->table . " d
                  LEFT JOIN members m ON d.member_id = m.id
                  ORDER BY d.donation_date DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET member_id=:member_id, amount=:amount, type=:type, donation_date=:donation_date, notes=:notes";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->amount = htmlspecialchars(strip_tags($this->amount));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->donation_date = htmlspecialchars(strip_tags($this->donation_date));
        $this->notes = htmlspecialchars(strip_tags($this->notes));
        // member_id is an integer, so we don't strictly need strip_tags, but good practice
        $this->member_id = htmlspecialchars(strip_tags($this->member_id));

        // Bind
        $stmt->bindParam(":member_id", $this->member_id);
        $stmt->bindParam(":amount", $this->amount);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":donation_date", $this->donation_date);
        $stmt->bindParam(":notes", $this->notes);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>