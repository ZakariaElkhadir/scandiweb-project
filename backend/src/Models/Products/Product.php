<?php
namespace Models\Products;

require_once __DIR__ . '/../../Config/Database.php';

use Config\Database;

class Product
{
    private $conn;

    public function __construct()
    {
        $this->conn = Database::getConnection();
    }

    public function getAllProducts()
    {
        $query = "SELECT 
            p.*, 
            GROUP_CONCAT(pi.image_url) AS images,
            c.label AS currency,
            c.symbol AS currency_symbol,
            pr.amount AS price
          FROM products p
          LEFT JOIN product_images pi ON p.id = pi.product_id
          LEFT JOIN prices pr ON p.id = pr.product_id
          LEFT JOIN currencies c ON pr.currency_label = c.label
          GROUP BY p.id, c.label, c.symbol, pr.amount";

        $result = $this->conn->query($query);
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
?>