import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RevenueBullet from './RevenueBullet';
import CashSparkLine from './CashSparkLine';
import WasteBandLine from './WasteBandLine';

interface KpiSeriesPoint {
  date: Date;
  actual: number;
  target?: number | null;
}

interface KpiMiniChartsProps {
  revenueData: KpiSeriesPoint[];
  cashData: KpiSeriesPoint[];
  wasteData: KpiSeriesPoint[];
  featureFlags?: {
    kpiMiniChartsV2?: boolean;
  };
}

const KpiMiniCharts: React.FC<KpiMiniChartsProps> = ({
  revenueData,
  cashData,
  wasteData,
  featureFlags = {}
}) => {
  const [hoveredChart, setHoveredChart] = useState<string | null>(null);

  // Mock data for demo - in real app this would come from GraphQL
  const mockRevenueData: KpiSeriesPoint[] = [
    { date: new Date('2025-01-06'), actual: 180000, target: 170000 },
    { date: new Date('2025-01-07'), actual: 195000, target: 175000 },
    { date: new Date('2025-01-08'), actual: 165000, target: 180000 },
    { date: new Date('2025-01-09'), actual: 220000, target: 185000 },
    { date: new Date('2025-01-10'), actual: 210000, target: 190000 },
    { date: new Date('2025-01-11'), actual: 235000, target: 195000 },
    { date: new Date('2025-01-12'), actual: 225000, target: 200000 }
  ];

  const mockCashData: KpiSeriesPoint[] = [
    { date: new Date('2025-01-06'), actual: 410000, target: null },
    { date: new Date('2025-01-07'), actual: 420000, target: null },
    { date: new Date('2025-01-08'), actual: 435000, target: null },
    { date: new Date('2025-01-09'), actual: 415000, target: null },
    { date: new Date('2025-01-10'), actual: 445000, target: null },
    { date: new Date('2025-01-11'), actual: 440000, target: null },
    { date: new Date('2025-01-12'), actual: 455000, target: null }
  ];

  const mockWasteData: KpiSeriesPoint[] = [
    { date: new Date('2025-01-06'), actual: 2.5, target: 3.0 },
    { date: new Date('2025-01-07'), actual: 2.8, target: 3.0 },
    { date: new Date('2025-01-08'), actual: 3.2, target: 3.0 },
    { date: new Date('2025-01-09'), actual: 2.5, target: 3.0 },
    { date: new Date('2025-01-10'), actual: 3.8, target: 3.0 },
    { date: new Date('2025-01-11'), actual: 3.1, target: 3.0 },
    { date: new Date('2025-01-12'), actual: 3.9, target: 3.0 }
  ];

  const actualRevenueData = revenueData.length > 0 ? revenueData : mockRevenueData;
  const actualCashData = cashData.length > 0 ? cashData : mockCashData;
  const actualWasteData = wasteData.length > 0 ? wasteData : mockWasteData;

  // Calculate current values and variances
  const currentRevenue = actualRevenueData[actualRevenueData.length - 1]?.actual || 0;
  const revenueVariance = "+12% vs target";

  const currentCash = actualCashData[actualCashData.length - 1]?.actual || 0;
  const cashVariance = "+8% vs last week";

  const currentWaste = actualWasteData[actualWasteData.length - 1]?.actual || 0;
  const wasteVariance = "▲ 0.9% vs target";

  if (!featureFlags.kpiMiniChartsV2) {
    // Legacy bar charts
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue vs Target (Week-to-date)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-16 mb-2">
              {[65, 72, 58, 84, 79, 92, 87].map((height, index) => (
                <div 
                  key={index}
                  className="bg-primary flex-1 rounded-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="text-xl font-semibold">R 1.2M</div>
            <div className="text-xs text-green-600">+15% vs target</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance Trend (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-16 mb-2">
              {[78, 82, 75, 88, 85, 90, 92].map((height, index) => (
                <div 
                  key={index}
                  className="bg-green-500 flex-1 rounded-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="text-xl font-semibold">R 425K</div>
            <div className="text-xs text-green-600">+8% vs last week</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waste %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1 h-16 mb-2">
              {[45, 38, 52, 41, 49, 56, 48].map((height, index) => (
                <div 
                  key={index}
                  className="bg-amber-500 flex-1 rounded-sm"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="text-xl font-semibold">4.1%</div>
            <div className="text-xs text-red-600">▲ 1.1% vs target</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // New chart components
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card 
        className="transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setHoveredChart('revenue')}
        onMouseLeave={() => setHoveredChart(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Revenue vs Target (Week-to-date)</CardTitle>
        </CardHeader>
        <CardContent>
          <RevenueBullet 
            data={actualRevenueData}
            currentValue={currentRevenue}
            variance={revenueVariance}
            isHovered={hoveredChart !== null && hoveredChart !== 'revenue'}
          />
        </CardContent>
      </Card>

      <Card 
        className="transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setHoveredChart('cash')}
        onMouseLeave={() => setHoveredChart(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Cash Balance Trend (7 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <CashSparkLine 
            data={actualCashData}
            currentValue={currentCash}
            variance={cashVariance}
            isHovered={hoveredChart !== null && hoveredChart !== 'cash'}
          />
        </CardContent>
      </Card>

      <Card 
        className="transition-all duration-200 hover:shadow-md"
        onMouseEnter={() => setHoveredChart('waste')}
        onMouseLeave={() => setHoveredChart(null)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Waste %</CardTitle>
        </CardHeader>
        <CardContent>
          <WasteBandLine 
            data={actualWasteData}
            currentValue={currentWaste}
            variance={wasteVariance}
            isHovered={hoveredChart !== null && hoveredChart !== 'waste'}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default KpiMiniCharts;