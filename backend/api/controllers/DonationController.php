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
            $this->getAll();
        } elseif ($method === 'POST') {
            $this->create();
        } else {
            http_response_code(405);
        }
    }

    private function getAll() {
        $stmt = $this->donation->read();
        $donations = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // We restructure the data slightly to make it easy for React
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
}
?>