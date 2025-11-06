-- Clean up duplicate clients and add remaining sample data
DELETE FROM clients WHERE id NOT IN (
  SELECT MIN(id) FROM clients GROUP BY name
);

-- Add sample quotes using the remaining client IDs
WITH client_data AS (
  SELECT name, MIN(id) as id FROM clients GROUP BY name
)
INSERT INTO quotes (quote_number, client_id, product, quantity, price_per_unit, total_value, lead_time_days, expiry_date, status, created_by) 
SELECT generate_quote_number(), cd.id, products.product, products.quantity, products.price, products.total, products.lead_time, products.expiry, products.status, products.creator
FROM client_data cd
CROSS JOIN (
  VALUES 
    ('Lion Group', 'IWISA 25kg Printed Bags', 10000, 2.50, 25000, 14, '2025-01-20', 'Sent', 'John Doe'),
    ('Tiger Brands', 'Custom 50kg Heavy Duty', 5000, 4.20, 21000, 21, '2025-01-25', 'Draft', 'Jane Smith'),
    ('Premier Mills', 'Lion 10kg White Bags', 8000, 1.80, 14400, 10, '2025-01-22', 'Accepted', 'Mike Johnson'),
    ('Fresh Choice', 'Custom 5kg No Print', 15000, 1.20, 18000, 7, '2025-01-18', 'Expired', 'Lisa Brown'),
    ('Golden Harvest', 'IWISA 25kg Printed Bags', 7500, 2.60, 19500, 14, '2025-01-30', 'Rejected', 'Tom Wilson'),
    ('IWISA Mills', 'Lion 50kg No Print', 6000, 3.80, 22800, 18, '2025-02-05', 'Sent', 'Sarah Davis')
) AS products(client_name, product, quantity, price, total, lead_time, expiry, status, creator)
WHERE cd.name = products.client_name;