import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePDFGeneration = () => {
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const generatePDF = async (type: 'quote' | 'invoice', id: string) => {
    const key = `${type}-${id}`;
    
    try {
      setGenerating(prev => ({ ...prev, [key]: true }));
      
      console.log(`Starting PDF generation for ${type} with ID: ${id}`);
      
      toast({
        title: "Generating PDF...",
        description: `Creating ${type} PDF document`,
      });

      const { data, error } = await supabase.functions.invoke('generatePDF', {
        body: { type, id }
      });

      console.log('PDF generation response:', data, error);

      if (error) throw error;

      if (data.success && data.downloadUrl) {
        // Create a download link
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.filename.split('/').pop() || `${type}-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "PDF Generated",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} PDF downloaded successfully`,
        });

        return data;
      } else {
        throw new Error(data.error || 'Failed to generate PDF');
      }
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: `Failed to generate ${type} PDF: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setGenerating(prev => ({ ...prev, [key]: false }));
    }
  };

  const isGenerating = (type: 'quote' | 'invoice', id: string) => {
    return generating[`${type}-${id}`] || false;
  };

  return {
    generatePDF,
    isGenerating
  };
};