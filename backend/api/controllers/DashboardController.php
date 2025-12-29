<?php
class DashboardController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getStats() {
        // Initialize with empty defaults to prevent React errors
        $stats = [
            'total_members' => 0,
            'monthly_donations' => 0,
            'attendance_today' => 0,
            'upcoming_events' => 0,
            'chart_data' => [],
            'birthdays' => []
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

            // 4. Upcoming Events
            $query = "SELECT COUNT(*) as total FROM events WHERE event_date >= CURRENT_DATE()";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            $stats['upcoming_events'] = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

            // 5. CHART DATA (Last 5 Events)
            $chartQuery = "SELECT e.title, COUNT(a.id) as count 
                           FROM events e
                           LEFT JOIN attendance a ON e.id = a.event_id
                           GROUP BY e.id
                           ORDER BY e.event_date DESC 
                           LIMIT 5";
            $stmt = $this->db->prepare($chartQuery);
            $stmt->execute();
            $raw_data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $stats['chart_data'] = array_reverse($raw_data);

            // 6. BIRTHDAYS (This Month)
            $bdayQuery = "SELECT first_name, last_name, dob, photo 
                          FROM members 
                          WHERE MONTH(dob) = MONTH(CURRENT_DATE()) 
                          ORDER BY DAY(dob) ASC";
            $stmt = $this->db->prepare($bdayQuery);
            $stmt->execute();
            $stats['birthdays'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($stats);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["message" => "Error fetching stats"]);
        }
    }
}
?>