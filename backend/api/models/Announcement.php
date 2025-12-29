<?php
class Announcement {
    private $conn;
    private $table = 'announcements';

    public $id;
    public $subject;
    public $message;
    public $recipient_group;
    public $sent_count;
    public $sent_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // READ HISTORY
    public function read() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY sent_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // LOG SENT EMAIL
    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET subject=:subject, message=:message, recipient_group=:recipient_group, sent_count=:sent_count";
        
        $stmt = $this->conn->prepare($query);

        $this->subject = htmlspecialchars(strip_tags($this->subject));
        $this->message = htmlspecialchars(strip_tags($this->message));
        $this->recipient_group = htmlspecialchars(strip_tags($this->recipient_group));
        $this->sent_count = htmlspecialchars(strip_tags($this->sent_count));

        $stmt->bindParam(":subject", $this->subject);
        $stmt->bindParam(":message", $this->message);
        $stmt->bindParam(":recipient_group", $this->recipient_group);
        $stmt->bindParam(":sent_count", $this->sent_count);

        if($stmt->execute()) return true;
        return false;
    }
}
?>