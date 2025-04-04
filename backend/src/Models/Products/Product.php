<?php
namespace Models\Products;

require_once __DIR__ . '/../../Config/Database.php';

use Config\Database;

/**
 * AbstractProduct
 * Base class for all product types.
 */
abstract class AbstractProduct
{
    protected string $id;
    protected string $name;
    protected float $price;
    protected array $images;
    protected string $categoryName;
    protected int $inStock;

    public function __construct(
        string $id,
        string $name,
        float $price,
        array $images,
        string $categoryName,
        int $inStock
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->price = $price;
        $this->images = $images;
        $this->categoryName = $categoryName;
        $this->inStock = $inStock;
    }

    abstract public function getDetails(): array;
}

/**
 * Example subclass: TechProduct
 */
class TechProduct extends AbstractProduct
{
    // Any tech-specific fields/methods here

    public function getDetails(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'images' => $this->images,
            'category_name' => $this->categoryName,
            'in_stock' => $this->inStock,
            'specifications' => 'Example for Tech',
        ];
    }
}

/**
 * Example subclass: ClothesProduct
 */
class ClothesProduct extends AbstractProduct
{
    // Any clothes-specific fields/methods here

    public function getDetails(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'images' => $this->images,
            'category_name' => $this->categoryName,
            'in_stock' => $this->inStock,
            'sizes' => ['S', 'M', 'L'],
        ];
    }
}

/**
 * Factory creates product objects without using if/switch directly.
 * Maps categories to specific subclass names.
 */
class ProductFactory
{
    private static array $classMap = [
        'tech' => TechProduct::class,
        'clothes' => ClothesProduct::class,
        // Add more types here, matching your DB category_name
    ];

    public static function create(array $row): AbstractProduct
    {
        $type = strtolower($row['category_name'] ?? '');

        // Fallback or exception if the type is not recognized
        if (!isset(self::$classMap[$type])) {
            throw new \RuntimeException('Unknown product type: ' . $type);
        }

        $className = self::$classMap[$type];
        return new $className(
            $row['id']?? '',
            $row['name'] ?? 'Unknown',
            (float) ($row['price'] ?? 0),
            // Split images on comma, handle null gracefully
            explode(',', $row['images'] ?? ''),
            $row['category_name'] ?? 'unknown',
            (int) ($row['in_stock'] ?? 0)
        );
    }
}

/**
 * Main Product class responsible for fetching data and returning polymorphic objects.
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
            $products[] = ProductFactory::create($row);
        }

        return $products; // Returns an array of AbstractProduct objects
    }
}