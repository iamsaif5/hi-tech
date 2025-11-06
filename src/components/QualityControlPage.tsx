import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { KPICard } from './reports/KPICard';
import { 
  TrendingDown,
  AlertTriangle, 
  DollarSign,
  Recycle,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

interface WasteIncident {
  id: string;
  timestamp: string;
  area: 'Extruder' | 'Loomage' | 'Printing' | 'Cutting' | 'Bagging';
  rootCause: string;
  resolvedBy: string;
  notes: string;
  wasteKg: number;
  costR: number;
}

interface WasteDriver {
  name: string;
  wasteKg: number;
  cumulativePercent: number;
}

interface DailyWaste {
  date: string;
  extruder: number;
  loomage: number;
  printing: number;
  cutting: number;
  bagging: number;
}

// Waste Incident Detail Modal
const WasteIncidentModal: React.FC<{ 
  incident: WasteIncident | null; 
  isOpen: boolean; 
  onClose: () => void 
}> = ({ incident, isOpen, onClose }) => {
  if (!incident) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Waste Incident Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Incident Information</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Time: {format(new Date(incident.timestamp), 'PPp')}</div>
                <div>Area: {incident.area}</div>
                <div>Root Cause: {incident.rootCause}</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Impact & Resolution</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Waste: {incident.wasteKg}kg</div>
                <div>Cost: R{incident.costR.toLocaleString()}</div>
                <div>Resolved by: {incident.resolvedBy}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Notes</h4>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              {incident.notes}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const QualityControlPage = () => {
  const [selectedIncident, setSelectedIncident] = useState<WasteIncident | null>(null);
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  // Mock data - in real app, this would come from waste_logs table
  const [wasteIncidents] = useState<WasteIncident[]>([
    {
      id: '1',
      timestamp: '2025-01-10T07:45:00Z',
      area: 'Extruder',
      rootCause: 'Temperature fluctuation',
      resolvedBy: 'John Smith',
      notes: 'Heating element calibrated, temperature controller recalibrated to prevent future issues',
      wasteKg: 15.5,
      costR: 850
    },
    {
      id: '2',
      timestamp: '2025-01-10T11:20:00Z',
      area: 'Printing',
      rootCause: 'Ink viscosity issue',
      resolvedBy: 'Sarah Wilson',
      notes: 'Ink batch replaced, viscosity testing protocol updated',
      wasteKg: 8.2,
      costR: 450
    },
    {
      id: '3',
      timestamp: '2025-01-10T14:15:00Z',
      area: 'Loomage',
      rootCause: 'Bobbin failure',
      resolvedBy: 'Mike Chen',
      notes: 'Defective bobbin replaced, supplier quality issue reported',
      wasteKg: 12.3,
      costR: 675
    },
    {
      id: '4',
      timestamp: '2025-01-10T16:30:00Z',
      area: 'Cutting',
      rootCause: 'Blade dullness',
      resolvedBy: 'Lisa Brown',
      notes: 'Cutting blade replaced, maintenance schedule updated',
      wasteKg: 5.8,
      costR: 320
    },
    {
      id: '5',
      timestamp: '2025-01-10T09:45:00Z',
      area: 'Bagging',
      rootCause: 'Seal temperature variance',
      resolvedBy: 'David Wilson',
      notes: 'Temperature calibration corrected, seal quality improved',
      wasteKg: 3.2,
      costR: 175
    }
  ]);

  // Mock data for 7-day waste chart
  const [dailyWasteData] = useState<DailyWaste[]>([
    { date: 'Jan 4', extruder: 2.1, loomage: 1.8, printing: 2.5, cutting: 1.2, bagging: 0.8 },
    { date: 'Jan 5', extruder: 1.9, loomage: 2.2, printing: 1.8, cutting: 1.5, bagging: 1.1 },
    { date: 'Jan 6', extruder: 2.3, loomage: 1.6, printing: 2.1, cutting: 1.0, bagging: 0.9 },
    { date: 'Jan 7', extruder: 1.7, loomage: 2.0, printing: 2.3, cutting: 1.3, bagging: 1.2 },
    { date: 'Jan 8', extruder: 2.0, loomage: 1.9, printing: 1.9, cutting: 1.1, bagging: 0.7 },
    { date: 'Jan 9', extruder: 2.2, loomage: 2.1, printing: 2.0, cutting: 1.4, bagging: 1.0 },
    { date: 'Jan 10', extruder: 1.8, loomage: 2.3, printing: 2.2, cutting: 1.2, bagging: 0.8 }
  ]);

  // Mock data for top waste drivers (Pareto analysis)
  const [wasteDrivers] = useState<WasteDriver[]>([
    { name: 'Temperature fluctuation', wasteKg: 45.2, cumulativePercent: 35.4 },
    { name: 'Ink viscosity issue', wasteKg: 28.7, cumulativePercent: 57.9 },
    { name: 'Bobbin failure', wasteKg: 22.1, cumulativePercent: 75.2 },
    { name: 'Blade dullness', wasteKg: 18.5, cumulativePercent: 89.7 },
    { name: 'Seal temperature variance', wasteKg: 13.2, cumulativePercent: 100.0 }
  ]);

  // Calculate KPIs
  const today = new Date().toISOString().split('T')[0];
  const todaysIncidents = wasteIncidents.filter(incident => incident.timestamp.startsWith(today));
  
  const wasteKpiData = {
    wastePercentageToday: 2.8,
    scrapKgToday: todaysIncidents.reduce((sum, incident) => sum + incident.wasteKg, 0),
    costToday: todaysIncidents.reduce((sum, incident) => sum + incident.costR, 0),
    deltaVsTarget: 0.3, // vs 2.5% target
    deltaVsLastWeek: -0.4
  };

  const openIncidentModal = (incident: WasteIncident) => {
    setSelectedIncident(incident);
    setIsIncidentModalOpen(true);
  };

  // Get KPI status colors
  const getWasteStatus = (current: number, target: number = 2.5) => {
    const overTarget = ((current - target) / target) * 100;
    if (overTarget <= 0) return 'good';
    if (overTarget <= 10) return 'warning';
    return 'critical';
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold">Waste Snapshot</h2>
        <p className="text-sm text-muted-foreground">Real-time waste monitoring and analysis</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Waste % Today"
          value={`${wasteKpiData.wastePercentageToday}%`}
          subtitle="Of total production"
          icon={<TrendingDown className="h-4 w-4" />}
          status={getWasteStatus(wasteKpiData.wastePercentageToday)}
        />
        <KPICard
          title="Scrap (kg)"
          value={`${wasteKpiData.scrapKgToday.toFixed(1)}kg`}
          subtitle="Material wasted today"
          icon={<Recycle className="h-4 w-4" />}
          status="neutral"
        />
        <KPICard
          title="Cost (R)"
          value={`R${wasteKpiData.costToday.toLocaleString()}`}
          subtitle="Financial impact today"
          icon={<DollarSign className="h-4 w-4" />}
          status="critical"
        />
        <KPICard
          title="Δ vs Target"
          value={`+${wasteKpiData.deltaVsTarget}%`}
          subtitle={`Target: 2.5% | Last week: ${wasteKpiData.deltaVsLastWeek > 0 ? '+' : ''}${wasteKpiData.deltaVsLastWeek}%`}
          icon={<AlertTriangle className="h-4 w-4" />}
          status={wasteKpiData.deltaVsTarget > 0 ? "warning" : "good"}
        />
      </div>

      {/* 7-Day Waste Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">7-Day Waste % by Process Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyWasteData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  label={{ value: 'Waste %', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="extruder" stackId="a" fill="hsl(var(--chart-1))" name="Extruder" />
                <Bar dataKey="loomage" stackId="a" fill="hsl(var(--chart-2))" name="Loomage" />
                <Bar dataKey="printing" stackId="a" fill="hsl(var(--chart-3))" name="Printing" />
                <Bar dataKey="cutting" stackId="a" fill="hsl(var(--chart-4))" name="Cutting" />
                <Bar dataKey="bagging" stackId="a" fill="hsl(var(--chart-5))" name="Bagging" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pareto Chart - Top 5 Waste Drivers */}
      {wasteDrivers.length >= 5 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top 5 Waste Drivers (Rolling 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={wasteDrivers}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    label={{ value: 'Waste (kg)', angle: -90, position: 'insideLeft' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    label={{ value: 'Cumulative %', angle: 90, position: 'insideRight' }}
                  />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="wasteKg" fill="hsl(var(--chart-1))" name="Waste (kg)" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="cumulativePercent" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Cumulative %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top 5 Waste Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                <div>Insufficient data for Pareto analysis</div>
                <div className="text-xs mt-1">Requires at least 5 distinct root-cause records</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Waste Incidents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Waste Incidents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium">Time</th>
                  <th className="text-left py-3 px-4 text-xs font-medium">Area</th>
                  <th className="text-left py-3 px-4 text-xs font-medium">Root Cause</th>
                  <th className="text-left py-3 px-4 text-xs font-medium">Kg Lost</th>
                  <th className="text-left py-3 px-4 text-xs font-medium">Resolved By</th>
                  <th className="text-left py-3 px-4 text-xs font-medium">Notes</th>
                  <th className="text-left py-3 px-4 text-xs font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {wasteIncidents.slice(0, 25).map((incident) => (
                  <tr key={incident.id} className="border-b hover:bg-muted/30">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(incident.timestamp), 'HH:mm')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-xs">
                        {incident.area}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{incident.rootCause}</td>
                    <td className="py-3 px-4 text-sm font-medium">{incident.wasteKg}kg</td>
                    <td className="py-3 px-4 text-sm">{incident.resolvedBy}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                      {incident.notes}
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openIncidentModal(incident)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Waste Incident Detail Modal */}
      <WasteIncidentModal
        incident={selectedIncident}
        isOpen={isIncidentModalOpen}
        onClose={() => setIsIncidentModalOpen(false)}
      />
    </div>
  );
};

export default QualityControlPage;