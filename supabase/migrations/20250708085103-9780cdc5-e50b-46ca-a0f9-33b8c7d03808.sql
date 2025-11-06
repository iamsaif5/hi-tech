-- Add sample data for quotes, orders, and MOs using simple approach

-- Delete duplicate clients by keeping first occurrence
DELETE FROM clients c1 USING clients c2 
WHERE c1.id > c2.id AND c1.name = c2.name;

-- Insert sample quotes
INSERT INTO quotes (quote_number, client_id, product, quantity, price_per_unit, total_value, lead_time_days, expiry_date, status, created_by) VALUES
('QT-001', (SELECT id FROM clients WHERE name = 'Lion Group' LIMIT 1), 'IWISA 25kg Printed Bags', 10000, 2.50, 25000, 14, '2025-01-20', 'Sent', 'John Doe'),
('QT-002', (SELECT id FROM clients WHERE name = 'Tiger Brands' LIMIT 1), 'Custom 50kg Heavy Duty', 5000, 4.20, 21000, 21, '2025-01-25', 'Draft', 'Jane Smith'),
('QT-003', (SELECT id FROM clients WHERE name = 'Premier Mills' LIMIT 1), 'Lion 10kg White Bags', 8000, 1.80, 14400, 10, '2025-01-22', 'Accepted', 'Mike Johnson'),
('QT-004', (SELECT id FROM clients WHERE name = 'Fresh Choice' LIMIT 1), 'Custom 5kg No Print', 15000, 1.20, 18000, 7, '2025-01-18', 'Expired', 'Lisa Brown'),
('QT-005', (SELECT id FROM clients WHERE name = 'Golden Harvest' LIMIT 1), 'IWISA 25kg Printed Bags', 7500, 2.60, 19500, 14, '2025-01-30', 'Rejected', 'Tom Wilson'),
('QT-006', (SELECT id FROM clients WHERE name = 'IWISA Mills' LIMIT 1), 'Lion 50kg No Print', 6000, 3.80, 22800, 18, '2025-02-05', 'Sent', 'Sarah Davis');