<?php
class Pledge {
    private $conn;
    private $table = 'pledges';

    public $id;
    public $member_id;
    public $campaign_name;
    public $amount_promised;
    public $amount_paid;
    public $status;
    public $deadline;
    // Join Data
    public $member_name;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT p.*, m.first_name, m.last_name 
                  FROM " . $this->table . " p
                  JOIN members m ON p.member_id = m.id
                  ORDER BY p.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  SET member_id=:member_id, campaign_name=:campaign, amount_promised=:promised, deadline=:deadline";
        
        $stmt = $this->conn->prepare($query);

        $this->campaign_name = htmlspecialchars(strip_tags($this->campaign_name));
        $this->amount_promised = htmlspecialchars(strip_tags($this->amount_promised));
        $this->deadline = htmlspecialchars(strip_tags($this->deadline));

        $stmt->bindParam(":member_id", $this->member_id);
        $stmt->bindParam(":campaign", $this->campaign_name);
        $stmt->bindParam(":promised", $this->amount_promised);
        $stmt->bindParam(":deadline", $this->deadline);

        if($stmt->execute()) return true;
        return false;
    }

    // UPDATE PAYMENT (Increment Paid Amount)
    public function updatePayment($amount) {
        $query = "UPDATE " . $this->table . " 
                  SET amount_paid = amount_paid + :amount,
                      status = CASE WHEN amount_paid >= amount_promised THEN 'completed' ELSE 'active' END
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":amount", $amount);
        $stmt->bindParam(":id", $this->id);
        
        if($stmt->execute()) return true;
        return false;
    }
}
?>