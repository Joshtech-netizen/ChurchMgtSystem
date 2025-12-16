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
    public $photo; 

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

    // CREATE (Updated with Photo)
    public function create() {
        // 2. Add 'photo=:photo' to the query
        $query = "INSERT INTO " . $this->table . " 
                  SET first_name=:first_name, last_name=:last_name, email=:email, phone=:phone, status=:status, photo=:photo";
        
        $stmt = $this->conn->prepare($query);

        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->status = htmlspecialchars(strip_tags($this->status));
        // 3. Sanitize photo
        $this->photo = htmlspecialchars(strip_tags($this->photo));

        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':status', $this->status);
        // 4. Bind photo
        $stmt->bindParam(':photo', $this->photo);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // UPDATE
    public function update() {
        // Note: For now, update doesn't handle photo replacement logic to keep it simple
        $query = "UPDATE " . $this->table . " 
                  SET first_name=:first_name, last_name=:last_name, email=:email, phone=:phone, status=:status
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':status', $this->status);
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
}
?>