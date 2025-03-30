-- MySQL script to create the database and tables for Scandiweb project
-- you can run this script with cat scandi_db.sql | mysql -u root -p
USE scandiweb_db;

-- this is the categories collection
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- this is the products collection
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    description TEXT,
    category_id INT,
    brand VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    name VARCHAR(100),
    value VARCHAR(100),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    image_url TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
