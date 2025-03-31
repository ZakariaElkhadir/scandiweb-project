<?php

require_once __DIR__ . '/../vendor/autoload.php';

try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..'); 
    $dotenv->load();

    $dotenv->required(['DB_HOST', 'DB_USER', 'DB_NAME'])->notEmpty(); 
} catch (\Throwable $e) {

    error_log("FATAL: .env loading failed: " . $e->getMessage());
    http_response_code(500);
    die("Application configuration error. Please check logs or contact support."); 
}

require_once __DIR__ . '/../routes/routes.php';
?>