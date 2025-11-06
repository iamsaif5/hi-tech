-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('docs', 'docs', false, 52428800, ARRAY['application/pdf']);

-- Create RLS policies for docs bucket
CREATE POLICY "Users can view docs" ON storage.objects
FOR SELECT USING (bucket_id = 'docs');

CREATE POLICY "Users can upload docs" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'docs');

CREATE POLICY "Users can update docs" ON storage.objects
FOR UPDATE USING (bucket_id = 'docs');

CREATE POLICY "Users can delete docs" ON storage.objects
FOR DELETE USING (bucket_id = 'docs');