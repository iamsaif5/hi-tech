
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = 'https://nrcojghgbtkwdcxoebji.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yY29qZ2hnYnRrd2RjeG9lYmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMzc0MzAsImV4cCI6MjA2MzkxMzQzMH0.Ri9PeVQH83yRUkPP1JmC4Tg3JG1s9CerUrmuSjNmpKk';

function getPromptForReportType(reportType: string): string {
  const prompts = {
    efficiency: `This is a staff efficiency/casual check report. Extract ALL visible staff data with high accuracy.
    Look for: employee names/IDs, hours worked, dates, shift information, performance notes.
    Return a JSON array with objects containing:
    {
      "staff_id": "employee name or ID (required)",
      "hours": number (total hours as number),
      "date": "YYYY-MM-DD format",
      "shift": "shift_1" or "shift_2" or "shift_3",
      "notes": "any performance notes or comments"
    }
    Extract ALL staff entries visible in the document. If unclear, set field to null.`,

    factory: `This is a factory/machine check report. Extract ALL machine condition data.
    Look for: machine names/IDs, status conditions, issues found, dates, shift info.
    Return a JSON array with objects containing:
    {
      "machine": "machine name or ID (required)",
      "status": "OK" or "Issue" or "Maintenance",
      "note": "specific issue description if any",
      "date": "YYYY-MM-DD format",
      "shift": "shift_1" or "shift_2" or "shift_3"
    }
    Extract ALL machine entries visible. If unclear, set field to null.`,

    qc: `This is a tape testing/QC report. Extract quality control results with precision.
    Look for: test results, pass/fail status, defect types, machine info, dates, shifts.
    Return a JSON object:
    {
      "date": "YYYY-MM-DD format",
      "shift": "shift_1" or "shift_2" or "shift_3",
      "result": "pass" or "fail",
      "defects": ["array of defect types if any"],
      "machine_id": "machine name if specified"
    }
    Be precise with pass/fail determination. If unclear, set field to null.`,

    waste: `This is a waste tracking report. Extract waste data accurately.
    Look for: waste percentages, quantities, dates, shift information.
    Return a JSON object:
    {
      "date": "YYYY-MM-DD format",
      "shift": "shift_1" or "shift_2" or "shift_3",
      "waste_percentage": number (as decimal percentage),
      "waste_units": number (quantity in units)
    }
    Convert percentages to decimal format. If unclear, set field to null.`
  };

  return prompts[reportType] || prompts.qc;
}

