<?php
require_once __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$json = file_get_contents('scandi_data.json');
$data = json_decode($json, true);

$conn->autocommit(false);

try {
    foreach ($data['data']['categories'] as $category) {
        $name = $conn->real_escape_string($category['name']);
        $conn->query("INSERT IGNORE INTO categories (name) VALUES ('$name')");
    }

    $brands = [];
    foreach ($data['data']['products'] as $product) {
        $brand = $conn->real_escape_string($product['brand']);
        if (!in_array($brand, $brands)) {
            $brands[] = $brand;
            $conn->query("INSERT IGNORE INTO brands (name) VALUES ('$brand')");
        }
    }

    $currencies = [];
    foreach ($data['data']['products'] as $product) {
        foreach ($product['prices'] as $price) {
            $label = $conn->real_escape_string($price['currency']['label']);
            $symbol = $conn->real_escape_string($price['currency']['symbol']);
            if (!isset($currencies[$label])) {
                $currencies[$label] = $symbol;
                $conn->query("INSERT IGNORE INTO currencies (label, symbol) VALUES ('$label', '$symbol')");
            }
        }
    }

    foreach ($data['data']['products'] as $product) {
        $id = $conn->real_escape_string($product['id']);
        $name = $conn->real_escape_string($product['name']);
        $inStock = $product['inStock'] ? 1 : 0;
        $description = $conn->real_escape_string($product['description']);
        $category = $conn->real_escape_string($product['category']);
        $brand = $conn->real_escape_string($product['brand']);

        $conn->query("
            INSERT INTO products (id, name, in_stock, description, category_name, brand_name)
            VALUES ('$id', '$name', $inStock, '$description', '$category', '$brand')
        ");

        foreach ($product['gallery'] as $image) {
            $imageUrl = $conn->real_escape_string($image);
            $conn->query("INSERT INTO product_images (product_id, image_url) VALUES ('$id', '$imageUrl')");
        }

        foreach ($product['prices'] as $price) {
            $amount = $price['amount'];
            $currencyLabel = $conn->real_escape_string($price['currency']['label']);
            $conn->query("
                INSERT INTO prices (product_id, amount, currency_label)
                VALUES ('$id', $amount, '$currencyLabel')
            ");
        }

        if (!empty($product['attributes'])) {
            foreach ($product['attributes'] as $attributeSet) {
                $setName = $conn->real_escape_string($attributeSet['name']);
                $type = $conn->real_escape_string($attributeSet['type']);
                $conn->query("
                    INSERT INTO attribute_sets (product_id, name, type)
                    VALUES ('$id', '$setName', '$type')
                ");
                $attributeSetId = $conn->insert_id;

                foreach ($attributeSet['items'] as $item) {
                    $displayValue = $conn->real_escape_string($item['displayValue']);
                    $value = $conn->real_escape_string($item['value']);
                    $conn->query("
                        INSERT INTO attribute_items (attribute_set_id, display_value, value)
                        VALUES ($attributeSetId, '$displayValue', '$value')
                    ");
                }
            }
        }
    }

    $conn->commit();
    echo "Data inserted successfully!";
} catch (Exception $e) {
    $conn->rollback();
    die("Error: " . $e->getMessage());
}

$conn->close();
