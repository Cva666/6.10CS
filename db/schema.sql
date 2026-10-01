DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS orders_products CASCADE;
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    note TEXT,
    user_id INT REFERENCES users(id) NOT NULL
);

CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL NOT NULL
);

CREATE TABLE orders_products(
    order_id INT REFERENCES orders(id) NOT NULL,
    product_id INT REFERENCES products(id) NOT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY(order_id, product_id)
    
)