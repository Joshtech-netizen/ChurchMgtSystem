<?php
class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function emailExists() {
        $query = "SELECT id, first_name, last_name, password, role FROM " . $this->table . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " SET first_name=:first, last_name=:last, email=:email, password=:pass, role=:role";
        $stmt = $this->conn->prepare($query);
        
        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $password_hash = password_hash($this->password, PASSWORD_DEFAULT);

        $stmt->bindParam(':first', $this->first_name);
        $stmt->bindParam(':last', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':pass', $password_hash);
        $stmt->bindParam(':role', $this->role);

        if($stmt->execute()) return true;
        return false;
    }

    // --- NEW: UPDATE FUNCTION ---
    public function update() {
        $query = "UPDATE " . $this->table . " SET first_name=:first, last_name=:last, email=:email";
        
        // Only update password if provided
        if(!empty($this->password)) {
            $query .= ", password=:pass";
        }
        
        $query .= " WHERE id=:id";
        
        $stmt = $this->conn->prepare($query);

        $this->first_name = htmlspecialchars(strip_tags($this->first_name));
        $this->last_name = htmlspecialchars(strip_tags($this->last_name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':first', $this->first_name);
        $stmt->bindParam(':last', $this->last_name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':id', $this->id);

        if(!empty($this->password)) {
            $password_hash = password_hash($this->password, PASSWORD_DEFAULT);
            $stmt->bindParam(':pass', $password_hash);
        }

        if($stmt->execute()) return true;
        return false;
    }
}
?>