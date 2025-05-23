<?php

namespace App\Config;

class Database
{
    private static $instance = null;
    private $connection;

    private function __construct()
    {
        $this->connection = new \mysqli(
            $_ENV['DB_HOST'],
            $_ENV['DB_USER'],
            $_ENV['DB_PASSWORD'],
            $_ENV['DB_NAME']
        );

        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }
    }

    public static function getConnection()
    {
        if (!self::$instance) {
            self::$instance = new self();
        }
        return self::$instance->connection;
    }
}
