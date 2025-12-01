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
    default:
        http_response_code(404);
        echo json_encode(["message" => "Resource not found"]);
        break;
}
?>