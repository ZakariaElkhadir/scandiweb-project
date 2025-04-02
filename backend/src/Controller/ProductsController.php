<?php
namespace Controller;

use Models\Products\Product;

class ProductsController{
    public function getAllProduct(){
        $productModel = new Product();
        $products = $productModel->getAllProducts();

        header('Content-Type: application/json');
        echo json_encode($products);
    }
}
?>