<?php
class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $first_name;
    public $last_name;
    public $email;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public $role; // Add property

    public function emailExists() {
        // Added 'role' to the SELECT list
        $query = "SELECT id, first_name, last_name, password, role
                  FROM " . $this->table . " 
                  WHERE email = ? LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->email);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->id = $row['id'];
            $this->first_name = $row['first_name'];
            $this->last_name = $row['last_name'];
            $this->password = $row['password'];
            $this->role = $row['role']; // Store the role
            return true;
        }
        return false;
    }
}
?>