<?php
namespace Models\Products;


use App\Config\Database;
use Models\Products\ProductFactory;

/**
 * Class Product
 *
 * Handles product-related database operations.
 *
 * @package Models\Products
 */
class Product
{
    private \mysqli $conn;

    public function __construct()
    {
        $this->conn = Database::getConnection();
    }

    public function getAllProducts(): array
    {
        $query = " 
            SELECT
                p.*,
                GROUP_CONCAT(pi.image_url) AS images,
                c.label AS currency,
                c.symbol AS currency_symbol,
                pr.amount AS price
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            LEFT JOIN prices pr ON p.id = pr.product_id
            LEFT JOIN currencies c ON pr.currency_label = c.label
            GROUP BY p.id, c.label, c.symbol, pr.amount
        ";

        $result = $this->conn->query($query);
        $rows = $result->fetch_all(MYSQLI_ASSOC);

        // Create polymorphic product objects
        $products = [];
        foreach ($rows as $row) {
            error_log(print_r($row, true));
            $products[] = ProductFactory::create($row);
        }

        return $products; // Returns an array of AbstractProduct objects
    }
    public function getProductDetails(string $productId): ?array
    {
        $query = "
        SELECT
            p.*,
            GROUP_CONCAT(pi.image_url) AS images,
            c.label AS currency,
            c.symbol AS currency_symbol,
            pr.amount AS price,
            b.name AS brand_name,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'name', ats.name,
                    'type', ats.type,
                    'items', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'display_value', ai.display_value,
                                'value', ai.value
                            )
                        )
                        FROM attribute_items ai
                        WHERE ai.attribute_set_id = ats.id
                    )
                )
            ) AS attributes
        FROM products p
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN prices pr ON p.id = pr.product_id
        LEFT JOIN currencies c ON pr.currency_label = c.label
        LEFT JOIN brands b ON p.brand_name = b.name
        LEFT JOIN attribute_sets ats ON p.id = ats.product_id
        WHERE p.id = ?
        GROUP BY p.id, c.label, c.symbol, pr.amount, b.name
    ";

        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if (!$row) {
            return null;
        }

        return [
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'brand' => $row['brand_name'],
            'price' => $row['price'],
            'currency' => [
                'label' => $row['currency'],
                'symbol' => $row['currency_symbol'],
            ],
            'images' => explode(',', $row['images']),
            'attributes' => json_decode($row['attributes'], true),
            'in_stock' => $row['in_stock'],
        ];
    }


}