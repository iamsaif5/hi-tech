
import React from 'react';

export const WeeklyAISummary: React.FC = () => {
  const insights = [
    "🛠️ Cutter B2 showed 2 QC failures (print skew)",
    "♻️ Waste on Extruder A1 at 4.8%, exceeded target",
    "👷 4 of 6 operators clocked in, 2 missing logs",
    "⚠️ Downtime logged for Loom 3 due to thread break"
  ];

  return (
    <section className="bg-blue-50 p-4 rounded-lg mb-6">
      <h3 className="text-lg font-semibold mb-2">🧠 AI Report Summary (This Week)</h3>
      <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </section>
  );
};
