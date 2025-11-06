-- Phase 1: Create comprehensive sample data for all entities and statuses (corrected)

-- Add missing enum values
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'Expired';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'On Hold';

-- Insert sample clients with different statuses
INSERT INTO clients (name, email, phone, contact_person, client_type, industry, status, outstanding_balance, credit_terms, account_manager) VALUES
('Lion Group', 'orders@liongroup.co.za', '+27 11 123 4567', 'Sarah Johnson', 'Enterprise', 'Food Manufacturing', 'Active', 0, 30, 'Mike Stevens'),
('IWISA Mills', 'procurement@iwisa.co.za', '+27 21 456 7890', 'David Chen', 'Enterprise', 'Milling', 'Active', 0, 45, 'Lisa Brown'),
('Tiger Brands', 'supply@tigerbrands.com', '+27 11 789 0123', 'Emily Rodriguez', 'Corporate', 'FMCG', 'Active', 0, 60, 'John Wilson'),
('Freedom Foods', 'orders@freedomfoods.co.za', '+27 31 234 5678', 'Mark Thompson', 'SME', 'Food Processing', 'Active', 0, 30, 'Sarah Davis'),
('Umoya Group', 'purchasing@umoya.co.za', '+27 11 345 6789', 'Jennifer Adams', 'Enterprise', 'Agriculture', 'Active', 0, 30, 'Mike Stevens'),
('Premier Mills', 'orders@premier.co.za', '+27 21 567 8901', 'Robert Wilson', 'Enterprise', 'Milling', 'Paused', 25000, 30, 'Lisa Brown'),
('Golden Harvest', 'supply@goldenharvest.co.za', '+27 12 678 9012', 'Amanda Clark', 'SME', 'Agriculture', 'Active', 0, 15, 'John Wilson'),
('Fresh Choice', 'procurement@freshchoice.co.za', '+27 11 789 0234', 'Michael Lewis', 'SME', 'Retail', 'Active', 0, 30, 'Sarah Davis');

-- Insert sample quotes with all statuses
INSERT INTO quotes (quote_number, client_id, product, quantity, price_per_unit, total_value, lead_time_days, expiry_date, status, created_by) VALUES
(generate_quote_number(), (SELECT id FROM clients WHERE name = 'Lion Group'), 'IWISA 25kg Printed Bags', 10000, 2.50, 25000, 14, '2025-01-20', 'Sent', 'John Doe'),
(generate_quote_number(), (SELECT id FROM clients WHERE name = 'Tiger Brands'), 'Custom 50kg Heavy Duty', 5000, 4.20, 21000, 21, '2025-01-25', 'Draft', 'Jane Smith'),
(generate_quote_number(), (SELECT id FROM clients WHERE name = 'Premier Mills'), 'Lion 10kg White Bags', 8000, 1.80, 14400, 10, '2025-01-22', 'Accepted', 'Mike Johnson'),
(generate_quote_number(), (SELECT id FROM clients WHERE name = 'Fresh Choice'), 'Custom 5kg No Print', 15000, 1.20, 18000, 7, '2025-01-18', 'Expired', 'Lisa Brown'),
(generate_quote_number(), (SELECT id FROM clients WHERE name = 'Golden Harvest'), 'IWISA 25kg Printed Bags', 7500, 2.60, 19500, 14, '2025-01-30', 'Rejected', 'Tom Wilson'),
(generate_quote_number(), (SELECT id FROM clients WHERE name = 'IWISA Mills'), 'Lion 50kg No Print', 6000, 3.80, 22800, 18, '2025-02-05', 'Sent', 'Sarah Davis');

-- Insert sample orders with various statuses and completion levels
INSERT INTO orders (order_number, client_id, quote_id, product, quantity, order_value, delivery_date, status, created_by) VALUES
(generate_order_number(), (SELECT id FROM clients WHERE name = 'Lion Group'), NULL, 'IWISA 25kg Printed Bags', 6000, 75000, '2025-01-28', 'Confirmed', 'John Doe'),
(generate_order_number(), (SELECT id FROM clients WHERE name = 'Freedom Foods'), NULL, 'Lion 10kg White Bags', 3500, 42000, '2025-01-22', 'New', 'Jane Smith'),
(generate_order_number(), (SELECT id FROM clients WHERE name = 'Umoya Group'), NULL, 'IWISA 25kg Printed Bags', 4200, 52500, '2025-01-30', 'New', 'Mike Johnson'),
(generate_order_number(), (SELECT id FROM clients WHERE name = 'Tiger Brands'), NULL, 'Custom 25kg Blue Print', 2000, 28000, '2025-02-05', 'New', 'Lisa Brown'),
(generate_order_number(), (SELECT id FROM clients WHERE name = 'Umoya Group'), NULL, 'Lion 5kg No Print', 1500, 18000, '2025-02-10', 'On Hold', 'Tom Wilson'),
(generate_order_number(), (SELECT id FROM clients WHERE name = 'Premier Mills'), (SELECT id FROM quotes WHERE product = 'Lion 10kg White Bags' LIMIT 1), 'Lion 10kg White Bags', 8000, 14400, '2025-01-15', 'Delivered', 'Sarah Davis'),
(generate_order_number(), (SELECT id FROM clients WHERE name = 'Golden Harvest'), NULL, 'Custom 20kg Green Print', 5000, 62500, '2025-01-20', 'New', 'John Doe'),
(generate_order_number(), (SELECT id FROM clients WHERE name = 'IWISA Mills'), NULL, 'Lion 50kg Heavy Duty', 2500, 85000, '2025-02-01', 'Confirmed', 'Jane Smith');

