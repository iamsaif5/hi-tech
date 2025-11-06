-- Add missing enum values first
ALTER TYPE quote_status ADD VALUE IF NOT EXISTS 'Expired';
ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'On Hold';