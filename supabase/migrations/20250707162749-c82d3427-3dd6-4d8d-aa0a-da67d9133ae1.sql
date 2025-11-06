-- Add missing fields to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Create employee_loans table for tracking loans
CREATE TABLE IF NOT EXISTS employee_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  loan_type TEXT NOT NULL,
  original_amount NUMERIC(10,2) NOT NULL,
  outstanding_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  monthly_payment NUMERIC(10,2) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paid_off', 'defaulted')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on employee_loans
ALTER TABLE employee_loans ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for employee_loans
CREATE POLICY "Users can view all employee loans" 
ON employee_loans 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert employee loans" 
ON employee_loans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update employee loans" 
ON employee_loans 
FOR UPDATE 
USING (true);

-- Create trigger for updated_at on employee_loans
CREATE TRIGGER update_employee_loans_updated_at
BEFORE UPDATE ON employee_loans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();