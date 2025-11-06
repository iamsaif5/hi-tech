
-- Update the mo_status enum to replace 'Draft' with 'In Queue'
ALTER TYPE mo_status RENAME VALUE 'Draft' TO 'In Queue';
