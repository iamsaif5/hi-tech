-- Add scheduled start and end date fields to manufacturing_orders table
ALTER TABLE public.manufacturing_orders 
ADD COLUMN scheduled_start_date DATE,
ADD COLUMN scheduled_end_date DATE;