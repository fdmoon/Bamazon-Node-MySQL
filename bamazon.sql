CREATE DATABASE bamazon;

CREATE TABLE products (
	item_id int NOT NULL AUTO_INCREMENT,
    product_name varchar(50) NOT NULL,
    department_name varchar(50),
    price float,
    stock_quantity int
);

USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LED TV", "Electronics", 207.94, 3);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("All-new Echo", "Electronics", 99.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("3D VR Headset", "Electronics", 20.99, 15);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LEGO Star Wars", "Toys", 39.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Quadcopter Drone", "Toys", 34.99, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Remote Control Car", "Toys", 23.99, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sport Coat", "Clothing", 104.99, 5);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blazer", "Clothing", 67.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dress Shirt", "Clothing", 30.83, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jean", "Clothing", 24.99, 30);

