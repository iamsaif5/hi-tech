import React, { useState } from 'react';
import { MessageCircle, Clock, Image, FileText, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';

const WhatsAppFeed = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [messages] = useState([
    {
      id: 1,
      sender: '+27 82 xxx xxxx',
      time: '14:32',
      date: '2024-06-12',
      message: 'Shift 2 loomage 27/05 attached',
      hasMedia: true,
      mediaType: 'image',
      processed: true,
      extractedData: {
        shift: 'Shift 2',
        machine: 'Loom A1',
        output: '4,200 units',
        defects: []
      }
    },
    {
      id: 2,
      sender: '+27 71 xxx xxxx',
      time: '13:45',
      date: '2024-06-12',
      message: 'QC report - extruder B2 issues found',
      hasMedia: true,
      mediaType: 'pdf',
      processed: true,
      extractedData: {
        shift: 'Shift 1',
        machine: 'Extruder B2',
        output: '3,800 units',
        defects: ['Print skew', 'Color inconsistency']
      }
    },
    {
      id: 3,
      sender: '+27 83 xxx xxxx',
      time: '12:20',
      date: '2024-06-11',
      message: 'Waste report morning shift complete',
      hasMedia: true,
      mediaType: 'image',
      processed: false
    },
    {
      id: 4,
      sender: '+27 82 xxx xxxx',
      time: '11:55',
      date: '2024-06-11',
      message: 'Machine maintenance completed on cutter A1',
      hasMedia: false,
      processed: true
    },
  ]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, typeof messages>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Live Uploads from WhatsApp</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Enable feed</span>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          📱 Images shared to the factory group will be scanned and processed automatically.
        </p>
      </div>

      {isEnabled ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="font-semibold text-gray-900">Factory Production Group</span>
              <span className="ml-2 text-sm text-gray-500">• 12 members</span>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date}>
                <div className="flex items-center mb-3">
                  <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {formatDate(date)}
                  </div>
                </div>
                
                <div className="space-y-4">
                  {dayMessages.map((message) => (
                    <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-medium text-gray-900 text-sm">{message.sender}</span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {message.time}
                            </span>
                            {message.processed ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                🟢 Completed
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                ⏳ Processing
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-800 text-sm mb-3">{message.message}</p>
                          
                          {message.hasMedia && (
                            <div className="mb-3">
                              <div className="flex items-center p-3 bg-gray-50 rounded-lg border max-w-sm">
                                {message.mediaType === 'image' ? (
                                  <Image className="h-6 w-6 text-gray-500 mr-3" />
                                ) : (
                                  <FileText className="h-6 w-6 text-gray-500 mr-3" />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {message.mediaType === 'image' ? 'Report Image' : 'PDF Report'}
                                  </p>
                                  <p className="text-xs text-gray-500">Click to view</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {message.extractedData && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="text-sm font-semibold text-blue-900 mb-3">Extracted Data:</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-medium text-blue-700">Shift:</span>
                                    <span className="text-blue-900">{message.extractedData.shift}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="font-medium text-blue-700">Machine:</span>
                                    <span className="text-blue-900">{message.extractedData.machine}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-medium text-blue-700">Output:</span>
                                    <span className="text-blue-900">{message.extractedData.output}</span>
                                  </div>
                                  {message.extractedData.defects && message.extractedData.defects.length > 0 && (
                                    <div className="text-xs">
                                      <span className="font-medium text-red-700">Defects:</span>
                                      <div className="mt-1 space-y-1">
                                        {message.extractedData.defects.map((defect, index) => (
                                          <Badge key={index} variant="destructive" className="text-xs mr-1">
                                            {defect}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border-t border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium">4 new messages</span> processed in the last hour
            </p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all messages →
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">WhatsApp Feed Disabled</h3>
          <p className="text-gray-600">Enable the toggle above to view live uploads from WhatsApp</p>
        </div>
      )}
    </section>
  );
};

export default WhatsAppFeed;
