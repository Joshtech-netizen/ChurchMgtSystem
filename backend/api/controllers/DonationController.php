<?php
class DonationController {
    private $db;
    private $donation;

    public function __construct($db) {
        $this->db = $db;
        $this->donation = new Donation($db);
    }

    public function processRequest($method, $id) {
        if ($method === 'GET') {
            // NEW: Check for stats request
            if (isset($_GET['stats'])) {
                $this->getStats();
            } else {
                $this->getAll();
            }
        } elseif ($method === 'POST') {
            $this->create();
        }
        // ... (keep PUT/DELETE if you added them)
    }

    private function getAll() {
        // 1. Get query params from URL (e.g., ?start=2023-01-01&end=2023-01-31)
        $start_date = isset($_GET['start']) ? $_GET['start'] : null;
        $end_date = isset($_GET['end']) ? $_GET['end'] : null;

        // 2. Pass them to the model
        $stmt = $this->donation->read($start_date, $end_date);
        $donations = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $item = array(
                'id' => $row['id'],
                'amount' => $row['amount'],
                'type' => $row['type'],
                'date' => $row['donation_date'],
                'notes' => $row['notes'],
                'member_name' => $row['first_name'] ? $row['first_name'] . ' ' . $row['last_name'] : 'Unknown'
            );
            array_push($donations, $item);
        }
        echo json_encode($donations);
    }
    
    private function create() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->amount) && !empty($data->date)) {
            $this->donation->member_id = $data->member_id;
            $this->donation->amount = $data->amount;
            $this->donation->type = $data->type;
            $this->donation->donation_date = $data->date;
            $this->donation->notes = $data->notes ?? '';

            if($this->donation->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Donation recorded."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Unable to record donation."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }

    private function getStats() {
        try {
            // Group by Month, Filter by 'offering' (or remove filter to see all money)
            // Last 6 Months
            $query = "SELECT 
                        DATE_FORMAT(donation_date, '%M') as month, 
                        SUM(amount) as total 
                      FROM donations 
                      WHERE type = 'offering' 
                      AND donation_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                      GROUP BY YEAR(donation_date), MONTH(donation_date)
                      ORDER BY donation_date ASC";

            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($data);
        } catch (Exception $e) {
            echo json_encode([]);
        }
    }
}
?>