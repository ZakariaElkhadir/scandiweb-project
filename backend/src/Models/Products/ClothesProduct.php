<?php

namespace Models\Products;

/**
 * Class ClothesProduct
 *
 * Represents a product of type "Clothes" in the system.
 * Extends the AbstractProduct class and provides additional
 * details specific to clothing products.
 *
 * @package Models\Products
 */
class ClothesProduct extends AbstractProduct
{

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
            'currency' => [
                'label' => $this->currencyLabel,
                'symbol' => $this->currencySymbol,
            ],
        ];
    }
}
