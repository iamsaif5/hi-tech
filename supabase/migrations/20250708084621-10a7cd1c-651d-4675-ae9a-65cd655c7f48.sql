-- Insert comprehensive sample data with proper structure

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