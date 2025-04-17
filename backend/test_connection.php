<?php
//  debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/src/Config/Database.php';
use App\Config\Database;

try {
    $conn = Database::getConnection();

    if ($conn) {
        echo "Database connection successful!";
    } else {
        echo "Failed to connect to the database.";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>