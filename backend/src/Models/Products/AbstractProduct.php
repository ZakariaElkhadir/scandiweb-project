<?php

/**
 * AbstractProduct
 *
 * Base class for all product types.
 */

namespace Models\Products;

abstract class AbstractProduct
{
    protected string $id;
    protected string $name;
    protected float $price;
    protected array $images;
    protected string $categoryName;
    protected int $inStock;
    protected string $currencyLabel;
    protected string $currencySymbol;

    public function __construct(
        string $id,
        string $name,
        float $price,
        array $images,
        string $categoryName,
        int $inStock,
        string $currencyLabel,
        string $currencySymbol
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->price = $price;
        $this->images = $images;
        $this->categoryName = $categoryName;
        $this->inStock = $inStock;
        $this->currencyLabel = $currencyLabel;
        $this->currencySymbol = $currencySymbol;
    }

    abstract public function getDetails(): array;
}
