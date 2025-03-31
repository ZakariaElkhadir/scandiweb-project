<?php
// Database configuration
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../../');
$dotenv->load();

$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$pass = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Read JSON file
$json = file_get_contents('scandi_data.json');
$data = json_decode($json, true);

// Disable autocommit for transaction
$conn->autocommit(false);

try {
    // Insert categories
    foreach ($data['data']['categories'] as $category) {
        $name = $conn->real_escape_string($category['name']);
        $conn->query("INSERT IGNORE INTO categories (name) VALUES ('$name')");
    }

    // Extract and insert brands (unique)
    $brands = [];
    foreach ($data['data']['products'] as $product) {
        $brand = $conn->real_escape_string($product['brand']);
        if (!in_array($brand, $brands)) {
            $brands[] = $brand;
            $conn->query("INSERT IGNORE INTO brands (name) VALUES ('$brand')");
        }
    }

    // Insert currencies (unique)
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

    // Insert products, images, prices, and attributes
    foreach ($data['data']['products'] as $product) {
        // Insert product
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

        // Insert product images
        foreach ($product['gallery'] as $image) {
            $imageUrl = $conn->real_escape_string($image);
            $conn->query("INSERT INTO product_images (product_id, image_url) VALUES ('$id', '$imageUrl')");
        }

        // Insert prices
        foreach ($product['prices'] as $price) {
            $amount = $price['amount'];
            $currencyLabel = $conn->real_escape_string($price['currency']['label']);
            $conn->query("
                INSERT INTO prices (product_id, amount, currency_label)
                VALUES ('$id', $amount, '$currencyLabel')
            ");
        }

        // Insert attributes (if any)
        if (!empty($product['attributes'])) {
            foreach ($product['attributes'] as $attributeSet) {
                $setName = $conn->real_escape_string($attributeSet['name']);
                $type = $conn->real_escape_string($attributeSet['type']);
                $conn->query("
                    INSERT INTO attribute_sets (product_id, name, type)
                    VALUES ('$id', '$setName', '$type')
                ");
                $attributeSetId = $conn->insert_id;

                // Insert attribute items
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

    // Commit transaction
    $conn->commit();
    echo "Data inserted successfully!";

} catch (Exception $e) {
    // Rollback on error
    $conn->rollback();
    die("Error: " . $e->getMessage());
}

$conn->close();
?>