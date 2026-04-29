CREATE USER keycloak_user WITH PASSWORD 'keycloak_pass';
CREATE DATABASE keycloak_db OWNER keycloak_user;

CREATE USER user_profile_user WITH PASSWORD 'user_profile_pass';
CREATE DATABASE user_profile_db OWNER user_profile_user;

CREATE USER catalog_user WITH PASSWORD 'catalog_pass';
CREATE DATABASE catalog_db OWNER catalog_user;

CREATE USER inventory_user WITH PASSWORD 'inventory_pass';
CREATE DATABASE inventory_db OWNER inventory_user;

CREATE USER cart_user WITH PASSWORD 'cart_pass';
CREATE DATABASE cart_db OWNER cart_user;

CREATE USER order_user WITH PASSWORD 'order_pass';
CREATE DATABASE order_db OWNER order_user;

CREATE USER payment_user WITH PASSWORD 'payment_pass';
CREATE DATABASE payment_db OWNER payment_user;

CREATE USER notification_user WITH PASSWORD 'notification_pass';
CREATE DATABASE notification_db OWNER notification_user;
