<?php
class Member {
    private $conn;
    private $table = 'members';

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $phone;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    // GET ALL
    public function read() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // GET SINGLE
    public function read_single() {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET first_name=:first_name, last_name=:last_name, email=:email, phone=:phone, status=:status";
        $stmt = $this->conn->prepare($query);

        // Sanitize & Bind
        $this->bindParams($stmt);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // UPDATE
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET first_name=:first_name, last_name=:last_name, email=:email, phone=:phone, status=:status
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize & Bind
        $this->bindParams($stmt);
        // Bind ID specifically for Update
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Helper to keep code clean
    private function bindParams($stmt) {
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->status = htmlspecialchars(strip_tags($this->status));

        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':status', $this->status);
    }
}
?>