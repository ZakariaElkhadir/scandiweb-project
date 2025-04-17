-- This SQL script creates the database and tables for the Scandiweb project.
--  You can run this script cat scandi_db.sql | mysql -u root -p


CREATE DATABASE IF NOT EXISTS scandiweb_db;
USE scandiweb_db;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    name VARCHAR(255) PRIMARY KEY
);

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
    name VARCHAR(255) PRIMARY KEY
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    in_stock BOOLEAN NOT NULL,
    description TEXT,
    category_name VARCHAR(255),
    brand_name VARCHAR(255),
    FOREIGN KEY (category_name) REFERENCES categories(name),
    FOREIGN KEY (brand_name) REFERENCES brands(name)
);

-- Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(255),
    image_url TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Currencies Table
CREATE TABLE IF NOT EXISTS currencies (
    label VARCHAR(3) PRIMARY KEY,
    symbol VARCHAR(5) NOT NULL
);

-- Prices Table
CREATE TABLE IF NOT EXISTS prices (
    product_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency_label VARCHAR(3),
    PRIMARY KEY (product_id, currency_label),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (currency_label) REFERENCES currencies(label)
);

-- Attribute Sets Table
CREATE TABLE IF NOT EXISTS attribute_sets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Attribute Items Table
CREATE TABLE IF NOT EXISTS attribute_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_set_id INT,
    display_value VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    FOREIGN KEY (attribute_set_id) REFERENCES attribute_sets(id)
);
-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_email VARCHAR(255) NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
