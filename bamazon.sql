DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(

    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40) NULL,
    department_name VARCHAR(20) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INTEGER(10) NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("iPad", "Electronics", 299.99, 50);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox One X", "Electronics", 379.99, 360);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Beats Headphones", "Electronics", 99.99, 150);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Star Wars T-Shirt", "Clothes", 19.99, 204);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Plain White T-Shirt", "Clothes", 79.99, 12);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Corn Holders", "Kitchen", 9.49, 79);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Wafflemaker", "Kitchen", 18.79, 189);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Union Jack Pillowcases", "Housewares", 24.99, 48);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Mickey Mouse Toothbrush Holder", "Housewares", 8.89, 73);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Genuine Irish Accent", "Imported Goods", 1999.95, 1);