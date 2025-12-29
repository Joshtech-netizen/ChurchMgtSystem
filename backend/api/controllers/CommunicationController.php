<?php
class CommunicationController {
    private $db;
    private $announcement;

    public function __construct($db) {
        $this->db = $db;
        $this->announcement = new Announcement($db);
    }

    public function processRequest($method) {
        switch ($method) {
            case 'GET':
                $stmt = $this->announcement->read();
                $history = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($history);
                break;

            case 'POST':
                $this->dispatchMessage();
                break;
                
            default: http_response_code(405); break;
        }
    }

    private function dispatchMessage() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->message) && !empty($data->group) && !empty($data->type)) {
            
            // 1. SELECT RECIPIENTS
            if ($data->type === 'sms') {
                $query = "SELECT phone as contact FROM members WHERE status != 'inactive' AND phone IS NOT NULL AND phone != ''";
            } else {
                $query = "SELECT email as contact FROM members WHERE status != 'inactive' AND email IS NOT NULL AND email != ''";
            }

            // Filter by group (simplified for brevity)
            if ($data->group !== 'all' && $data->group !== 'staff') {
                // Add specific group logic here if needed
            }

            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($rows) === 0) {
                echo json_encode(["message" => "No recipients found with valid contact info."]);
                return;
            }

            $count = 0;
            $errors = []; // Collect errors for debugging

            // 2. SEND LOOP
            foreach($rows as $row) {
                $contact = $row['contact'];
                if ($data->type === 'sms') {
                    // FORMAT NUMBER: Convert '024...' to '+23324...'
                    // CHANGE '233' TO YOUR COUNTRY CODE
                    $formattedPhone = $this->formatPhoneNumber($contact, '233'); 
                    
                    $result = $this->sendSMSviaGateway($formattedPhone, $data->message);
                    if ($result['success']) {
                        $count++;
                    } else {
                        $errors[] = "Failed for $contact: " . $result['error'];
                    }
                } else {
                    // mail($contact, $data->subject, $data->message);
                    $count++;
                }
            }

            // 3. LOG RESULT
            $subject = ($data->type === 'sms') ? "SMS: " . substr($data->message, 0, 20) . "..." : $data->subject;
            
            // Log to DB (Skipped code for brevity, same as before)
            // ... [Insert Log Logic Here] ...

            if ($count > 0) {
                http_response_code(201);
                echo json_encode(["message" => strtoupper($data->type) . " sent to $count recipients."]);
            } else {
                // Return the actual errors to the frontend so you can see what happened
                http_response_code(500);
                echo json_encode([
                    "message" => "Failed to send to any recipients.",
                    "debug_errors" => $errors 
                ]);
            }

        } else {
            http_response_code(400);
            echo json_encode(["message" => "Incomplete data."]);
        }
    }

    // --- HELPER: Format Phone Number ---
    private function formatPhoneNumber($phone, $countryCode) {
        // Remove spaces, dashes, parentheses
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // If it starts with '0', remove it and add country code
        if (substr($phone, 0, 1) === '0') {
            $phone = $countryCode . substr($phone, 1);
        }
        
        // Add '+' if missing
        if (substr($phone, 0, 1) !== '+') {
            $phone = '+' . $phone;
        }
        
        return $phone;
    }


    /**
     * REAL SMS INTEGRATION */
    private function sendSMSviaGateway($phone, $message) {
        // --- TWILIO CONFIGURATION ---
        $sid    = "AC029be0765d53bbc628f81af0da324415";    // Replace with AC...
        $token  = "c9d41652c5cc4942df6a9e6ef6593efb";     // Replace with your Token
        $sender = "+18577074743";                // Replace with your Twilio Number

        $url = "https://api.twilio.com/2010-04-01/Accounts/AC029be0765d53bbc628f81af0da324415/Messages.json";

        // Prepare Data
        $data = [
            'From' => $sender,
            'To'   => $phone,
            'Body' => $message
        ];

        // Send Request via cURL
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERPWD, "$sid:$token"); // Basic Auth
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Check for success (201 Created)
        if ($httpCode >= 200 && $httpCode < 300) {
            return ['success' => true];
        } else {
            // Return the specific error from Twilio
            return ['success' => false, 'error' => $response];
        }
    }
}
?>