-- Create financial workflow tables

-- Invoices table - tracks invoices created from completed orders
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  order_id UUID NOT NULL REFERENCES public.orders(id),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  amount NUMERIC NOT NULL,
  line_items JSONB NOT NULL, -- Array of {product, quantity, unit_price, line_total}
  tax_amount NUMERIC DEFAULT 0,
  freight_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Part-paid', 'Paid', 'Overdue')),
  issue_date DATE,
  due_date DATE,
  sent_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_terms INTEGER DEFAULT 30, -- days
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);

-- Receivables table - tracks payment status of invoices
CREATE TABLE public.receivables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id),
  client_id UUID NOT NULL REFERENCES public.clients(id),
  invoice_number TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  paid_amount NUMERIC DEFAULT 0,
  outstanding_amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  days_overdue INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Outstanding' CHECK (status IN ('Outstanding', 'Part-paid', 'Paid', 'Write-off')),
  last_reminder_sent DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payables & Expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_number TEXT NOT NULL UNIQUE,
  supplier_name TEXT NOT NULL,
  bill_number TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- Raw Materials, Labour, Utilities, Freight, etc.
  gl_code TEXT, -- General Ledger code for accounting
  amount NUMERIC NOT NULL,
  tax_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
  payment_status TEXT NOT NULL DEFAULT 'Unpaid' CHECK (payment_status IN ('Unpaid', 'Paid', 'Part-paid')),
  paid_amount NUMERIC DEFAULT 0,
  paid_date DATE,
  pdf_url TEXT, -- OCR'd supplier invoice/bill
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Payment batches for cash management
CREATE TABLE public.payment_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_number TEXT NOT NULL UNIQUE,
  total_amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Approved', 'Exported', 'Paid')),
  bank_export_url TEXT, -- CSV file for bank import
  expense_ids UUID[] NOT NULL, -- Array of expense IDs in this batch
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL
);

-- Cash flow schedule for forecasting
CREATE TABLE public.cash_flow_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_date DATE NOT NULL,
  flow_type TEXT NOT NULL CHECK (flow_type IN ('Inflow', 'Outflow')),
  category TEXT NOT NULL, -- Invoice Payment, Expense Payment, etc.
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  source_type TEXT NOT NULL, -- invoice, expense, manual
  source_id UUID, -- Reference to invoice or expense
  is_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Integration status tracking
CREATE TABLE public.integration_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_name TEXT NOT NULL UNIQUE, -- Xero, Bank Feed, ATG Payroll
  status TEXT NOT NULL DEFAULT 'Disconnected' CHECK (status IN ('Connected', 'Error', 'Disconnected')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  config_data JSONB, -- API keys, settings, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receivables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_flow_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_status ENABLE ROW LEVEL SECURITY;

-- Create policies for all operations
CREATE POLICY "Enable all operations for invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for receivables" ON public.receivables FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for payment_batches" ON public.payment_batches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for cash_flow_schedule" ON public.cash_flow_schedule FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all operations for integration_status" ON public.integration_status FOR ALL USING (true) WITH CHECK (true);

-- Create functions for automatic numbering
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.invoices
    WHERE invoice_number ~ '^INV-[0-9]+$';
    
    RETURN 'INV-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_expense_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(expense_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.expenses
    WHERE expense_number ~ '^EXP-[0-9]+$';
    
    RETURN 'EXP-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_batch_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_number INTEGER;
    current_date TEXT;
BEGIN
    current_date := TO_CHAR(CURRENT_DATE, 'YYYYMMDD');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(batch_number FROM LENGTH('BATCH-' || current_date || '-') + 1) AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.payment_batches
    WHERE batch_number ~ ('^BATCH-' || current_date || '-[0-9]+$');
    
    RETURN 'BATCH-' || current_date || '-' || LPAD(next_number::TEXT, 3, '0');
END;
$$;

-- Create trigger to automatically create receivable when invoice is sent
CREATE OR REPLACE FUNCTION public.create_receivable_on_invoice_sent()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Only create receivable when status changes to 'Sent' and receivable doesn't exist
    IF NEW.status = 'Sent' AND OLD.status = 'Draft' THEN
        INSERT INTO public.receivables (
            invoice_id,
            client_id,
            invoice_number,
            total_amount,
            outstanding_amount,
            due_date
        ) VALUES (
            NEW.id,
            NEW.client_id,
            NEW.invoice_number,
            NEW.total_amount,
            NEW.total_amount,
            NEW.due_date
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_create_receivable_on_invoice_sent
    AFTER UPDATE ON public.invoices
    FOR EACH ROW
    EXECUTE FUNCTION public.create_receivable_on_invoice_sent();

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update timestamp triggers to all tables
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_receivables_updated_at BEFORE UPDATE ON public.receivables FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payment_batches_updated_at BEFORE UPDATE ON public.payment_batches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cash_flow_schedule_updated_at BEFORE UPDATE ON public.cash_flow_schedule FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_integration_status_updated_at BEFORE UPDATE ON public.integration_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();