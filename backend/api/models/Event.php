<?php
class Event {
    private $conn;
    private $table = 'events';

    public $id;
    public $title;
    public $event_date;
    public $location;
    public $description;

    public function __construct($db) {
        $this->conn = $db;
    }

    // READ (Upcoming Events First)
    public function read() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY event_date ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // CREATE
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET title=:title, event_date=:event_date, location=:location, description=:description";
        
        $stmt = $this->conn->prepare($query);

        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->event_date = htmlspecialchars(strip_tags($this->event_date));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->description = htmlspecialchars(strip_tags($this->description));

        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":event_date", $this->event_date);
        $stmt->bindParam(":location", $this->location);
        $stmt->bindParam(":description", $this->description);

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
        if($stmt->execute()) return true;
        return false;
    }
}
?>