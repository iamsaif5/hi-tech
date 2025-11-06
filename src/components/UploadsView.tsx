
import React from 'react';
import UploadInterface from './UploadInterface';
import WhatsAppFeed from './WhatsAppFeed';

interface UploadsViewProps {
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
}

const UploadsView = ({ uploadedFiles, setUploadedFiles }: UploadsViewProps) => {
  return (
    <div className="bg-[#EAF1FF] min-h-screen p-6">
      <header className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Uploads & Media Processing</h1>
      </header>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
        <UploadInterface uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <WhatsAppFeed />
      </div>

      {/* Coming Soon Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">🚀 Coming Soon</h3>
        <p className="text-blue-800">Soon you'll be able to upload voice notes and videos for AI transcription and issue flagging.</p>
      </div>
    </div>
  );
};

export default UploadsView;
