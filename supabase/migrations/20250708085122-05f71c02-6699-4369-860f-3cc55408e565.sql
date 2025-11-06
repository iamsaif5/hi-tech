-- Insert sample orders with various statuses
INSERT INTO orders (order_number, client_id, quote_id, product, quantity, order_value, delivery_date, status, created_by) VALUES
('ORD-0012', (SELECT id FROM clients WHERE name = 'Lion Group' LIMIT 1), NULL, 'IWISA 25kg Printed Bags', 6000, 75000, '2025-01-28', 'Confirmed', 'John Doe'),
('ORD-0013', (SELECT id FROM clients WHERE name = 'Freedom Foods' LIMIT 1), NULL, 'Lion 10kg White Bags', 3500, 42000, '2025-01-22', 'New', 'Jane Smith'),
('ORD-0014', (SELECT id FROM clients WHERE name = 'Umoya Group' LIMIT 1), NULL, 'IWISA 25kg Printed Bags', 4200, 52500, '2025-01-30', 'New', 'Mike Johnson'),
('ORD-0015', (SELECT id FROM clients WHERE name = 'Tiger Brands' LIMIT 1), NULL, 'Custom 25kg Blue Print', 2000, 28000, '2025-02-05', 'New', 'Lisa Brown'),
('ORD-0016', (SELECT id FROM clients WHERE name = 'Umoya Group' LIMIT 1), NULL, 'Lion 5kg No Print', 1500, 18000, '2025-02-10', 'On Hold', 'Tom Wilson'),
('ORD-0017', (SELECT id FROM clients WHERE name = 'Premier Mills' LIMIT 1), (SELECT id FROM quotes WHERE quote_number = 'QT-003'), 'Lion 10kg White Bags', 8000, 14400, '2025-01-15', 'Delivered', 'Sarah Davis'),
('ORD-0018', (SELECT id FROM clients WHERE name = 'Golden Harvest' LIMIT 1), NULL, 'Custom 20kg Green Print', 5000, 62500, '2025-01-20', 'New', 'John Doe'),
('ORD-0019', (SELECT id FROM clients WHERE name = 'IWISA Mills' LIMIT 1), NULL, 'Lion 50kg Heavy Duty', 2500, 85000, '2025-02-01', 'Confirmed', 'Jane Smith');