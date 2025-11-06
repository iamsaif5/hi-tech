-- Insert sample deliveries and update client stats
INSERT INTO deliveries (delivery_number, order_id, mo_id, client_name, product, quantity, delivery_date, delivery_time, method, destination, driver, vehicle, contact, status) VALUES
('DEL-001', (SELECT id FROM orders WHERE order_number = 'ORD-0017'), (SELECT id FROM manufacturing_orders WHERE mo_number = 'MO-2025-003'), 'Premier Mills', 'Lion 10kg White Bags', 8000, '2025-01-15', '14:30', 'Own Transport', '123 Industrial Road, Cape Town', 'James Smith', 'Truck - AB123GP', '+27 21 567 8901', 'Delivered'),
('DEL-002', (SELECT id FROM orders WHERE order_number = 'ORD-0012'), (SELECT id FROM manufacturing_orders WHERE mo_number = 'MO-2025-001'), 'Lion Group', 'IWISA 25kg Printed Bags', 6000, '2025-01-28', '10:00', 'Client Collection', 'Factory Pickup Point', NULL, NULL, '+27 11 123 4567', 'Scheduled'),
('DEL-003', (SELECT id FROM orders WHERE order_number = 'ORD-0019'), (SELECT id FROM manufacturing_orders WHERE mo_number = 'MO-2025-002'), 'IWISA Mills', 'Lion 50kg Heavy Duty', 2500, '2025-02-01', '08:00', 'Own Transport', '456 Mill Street, Durban', 'Peter Jones', 'Truck - CD456GP', '+27 21 456 7890', 'Scheduled');

-- Update clients with realistic order counts and last order dates
UPDATE clients SET 
  total_orders = (SELECT COUNT(*) FROM orders WHERE orders.client_id = clients.id),
  last_order_date = (SELECT MAX(order_date) FROM orders WHERE orders.client_id = clients.id);