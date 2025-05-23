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
    ];

    public static function create(array $row): AbstractProduct
    {
        $type = strtolower($row['category_name'] ?? '');

        if (!isset(self::$classMap[$type])) {
            throw new \RuntimeException('Unknown product type: ' . $type);
        }

        $className = self::$classMap[$type];
        return new $className(
            $row['id'] ?? '',
            $row['name'] ?? 'Unknown',
            (float) ($row['price'] ?? 0),
            explode(',', $row['images'] ?? ''),
            $row['category_name'] ?? 'unknown',
            (int) ($row['in_stock'] ?? 0),
            $row['currency'] ?? 'USD',
            $row['currency_symbol'] ?? '$'
        );
    }
}
