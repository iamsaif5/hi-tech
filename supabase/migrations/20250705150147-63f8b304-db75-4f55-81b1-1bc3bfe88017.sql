-- Add missing updated_at column to time_records table
ALTER TABLE public.time_records 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_time_records_updated_at
    BEFORE UPDATE ON public.time_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_time_records_updated_at();