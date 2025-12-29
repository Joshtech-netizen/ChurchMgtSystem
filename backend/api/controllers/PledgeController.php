<?php
class PledgeController {
    private $db;
    private $pledge;

    public function __construct($db) {
        $this->db = $db;
        $this->pledge = new Pledge($db);
    }

    public function processRequest($method, $id) {
        if ($method === 'GET') {
            $stmt = $this->pledge->read();
            $pledges = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // Format name
            foreach($pledges as &$p) {
                $p['member_name'] = $p['first_name'] . ' ' . $p['last_name'];
            }
            echo json_encode($pledges);
        } elseif ($method === 'POST') {
            $this->createPledge();
        } elseif ($method === 'PUT') {
            // Used to update payment amount
            $data = json_decode(file_get_contents("php://input"));
            $this->pledge->id = $id;
            if ($this->pledge->updatePayment($data->amount)) {
                echo json_encode(["message" => "Pledge updated."]);
            }
        }
    }

    private function createPledge() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->member_id) && !empty($data->amount_promised)) {
            $this->pledge->member_id = $data->member_id;
            $this->pledge->campaign_name = $data->campaign_name;
            $this->pledge->amount_promised = $data->amount_promised;
            $this->pledge->deadline = $data->deadline;

            if ($this->pledge->create()) {
                http_response_code(201);
                echo json_encode(["message" => "Pledge created."]);
            } else {
                http_response_code(503);
            }
        }
    }
}
?>