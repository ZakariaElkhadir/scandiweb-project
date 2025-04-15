<?php

namespace Models;

use App\Config\Database;
/*
 * Class Order
 *
 * Handles order-related database operations.
 *
 * @package Models
 */
class Order
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getConnection(); 
    }

    public function createOrder(array $args): int
    {
        // Start transaction for mysqli
        $this->db->autocommit(false);

        try {
            // Insert into orders table
            $stmt = $this->db->prepare("INSERT INTO orders (customer_email, shipping_address) VALUES (?, ?)");
            $stmt->bind_param("ss", $args['customerEmail'], $args['shippingAddress']);
            $stmt->execute();

            if ($stmt->error) {
                throw new \Exception("Order insert failed: " . $stmt->error);
            }

            $orderId = $this->db->insert_id;

            // Insert order items
            $itemStmt = $this->db->prepare("INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)");

            foreach ($args['items'] as $item) {
                $itemStmt->bind_param("iii", $orderId, $item['productId'], $item['quantity']);
                $itemStmt->execute();

                if ($itemStmt->error) {
                    throw new \Exception("Order item insert failed: " . $itemStmt->error);
                }
            }

            // Commit transaction
            $this->db->commit();
            $this->db->autocommit(true); //autocommit on

            return $orderId;

        } catch (\Exception $e) {
            // Roll back transaction
            $this->db->rollback();
            $this->db->autocommit(true);
            throw new \Exception("Failed to create order: " . $e->getMessage());
        }
    }
}