-- Insert sample manufacturing orders with all statuses
INSERT INTO manufacturing_orders (mo_number, order_id, client_id, product, quantity, due_date, status, internal_approval, print_specs, packaging_requirements, material_details) VALUES
(generate_mo_number(), (SELECT id FROM orders WHERE product = 'IWISA 25kg Printed Bags' AND quantity = 6000), (SELECT id FROM clients WHERE name = 'Lion Group'), 'IWISA 25kg Printed Bags', 6000, '2025-01-28', 'In Production', 'Approved', '4-Color CMYK, Matte Lamination, 300x400mm print area', 'Standard packaging, 50 bags per bundle', 'PP Woven fabric, 180GSM'),
(generate_mo_number(), (SELECT id FROM orders WHERE product = 'Lion 50kg Heavy Duty' AND quantity = 2500), (SELECT id FROM clients WHERE name = 'IWISA Mills'), 'Lion 50kg Heavy Duty', 2500, '2025-02-01', 'Scheduled', 'Approved', 'Single color print, No lamination', 'Heavy duty packaging, 25 bags per bundle', 'PP Woven fabric, 220GSM'),
(generate_mo_number(), (SELECT id FROM orders WHERE product = 'Lion 10kg White Bags' AND delivery_date = '2025-01-15'), (SELECT id FROM clients WHERE name = 'Premier Mills'), 'Lion 10kg White Bags', 8000, '2025-01-15', 'Completed', 'Approved', 'No print required', 'Standard packaging, 100 bags per bundle', 'PP Woven fabric, 160GSM'),
(generate_mo_number(), (SELECT id FROM orders WHERE product = 'Custom 25kg Blue Print' AND quantity = 2000), (SELECT id FROM clients WHERE name = 'Tiger Brands'), 'Custom 25kg Blue Print', 2000, '2025-02-05', 'Draft', 'Pending', '2-Color print, Blue and White, Custom logo', 'Premium packaging, 40 bags per bundle', 'PP Woven fabric, 190GSM'),
(generate_mo_number(), (SELECT id FROM orders WHERE product = 'Lion 5kg No Print' AND quantity = 1500), (SELECT id FROM clients WHERE name = 'Umoya Group'), 'Lion 5kg No Print', 1500, '2025-02-10', 'On Hold', 'Approved', 'No print required', 'Standard packaging, 200 bags per bundle', 'PP Woven fabric, 140GSM');

-- Insert sample deliveries
INSERT INTO deliveries (delivery_number, order_id, mo_id, client_name, product, quantity, delivery_date, delivery_time, method, destination, driver, vehicle, contact, status) VALUES
(generate_delivery_number(), (SELECT id FROM orders WHERE product = 'Lion 10kg White Bags' AND delivery_date = '2025-01-15'), (SELECT id FROM manufacturing_orders WHERE product = 'Lion 10kg White Bags'), 'Premier Mills', 'Lion 10kg White Bags', 8000, '2025-01-15', '14:30', 'Own Transport', '123 Industrial Road, Cape Town', 'James Smith', 'Truck - AB123GP', '+27 21 567 8901', 'Delivered'),
(generate_delivery_number(), (SELECT id FROM orders WHERE product = 'IWISA 25kg Printed Bags' AND quantity = 6000), (SELECT id FROM manufacturing_orders WHERE product = 'IWISA 25kg Printed Bags'), 'Lion Group', 'IWISA 25kg Printed Bags', 6000, '2025-01-28', '10:00', 'Client Collection', 'Factory Pickup Point', NULL, NULL, '+27 11 123 4567', 'Scheduled'),
(generate_delivery_number(), (SELECT id FROM orders WHERE product = 'Lion 50kg Heavy Duty' AND quantity = 2500), (SELECT id FROM manufacturing_orders WHERE product = 'Lion 50kg Heavy Duty'), 'IWISA Mills', 'Lion 50kg Heavy Duty', 2500, '2025-02-01', '08:00', 'Own Transport', '456 Mill Street, Durban', 'Peter Jones', 'Truck - CD456GP', '+27 21 456 7890', 'Scheduled');

-- Update clients with realistic order counts and last order dates
UPDATE clients SET 
  total_orders = (SELECT COUNT(*) FROM orders WHERE orders.client_id = clients.id),
  last_order_date = (SELECT MAX(order_date) FROM orders WHERE orders.client_id = clients.id);

-- Add some machinery data for production
INSERT INTO machines (name, production_target, target_unit, status) VALUES
('Loom Bank A - Machine 1', 500, 'meters/hour', 'active'),
('Loom Bank A - Machine 2', 480, 'meters/hour', 'active'),
('Loom Bank B - Machine 1', 520, 'meters/hour', 'active'),
('Loom Bank B - Machine 2', 490, 'meters/hour', 'maintenance'),
('Cutting Station 1', 200, 'bags/hour', 'active'),
('Cutting Station 2', 210, 'bags/hour', 'active'),
('Printing Press 1', 150, 'bags/hour', 'active'),
('Printing Press 2', 140, 'bags/hour', 'active'),
('Lamination Unit 1', 180, 'bags/hour', 'active'),
('Sewing Station 1', 100, 'bags/hour', 'active'),
('Sewing Station 2', 95, 'bags/hour', 'active'),
('Quality Control Station', 300, 'bags/hour', 'active');