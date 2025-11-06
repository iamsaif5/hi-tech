-- Add additional fields to manufacturing_orders table for MO creation flow
ALTER TABLE public.manufacturing_orders 
ADD COLUMN artwork_url text,
ADD COLUMN print_specs text,
ADD COLUMN material_details text,
ADD COLUMN packaging_requirements text,
ADD COLUMN internal_approval text DEFAULT 'Pending' CHECK (internal_approval IN ('Pending', 'Approved')),
ADD COLUMN delivery_target_date date;