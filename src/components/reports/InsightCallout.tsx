
import React from 'react';

interface InsightCalloutProps {
  title: string;
  text: string;
}

export const InsightCallout: React.FC<InsightCalloutProps> = ({ title, text }) => {
  return (
    <section className="mb-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">{title}</h3>
        <p className="text-sm text-yellow-800">{text}</p>
      </div>
    </section>
  );
};
