<?php
class Database {
    // DB Params - CHANGE THESE TO MATCH YOUR LOCAL SERVER
    private $host = "localhost";
    private $db_name = "church_db";
    private $username = "root";
    private $password = ""; // Default XAMPP password is usually empty

    public $conn;

    // DB Connect
    public function getConnection() {
        $this->conn = null;

        try {
            // Create the Data Source Name (DSN)
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8";
            
            // Create the PDO instance
            $this->conn = new PDO($dsn, $this->username, $this->password);
            
            // Set Error Mode to Exception (Crucial for debugging)
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Set default fetch mode to Associative Array (returns result as ['name' => 'John'])
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        } catch(PDOException $e) {
            // In a real production app, you would log this to a file, not echo it
            echo "Connection Error: " . $e->getMessage();
        }

        return $this->conn;
    }
}
?>