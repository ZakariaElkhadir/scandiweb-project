<?php
use Controller\ProductsController;

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

$router = new \Bramus\Router\Router();

// CORS Middleware
$router->before('GET|POST|OPTIONS', '/.*', function () {
    $allowedOrigins = [
        'http://localhost:5173', // Local dev
        'https://scandiweb-test-five.vercel.app' // Production
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit;
    }
});

// Routes
$router->get('/api/products', function() {
    $controller = new ProductsController();
    $controller->getAllProduct();
});

// 404 Handler
$router->set404(function() {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["message" => "Route not found"]);
});

$router->run();