-- Create enum types for better data consistency
CREATE TYPE public.client_status AS ENUM ('Active', 'Paused', 'Blacklisted');
CREATE TYPE public.quote_status AS ENUM ('Draft', 'Sent', 'Accepted', 'Rejected');
CREATE TYPE public.order_status AS ENUM ('New', 'Confirmed', 'Cancelled', 'Delivered');
CREATE TYPE public.mo_status AS ENUM ('Draft', 'Scheduled', 'In Production', 'Completed', 'On Hold');
CREATE TYPE public.delivery_method AS ENUM ('Internal Fleet', 'Courier', '3rd Party');
CREATE TYPE public.delivery_status AS ENUM ('Scheduled', 'En Route', 'Delivered');

-- Create clients table
CREATE TABLE public.clients (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    status client_status DEFAULT 'Active',
    client_type TEXT,
    account_manager TEXT,
    credit_terms INTEGER DEFAULT 30,
    outstanding_balance DECIMAL DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    last_order_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    quote_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL NOT NULL,
    total_value DECIMAL NOT NULL,
    lead_time_days INTEGER NOT NULL,
    status quote_status DEFAULT 'Draft',
    expiry_date DATE NOT NULL,
    created_by TEXT NOT NULL,
    converted_order_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    order_value DECIMAL NOT NULL,
    status order_status DEFAULT 'New',
    delivery_date DATE NOT NULL,
    order_date DATE DEFAULT CURRENT_DATE,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create manufacturing_orders table
CREATE TABLE public.manufacturing_orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mo_number TEXT UNIQUE NOT NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status mo_status DEFAULT 'Draft',
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create deliveries table
CREATE TABLE public.deliveries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    delivery_number TEXT UNIQUE NOT NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    mo_id UUID REFERENCES public.manufacturing_orders(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    product TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    delivery_date DATE NOT NULL,
    delivery_time TIME,
    method delivery_method NOT NULL,
    vehicle TEXT,
    driver TEXT,
    destination TEXT,
    status delivery_status DEFAULT 'Scheduled',
    contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key for converted orders in quotes
ALTER TABLE public.quotes 
ADD CONSTRAINT fk_quotes_converted_order 
FOREIGN KEY (converted_order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturing_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for full access (adjust as needed for your auth requirements)
CREATE POLICY "Enable all operations for clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for quotes" ON public.quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for manufacturing_orders" ON public.manufacturing_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for deliveries" ON public.deliveries FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_manufacturing_orders_updated_at BEFORE UPDATE ON public.manufacturing_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON public.deliveries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.clients (name, industry, contact_person, email, phone, status, client_type, account_manager, credit_terms, outstanding_balance, total_orders, last_order_date) VALUES
('Lion Group', 'Food Processing', 'Martha Dube', 'martha@liongroup.co.za', '071-345-9823', 'Active', 'Distributor', 'Riaz Patel', 30, 18900, 84, '2025-06-22'),
('Freedom Foods', 'Retail', 'James Wilson', 'james@freedomfoods.co.za', '082-567-1234', 'Active', 'Retailer', 'Sharon Molefe', 15, 7500, 42, '2025-06-20'),
('Umoya Group', 'Manufacturing', 'Sarah Ahmed', 'sarah@umoyagroup.co.za', '073-891-5678', 'Active', 'Industrial', 'David Zeeman', 45, 45200, 156, '2025-06-25'),
('Tiger Brands', 'FMCG', 'Kevin Miller', 'kevin@tigerbrands.co.za', '084-234-5678', 'Active', 'Food Service', 'Riaz Patel', 30, 0, 28, '2025-05-15');

-- Function to generate quote numbers
CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 4) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.quotes
    WHERE quote_number ~ '^QT-[0-9]+$';
    
    RETURN 'QT-' || LPAD(next_number::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 11) + 1
    INTO next_number
    FROM public.orders
    WHERE order_number ~ '^ORD-[0-9]+$';
    
    RETURN 'ORD-' || LPAD(next_number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate MO numbers
CREATE OR REPLACE FUNCTION public.generate_mo_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    current_year TEXT;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(mo_number FROM LENGTH('MO-' || current_year || '-') + 1) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.manufacturing_orders
    WHERE mo_number ~ ('^MO-' || current_year || '-[0-9]+$');
    
    RETURN 'MO-' || current_year || '-' || LPAD(next_number::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate delivery numbers
CREATE OR REPLACE FUNCTION public.generate_delivery_number()
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(delivery_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.deliveries
    WHERE delivery_number ~ '^DEL-[0-9]+$';
    
    RETURN 'DEL-' || LPAD(next_number::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;