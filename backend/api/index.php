<?php
// 1. Headers & CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Include Files
if (file_exists('config/Database.php')) include_once 'config/Database.php';
if (file_exists('models/Member.php')) include_once 'models/Member.php';
if (file_exists('controllers/MemberController.php')) include_once 'controllers/MemberController.php';
if (file_exists('models/Donation.php')) include_once 'models/Donation.php';
if (file_exists('controllers/DonationController.php')) include_once 'controllers/DonationController.php';
if (file_exists('models/Attendance.php')) include_once 'models/Attendance.php';
if (file_exists('controllers/AttendanceController.php')) include_once 'controllers/AttendanceController.php';
if (file_exists('controllers/DashboardController.php')) include_once 'controllers/DashboardController.php';
if (file_exists('models/User.php')) include_once 'models/User.php';
if (file_exists('controllers/AuthController.php')) include_once 'controllers/AuthController.php';

// 3. Parse URL
$url = isset($_GET['url']) ? rtrim($_GET['url'], '/') : '';
$urlParts = explode('/', $url);
$resource = isset($urlParts[0]) ? $urlParts[0] : '';
$id = isset($urlParts[1]) ? $urlParts[1] : null;

// 4. Initialize DB
$database = new Database();
$db = $database->getConnection();

// 5. Route Request
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
        $controller->processRequest($_SERVER["REQUEST_METHOD"]);
        break;
    case 'dashboard':
        $controller = new DashboardController($db);
        if ($_SERVER['REQUEST_METHOD'] === 'GET') $controller->getStats();
        break;
    case 'login':
        $auth = new AuthController($db);
        if ($_SERVER['REQUEST_METHOD'] === 'POST') $auth->login();
        break;
    case 'register': // NEW ROUTE
        $auth = new AuthController($db);
        if ($_SERVER['REQUEST_METHOD'] === 'POST') $auth->register();
        break;
    default:
        http_response_code(404);
        echo json_encode(["message" => "Resource not found"]);
        break;
}
?>