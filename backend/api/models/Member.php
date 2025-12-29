<?php
class Member {
    private $conn;
    private $table = 'members';

    public $id;
    public $first_name;
    public $last_name;
    public $dob;
    public $email;
    public $phone;
    public $status;
    public $photo; 
    public $gender;  
    public $address; 

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
        $query = "INSERT INTO " . $this->table . " 
                  SET first_name=:first_name, 
                      last_name=:last_name, 
                      gender=:gender, 
                      email=:email, 
                      phone=:phone, 
                      dob=:dob, 
                      address=:address, 
                      status=:status, 
                      photo=:photo";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->dob = htmlspecialchars(strip_tags($this->dob));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->photo = htmlspecialchars(strip_tags($this->photo));

        // Bind
        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':dob', $this->dob);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':photo', $this->photo);

        if($stmt->execute()) return true;
        return false;
    }

    // UPDATE
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET first_name=:first_name, 
                      last_name=:last_name, 
                      gender=:gender, 
                      email=:email, 
                      phone=:phone, 
                      dob=:dob, 
                      address=:address, 
                      status=:status";
        
        if (!empty($this->photo)) { $query .= ", photo=:photo"; }
        
        $query .= " WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        // Sanitize & Bind Standard Params
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->dob = htmlspecialchars(strip_tags($this->dob));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->address = htmlspecialchars(strip_tags($this->address));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':first_name', $this->first_name);
        $stmt->bindParam(':last_name', $this->last_name);
        $stmt->bindParam(':gender', $this->gender);
        $stmt->bindParam(':dob', $this->dob);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);

        // Bind Photo ONLY if we are updating it
        if (!empty($this->photo)) {
            $this->photo = htmlspecialchars(strip_tags($this->photo));
            $stmt->bindParam(':photo', $this->photo);
        }

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