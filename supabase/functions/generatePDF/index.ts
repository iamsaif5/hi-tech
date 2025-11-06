import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface PDFRequest {
  type: 'quote' | 'invoice';
  id: string;
}

// Inline HTML templates (since we can't reliably read files in edge functions)
const quoteTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quote {{quote_number}}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #333; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #1f2937; }
    .company-details { text-align: right; font-size: 14px; color: #6b7280; }
    .document-title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 30px; }
    .client-details, .quote-details { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .detail-item { margin-bottom: 8px; }
    .label { font-weight: 600; color: #4b5563; }
    .value { color: #1f2937; }
    .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .items-table th { background-color: #f9fafb; font-weight: 600; color: #374151; }
    .total-section { margin-top: 30px; text-align: right; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 16px; }
    .total-row.final { font-size: 18px; font-weight: bold; color: #1f2937; border-top: 2px solid #e5e7eb; padding-top: 10px; }
    .terms { margin-top: 40px; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
    .terms-title { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 10px; }
    .terms-content { font-size: 12px; color: #6b7280; line-height: 1.5; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">{{company_name}}</div>
      <div class="company-details">
        {{company_address}}<br>
        {{company_phone}}<br>
        {{company_email}}
      </div>
    </div>
    <div class="company-details">
      <div><strong>Quote #{{quote_number}}</strong></div>
      <div>Date: {{quote_date}}</div>
      <div>Valid Until: {{expiry_date}}</div>
    </div>
  </div>

  <div class="document-title">QUOTATION</div>

  <div class="details-grid">
    <div class="client-details">
      <div class="section-title">Bill To:</div>
      <div class="detail-item">
        <div class="value"><strong>{{client_name}}</strong></div>
      </div>
      <div class="detail-item">
        <div class="value">{{client_contact}}</div>
      </div>
      <div class="detail-item">
        <div class="value">{{client_email}}</div>
      </div>
    </div>
    
    <div class="quote-details">
      <div class="section-title">Quote Details:</div>
      <div class="detail-item">
        <span class="label">Lead Time:</span> <span class="value">{{lead_time}} days</span>
      </div>
      <div class="detail-item">
        <span class="label">Created By:</span> <span class="value">{{created_by}}</span>
      </div>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Product/Service</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{product}}</td>
        <td>{{quantity}}</td>
        <td>R {{unit_price}}</td>
        <td>R {{line_total}}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>R {{subtotal}}</span>
    </div>
    <div class="total-row">
      <span>VAT (15%):</span>
      <span>R {{vat_amount}}</span>
    </div>
    <div class="total-row final">
      <span>Total:</span>
      <span>R {{total_amount}}</span>
    </div>
  </div>

  {{#if notes}}
  <div class="terms">
    <div class="terms-title">Notes:</div>
    <div class="terms-content">{{notes}}</div>
  </div>
  {{/if}}

  {{#if terms_conditions}}
  <div class="terms">
    <div class="terms-title">Terms & Conditions:</div>
    <div class="terms-content">{{terms_conditions}}</div>
  </div>
  {{/if}}

  <div class="footer">
    This quote is valid for {{validity_days}} days from the date of issue.
  </div>
</body>
</html>
`;

const invoiceTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice {{invoice_number}}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; color: #333; }
    .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: bold; color: #1f2937; }
    .company-details { text-align: right; font-size: 14px; color: #6b7280; }
    .document-title { font-size: 28px; font-weight: bold; color: #dc2626; margin-bottom: 30px; }
    .client-details, .invoice-details { margin-bottom: 30px; }
    .section-title { font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .detail-item { margin-bottom: 8px; }
    .label { font-weight: 600; color: #4b5563; }
    .value { color: #1f2937; }
    .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .items-table th { background-color: #f9fafb; font-weight: 600; color: #374151; }
    .total-section { margin-top: 30px; text-align: right; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 16px; }
    .total-row.final { font-size: 18px; font-weight: bold; color: #dc2626; border-top: 2px solid #e5e7eb; padding-top: 10px; }
    .payment-terms { margin-top: 40px; padding: 20px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626; }
    .payment-title { font-size: 14px; font-weight: 600; color: #dc2626; margin-bottom: 10px; }
    .payment-content { font-size: 12px; color: #6b7280; line-height: 1.5; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
    .status-paid { color: #059669; font-weight: bold; }
    .status-unpaid { color: #dc2626; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">{{company_name}}</div>
      <div class="company-details">
        {{company_address}}<br>
        {{company_phone}}<br>
        {{company_email}}
      </div>
    </div>
    <div class="company-details">
      <div><strong>Invoice #{{invoice_number}}</strong></div>
      <div>Issue Date: {{issue_date}}</div>
      <div>Due Date: {{due_date}}</div>
      <div class="status-{{status_class}}">{{status}}</div>
    </div>
  </div>

  <div class="document-title">INVOICE</div>

  <div class="details-grid">
    <div class="client-details">
      <div class="section-title">Bill To:</div>
      <div class="detail-item">
        <div class="value"><strong>{{client_name}}</strong></div>
      </div>
      <div class="detail-item">
        <div class="value">{{client_contact}}</div>
      </div>
      <div class="detail-item">
        <div class="value">{{client_email}}</div>
      </div>
    </div>
    
    <div class="invoice-details">
      <div class="section-title">Invoice Details:</div>
      <div class="detail-item">
        <span class="label">Payment Terms:</span> <span class="value">{{payment_terms}} days</span>
      </div>
      <div class="detail-item">
        <span class="label">Order Reference:</span> <span class="value">{{order_number}}</span>
      </div>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{product}}</td>
        <td>{{quantity}}</td>
        <td>R {{unit_price}}</td>
        <td>R {{total}}</td>
      </tr>
    </tbody>
  </table>

  <div class="total-section">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>R {{subtotal}}</span>
    </div>
    <div class="total-row">
      <span>VAT (15%):</span>
      <span>R {{tax_amount}}</span>
    </div>
    <div class="total-row final">
      <span>Total Amount:</span>
      <span>R {{total_amount}}</span>
    </div>
  </div>

  <div class="payment-terms">
    <div class="payment-title">Payment Information:</div>
    <div class="payment-content">
      Payment is due within {{payment_terms}} days of invoice date.<br>
      Late payments may incur additional charges.<br>
      {{notes}}
    </div>
  </div>

  <div class="footer">
    Thank you for your business!
  </div>
</body>
</html>
`;

function replaceTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
    return data[key] ? content : '';
  }).replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PDF generation request received');
    
    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { type, id }: PDFRequest = requestBody;

    if (!type || !id) {
      throw new Error(`Missing required parameters: type=${type}, id=${id}`);
    }

    console.log(`Generating PDF for ${type} with ID: ${id}`);

    let data: any;
    let template: string;
    let filename: string;

    if (type === 'quote') {
      console.log('Fetching quote data...');
      
      // Fetch quote data with client information
      const { data: quote, error } = await supabase
        .from('quotes')
        .select(`
          *,
          clients (name, email, contact_person)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching quote:', error);
        throw new Error(`Failed to fetch quote: ${error.message}`);
      }

      if (!quote) {
        throw new Error('Quote not found');
      }

      console.log('Quote data fetched:', quote);

      template = quoteTemplate;
      filename = `quotes/${id}/quote-${quote.quote_number}.pdf`;
      
      const subtotal = quote.total_value;
      const vatAmount = subtotal * 0.15;
      const totalWithVat = subtotal + vatAmount;

      data = {
        company_name: 'HiTec Manufacturing',
        company_address: '123 Industrial Street, Johannesburg, 2000',
        company_phone: '+27 11 123 4567',
        company_email: 'info@hitecmanufacturing.co.za',
        quote_number: quote.quote_number,
        quote_date: new Date(quote.created_at).toLocaleDateString(),
        expiry_date: new Date(quote.expiry_date).toLocaleDateString(),
        client_name: quote.clients?.name || 'Unknown Client',
        client_contact: quote.clients?.contact_person || '',
        client_email: quote.clients?.email || '',
        lead_time: quote.lead_time_days,
        created_by: quote.created_by,
        product: quote.product,
        quantity: quote.quantity.toLocaleString(),
        unit_price: quote.price_per_unit.toFixed(2),
        line_total: quote.total_value.toFixed(2),
        subtotal: subtotal.toFixed(2),
        vat_amount: vatAmount.toFixed(2),
        total_amount: totalWithVat.toFixed(2),
        notes: quote.notes || '',
        terms_conditions: quote.terms_conditions || '',
        validity_days: Math.ceil((new Date(quote.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      };
    } else if (type === 'invoice') {
      console.log('Fetching invoice data...');
      
      // Fetch invoice data with client and order information
      const { data: invoice, error } = await supabase
        .from('invoices')
        .select(`
          *,
          clients (name, email, contact_person),
          orders (order_number)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching invoice:', error);
        throw new Error(`Failed to fetch invoice: ${error.message}`);
      }

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      console.log('Invoice data fetched:', invoice);

      template = invoiceTemplate;
      filename = `invoices/${id}/invoice-${invoice.invoice_number}.pdf`;

      data = {
        company_name: 'HiTec Manufacturing',
        company_address: '123 Industrial Street, Johannesburg, 2000',
        company_phone: '+27 11 123 4567',
        company_email: 'info@hitecmanufacturing.co.za',
        invoice_number: invoice.invoice_number,
        issue_date: invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : new Date(invoice.created_at).toLocaleDateString(),
        due_date: invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A',
        status: invoice.status === 'Paid' ? 'PAID' : 'UNPAID',
        status_class: invoice.status === 'Paid' ? 'paid' : 'unpaid',
        client_name: invoice.clients?.name || 'Unknown Client',
        client_contact: invoice.clients?.contact_person || '',
        client_email: invoice.clients?.email || '',
        payment_terms: invoice.payment_terms || 30,
        order_number: invoice.orders?.order_number || 'N/A',
        product: 'Invoice Line Item',
        quantity: '1',
        unit_price: invoice.amount.toFixed(2),
        total: invoice.amount.toFixed(2),
        subtotal: invoice.amount.toFixed(2),
        tax_amount: (invoice.tax_amount || 0).toFixed(2),
        total_amount: invoice.total_amount.toFixed(2),
        notes: invoice.notes || ''
      };
    } else {
      throw new Error('Invalid type. Must be "quote" or "invoice"');
    }

    console.log('Generating HTML from template...');
    
    // Generate HTML from template
    const html = replaceTemplate(template, data);
    
    console.log('Launching Puppeteer...');
    
    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    console.log('PDF generated, uploading to storage...');

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('docs')
      .upload(filename, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    console.log('PDF uploaded successfully:', uploadData);

    // Get signed URL for download
    const { data: urlData, error: urlError } = await supabase.storage
      .from('docs')
      .createSignedUrl(filename, 3600); // 1 hour expiry

    if (urlError) {
      console.error('Error creating signed URL:', urlError);
      throw new Error(`Failed to create download URL: ${urlError.message}`);
    }

    console.log(`PDF generated successfully: ${filename}`);

    return new Response(
      JSON.stringify({
        success: true,
        filename,
        downloadUrl: urlData.signedUrl,
        path: uploadData.path
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);