<?php
use Controller\ProductsController;

// Load Composer autoloader (better than manual requires)
require_once __DIR__ . '/../vendor/autoload.php';

$router = new \Bramus\Router\Router();

// CORS Middleware
$router->before('GET|POST|OPTIONS', '/.*', function () {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
});

// routes
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