-- Add unique constraint for time records to support upserts
ALTER TABLE public.time_records 
ADD CONSTRAINT time_records_atg_clock_number_date_unique 
UNIQUE (atg_clock_number, date);