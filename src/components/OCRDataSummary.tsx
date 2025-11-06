
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { useUploadData, useQCData, useWasteData, useStaffData, useMachineCheckData } from '@/hooks/useUploadData';

interface OCRDataSummaryProps {
  lastUpdated: Date;
}

const OCRDataSummary = ({ lastUpdated }: OCRDataSummaryProps) => {
  const { data: uploadData } = useUploadData();
  const { data: qcData } = useQCData();
  const { data: wasteData } = useWasteData();
  const { data: staffData } = useStaffData();
  const { data: machineCheckData } = useMachineCheckData();

  const pendingUploads = uploadData?.filter(upload => upload.status === 'pending').length || 0;
  const failedUploads = uploadData?.filter(upload => upload.status === 'error').length || 0;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">OCR Processing Status</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Staff Logs</p>
              <p className="text-sm text-gray-600">{staffData?.length || 0} total</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Waste Reports</p>
              <p className="text-sm text-gray-600">{wasteData?.length || 0} total</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">QC Checks</p>
              <p className="text-sm text-gray-600">{qcData?.length || 0} total</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Machine Checks</p>
              <p className="text-sm text-gray-600">{machineCheckData?.length || 0} total</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">Pending Uploads: {pendingUploads}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Failed Uploads: {failedUploads}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Auto-OCR Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OCRDataSummary;
