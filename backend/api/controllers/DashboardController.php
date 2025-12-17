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
            'upcoming_events' => 0,
            'chart_data' => [] // New Array for the Graph
        ];

        try {
            // 1. Basic Counts (Same as before)
            $query = "SELECT COUNT(*) as total FROM members WHERE status != 'inactive'";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats['total_members'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            $query = "SELECT SUM(amount) as total FROM donations 
                      WHERE MONTH(donation_date) = MONTH(CURRENT_DATE()) 
                      AND YEAR(donation_date) = YEAR(CURRENT_DATE())";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $stats['monthly_donations'] = $result['total'] ?? 0;

            $query = "SELECT COUNT(*) as total FROM attendance WHERE attendance_date = CURRENT_DATE()";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats['attendance_today'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            $query = "SELECT COUNT(*) as total FROM events WHERE event_date >= CURRENT_DATE()";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats['upcoming_events'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // 2. CHART DATA: Get Attendance counts for the last 5 events
            // We group by event and count the attendance rows
            $chartQuery = "SELECT e.title, COUNT(a.id) as count 
                           FROM events e
                           LEFT JOIN attendance a ON e.id = a.event_id
                           GROUP BY e.id
                           ORDER BY e.event_date DESC 
                           LIMIT 5";
            
            $stmt = $this->db->prepare($chartQuery);
            $stmt->execute();
            
            // We need to reverse it so the oldest is on the left, newest on right
            $raw_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stats['chart_data'] = array_reverse($raw_data);

            echo json_encode($stats);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error fetching stats"]);
        }
    }
}