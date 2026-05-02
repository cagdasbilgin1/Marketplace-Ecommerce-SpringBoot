ALTER TABLE products ADD COLUMN product_id VARCHAR(9);

CREATE OR REPLACE FUNCTION generate_short_product_id()
RETURNS VARCHAR(9)
LANGUAGE plpgsql
AS $$
DECLARE
    candidate VARCHAR(9);
BEGIN
    LOOP
        candidate := substring(upper(encode(gen_random_bytes(8), 'hex')) from 1 for 9);
        EXIT WHEN NOT EXISTS (SELECT 1 FROM products WHERE product_id = candidate);
    END LOOP;

    RETURN candidate;
END;
$$;

UPDATE products
SET product_id = generate_short_product_id()
WHERE product_id IS NULL;

ALTER TABLE products
    ALTER COLUMN product_id SET NOT NULL,
    ALTER COLUMN product_id SET DEFAULT generate_short_product_id();

ALTER TABLE products
    ADD CONSTRAINT uq_products_product_id UNIQUE (product_id);

CREATE INDEX idx_products_product_id ON products (product_id);
