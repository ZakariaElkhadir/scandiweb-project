<?php
namespace Models\Products;
/**
 * ProductFactory
 *
 * Factory class to create product objects based on the category name.
 *
 * @package Models\Products
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
            $row['id'] ?? '',
            $row['name'] ?? 'Unknown',
            (float) ($row['price'] ?? 0),
            // Split images on comma, handle null gracefully
            explode(',', $row['images'] ?? ''),
            $row['category_name'] ?? 'unknown',
            (int) ($row['in_stock'] ?? 0),
            $row['currency'] ?? 'USD',
            $row['currency_symbol'] ?? '$'
        );
    }
}
?>