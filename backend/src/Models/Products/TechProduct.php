<?php

namespace Models\Products;

/**
 * Class TechProduct
 *
 * Represents a product of type "Tech" in the system.
 * Extends the AbstractProduct class and provides additional
 * details specific to tech products.
 *
 * @package Models\Products
 */
class TechProduct extends AbstractProduct
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
            'currency' => [
                'label' => $this->currencyLabel,
                'symbol' => $this->currencySymbol,
            ],
        ];
    }
}
