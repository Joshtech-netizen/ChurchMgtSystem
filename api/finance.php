<?php
// church-system/api/finance.php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$pass = "";
$db_name = "coc-eff_db";

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Fetch all transactions, joining with members table to get names (if they exist)
        // IF member_id is NULL, m.first_name will be NULL, which is fine.
        $sql = "SELECT c.id, c.amount, c.date, c.category, c.notes, m.first_name, m.surname 
                FROM contributions c 
                LEFT JOIN members m ON c.member_id = m.id 
                ORDER BY c.date DESC";
        
        $result = $conn->query($sql);
        $data = [];
        if ($result) {
            while($row = $result->fetch_assoc()) {
                $row['id'] = (int)$row['id'];
                $row['amount'] = (float)$row['amount'];
                $data[] = $row;
            }
        }
        echo json_encode($data);
        break;

    case 'POST':
        // Add a new Contribution
        $data = json_decode(file_get_contents("php://input"));
        
        // VALIDATION: We require Amount and Category. Member is OPTIONAL.
        if(!empty($data->amount) && !empty($data->category)) {
            
            // LOGIC: If 'member_id' is sent, use it. If not, set it to NULL.
            $member_id = !empty($data->member_id) ? $data->member_id : NULL;
            $notes = !empty($data->notes) ? $data->notes : "Sunday Service";

            $stmt = $conn->prepare("INSERT INTO contributions (member_id, amount, date, category, notes) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("idsss", $member_id, $data->amount, $data->date, $data->category, $notes);
            
            if($stmt->execute()) {
                echo json_encode(["message" => "Contribution recorded", "id" => $conn->insert_id]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Error: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Amount and Category are required"]);
        }
        break;
}

$conn->close();
?>