async function callGeminiAPI(fileUrl: string, prompt: string, fileType: string): Promise<any> {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log('Fetching file from URL:', fileUrl);
  
  const fileResponse = await fetch(fileUrl);
  if (!fileResponse.ok) {
    throw new Error(`Failed to fetch file: ${fileResponse.status}`);
  }

  const fileBuffer = await fileResponse.arrayBuffer();
  console.log('File size:', fileBuffer.byteLength, 'bytes');

  // Convert to base64 in chunks to avoid stack overflow
  const bytes = new Uint8Array(fileBuffer);
  const chunkSize = 32768; // 32KB chunks
  let base64 = '';
  
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    base64 += btoa(String.fromCharCode.apply(null, Array.from(chunk)));
  }

  const mimeType = fileType === 'pdf' ? 'application/pdf' : 'image/jpeg';

  const geminiRequest = {
    contents: [
      {
        parts: [
          {
            text: prompt + " IMPORTANT: Respond with valid JSON only. No markdown, no code blocks, just raw JSON."
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2000,
    }
  };

  console.log('Calling Gemini API...');
  const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(geminiRequest),
  });

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API error: ${geminiResponse.status}`);
  }

  const geminiData = await geminiResponse.json();
  console.log('Gemini response received');
  
  if (!geminiData.candidates || geminiData.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  return geminiData.candidates[0].content.parts[0].text;
}

function parseGeminiOutput(rawOutput: string): any {
  console.log('Raw Gemini output:', rawOutput);
  
  try {
    // Clean the response - remove markdown code blocks if present
    let cleanOutput = rawOutput.trim();
    if (cleanOutput.startsWith('```json')) {
      cleanOutput = cleanOutput.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanOutput.startsWith('```')) {
      cleanOutput = cleanOutput.replace(/```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Try to extract JSON if it's embedded in text
    const jsonMatch = cleanOutput.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanOutput = jsonMatch[0];
    }
    
    const parsed = JSON.parse(cleanOutput);
    console.log('Successfully parsed JSON:', parsed);
    return parsed;
  } catch (error) {
    console.error('Failed to parse Gemini output:', error);
    throw new Error(`Invalid JSON response from Gemini: ${error.message}`);
  }
}

async function insertIntoSupabase(reportType: string, parsedData: any, fileUrl: string, supabase: any): Promise<void> {
  console.log('Inserting data for report type:', reportType, 'Data:', parsedData);

  let insertError: any = null;

  try {
    switch (reportType) {
      case 'efficiency':
        // Handle both single object and array responses
        const staffRecords = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        for (const record of staffRecords) {
          if (record.staff_id) { // Only insert if we have staff_id
            const { error } = await supabase
              .from('staff_logs')
              .insert({
                staff_id: record.staff_id,
                hours: record.hours || null,
                date: record.date || null,
                shift: record.shift || null,
                notes: record.notes || null,
                source_file_url: fileUrl
              });
            
            if (error) {
              console.error('Error inserting staff record:', error);
              insertError = error;
            } else {
              console.log('Successfully inserted staff record for:', record.staff_id);
            }
          }
        }
        break;

      case 'factory':
        const machineRecords = Array.isArray(parsedData) ? parsedData : [parsedData];
        
        for (const record of machineRecords) {
          if (record.machine) { // Only insert if we have machine name
            const { error } = await supabase
              .from('machine_check')
              .insert({
                machine: record.machine,
                status: record.status || null,
                note: record.note || null,
                date: record.date || null,
                shift: record.shift || null,
                source_file_url: fileUrl
              });
            
            if (error) {
              console.error('Error inserting machine record:', error);
              insertError = error;
            } else {
              console.log('Successfully inserted machine record for:', record.machine);
            }
          }
        }
        break;

      case 'qc':
        const { error: qcError } = await supabase
          .from('qc_flags')
          .insert({
            date: parsedData.date || null,
            shift: parsedData.shift || null,
            result: parsedData.result || null,
            defects: parsedData.defects || [],
            machine_id: parsedData.machine_id || null,
            source_file_url: fileUrl
          });
        
        insertError = qcError;
        if (!qcError) {
          console.log('Successfully inserted QC record');
        }
        break;

      case 'waste':
        const { error: wasteError } = await supabase
          .from('waste_logs')
          .insert({
            date: parsedData.date || null,
            shift: parsedData.shift || null,
            waste_percentage: parsedData.waste_percentage || null,
            waste_units: parsedData.waste_units || null,
            source_file_url: fileUrl
          });
        
        insertError = wasteError;
        if (!wasteError) {
          console.log('Successfully inserted waste record');
        }
        break;

      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }

    if (insertError) {
      throw insertError;
    }

  } catch (error) {
    console.error('Database insertion error:', error);
    throw new Error(`Failed to save data: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { uploadId, fileUrl, reportType, fileType } = requestBody;
    
    console.log('Starting OCR process for:', { uploadId, reportType, fileType });

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update status to processing
    await supabase
      .from('upload_status')
      .update({ 
        status: 'processing',
        processed_at: new Date().toISOString()
      })
      .eq('id', uploadId);

    // Get the appropriate prompt for this report type
    const prompt = getPromptForReportType(reportType);
    
    // Call Gemini API
    const rawOutput = await callGeminiAPI(fileUrl, prompt, fileType);
    
    // Parse the output
    const parsedData = parseGeminiOutput(rawOutput);
    
    // Insert into appropriate Supabase table
    await insertIntoSupabase(reportType, parsedData, fileUrl, supabase);

    // Update upload status to processed
    await supabase
      .from('upload_status')
      .update({ 
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('id', uploadId);

    console.log('OCR processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedData: parsedData,
        message: `Successfully processed ${reportType} report and saved data to dashboard`,
        reportType: reportType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('OCR processing failed:', error);

    // Update upload status to error
    if (requestBody?.uploadId) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        await supabase
          .from('upload_status')
          .update({ 
            status: 'error',
            error_message: error.message,
            processed_at: new Date().toISOString()
          })
          .eq('id', requestBody.uploadId);
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
