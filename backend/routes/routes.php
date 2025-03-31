<?php
use Controllers\ProductsController;

// Load Composer autoloader (better than manual requires)
require_once __DIR__ . '/../vendor/autoload.php';

$router = new \Bramus\Router\Router();

// routes
$router->get('/api/products', function() {
    $controller = new \Controllers\ProductsController();
    $controller->getAllProduct();
});

// 404 Handler
$router->set404(function() {
    header("HTTP/1.0 404 Not Found");
    echo json_encode(["message" => "Route not found"]);
});

$router->run();