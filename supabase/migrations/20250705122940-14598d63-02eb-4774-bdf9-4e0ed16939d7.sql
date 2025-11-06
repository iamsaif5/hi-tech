-- Add policies for time_records to allow better data management
DROP POLICY IF EXISTS "Users can insert time records" ON time_records;
DROP POLICY IF EXISTS "Users can update time records" ON time_records;
DROP POLICY IF EXISTS "Users can view all time records" ON time_records;

-- Create comprehensive RLS policies for time records
CREATE POLICY "Enable full access to time records" ON time_records
  FOR ALL USING (true)
  WITH CHECK (true);

-- Ensure we have indexes for better performance
CREATE INDEX IF NOT EXISTS idx_time_records_date ON time_records(date);
CREATE INDEX IF NOT EXISTS idx_time_records_employee_date ON time_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_time_records_atg_clock_date ON time_records(atg_clock_number, date);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_time_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_time_records_updated_at_trigger ON time_records;
CREATE TRIGGER update_time_records_updated_at_trigger
    BEFORE UPDATE ON time_records
    FOR EACH ROW
    EXECUTE FUNCTION update_time_records_updated_at();