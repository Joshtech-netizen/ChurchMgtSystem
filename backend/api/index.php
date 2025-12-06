<?php
// 1. Handle CORS and Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 2. Handle Preflight Request (Browser safety check)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. Autoload Classes (Simple version)
include_once 'config/Database.php';
include_once 'models/Member.php';
include_once 'controllers/MemberController.php';
include_once 'models/Donation.php';
include_once 'controllers/DonationController.php'; 
include_once 'models/Attendance.php';
include_once 'controllers/AttendanceController.php';
include_once 'controllers/DashboardController.php';

// 4. Parse the URL (e.g., localhost/backend/api/members)
// The .htaccess file will send the path to $_GET['url']
$url = isset($_GET['url']) ? rtrim($_GET['url'], '/') : '';
$urlParts = explode('/', $url);
$resource = $urlParts[0]; // e.g., 'members'
$id = isset($urlParts[1]) ? $urlParts[1] : null; // e.g., '5'

// 5. Route to the correct Controller
$database = new Database();
$db = $database->getConnection();

switch ($resource) {
    case 'members':
        $controller = new MemberController($db);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;
        case 'donations':
        $controller = new DonationController($db);
        $controller->processRequest($_SERVER["REQUEST_METHOD"], $id);
        break;
        case 'attendance':
        $controller = new AttendanceController($db);
        // Note: Attendance usually doesn't need an ID in the URL, mostly Date query params
        $controller->processRequest($_SERVER["REQUEST_METHOD"]);
        break;
        case 'dashboard':
        $controller = new DashboardController($db);
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getStats();
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "Resource not found"]);
        break;
}
?>