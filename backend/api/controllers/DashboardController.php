<?php
class DashboardController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getStats() {
        $stats = [
            'total_members' => 0,
            'monthly_donations' => 0,
            'attendance_today' => 0,
            'upcoming_events' => 0 // New Field
        ];

        try {
            // 1. Total Members
            $query = "SELECT COUNT(*) as total FROM members WHERE status != 'inactive'";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats['total_members'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // 2. Monthly Donations
            $query = "SELECT SUM(amount) as total FROM donations 
                      WHERE MONTH(donation_date) = MONTH(CURRENT_DATE()) 
                      AND YEAR(donation_date) = YEAR(CURRENT_DATE())";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['monthly_donations'] = $result['total'] ?? 0;

            // 3. Attendance Today
            $query = "SELECT COUNT(*) as total FROM attendance WHERE attendance_date = CURRENT_DATE()";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats['attendance_today'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // 4. Upcoming Events (From today onwards)
            $query = "SELECT COUNT(*) as total FROM events WHERE event_date >= CURRENT_DATE()";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats['upcoming_events'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            echo json_encode($stats);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error fetching stats"]);
        }
    }
}
?>