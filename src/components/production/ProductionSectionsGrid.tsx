import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MachineStatusCard, { MachineData } from './MachineStatusCard';

interface ProductionSectionsGridProps {
  machines: MachineData[];
  onUpdateStatus: (machineId: string) => void;
  onTakePhoto: (machineId: string) => void;
  onReportIssue: (machineId: string) => void;
  onCallTechnician: (machineId: string) => void;
}

const ProductionSectionsGrid = ({
  machines,
  onUpdateStatus,
  onTakePhoto,
  onReportIssue,
  onCallTechnician
}: ProductionSectionsGridProps) => {
  const sections = [
    'EXTRUDER SECTION',
    'LOOMAGE SECTION', 
    'CUTTING SECTION',
    'PRINTING SECTION',
    'BAGGING SECTION'
  ];

  const getMachinesBySection = (section: string) => {
    return machines.filter(machine => 
      machine.section.toUpperCase().includes(section.split(' ')[0])
    );
  };

  const getSectionStatusSummary = (sectionMachines: MachineData[]) => {
    const active = sectionMachines.filter(m => m.status === 'active').length;
    const total = sectionMachines.length;
    const hasIssues = sectionMachines.some(m => m.status === 'down');
    const hasWarnings = sectionMachines.some(m => m.status === 'setup' || m.status === 'maintenance');
    
    let status = 'All Active';
    let statusColor = 'text-green-600';
    
    if (hasIssues) {
      status = 'Issues Detected';
      statusColor = 'text-red-600';
    } else if (hasWarnings) {
      status = 'Attention Required';
      statusColor = 'text-yellow-600';
    }
    
    return { active, total, status, statusColor };
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const sectionMachines = getMachinesBySection(section);
        const summary = getSectionStatusSummary(sectionMachines);
        
        if (sectionMachines.length === 0) return null;
        
        return (
          <Card key={section} className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">{section}</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <span className={summary.statusColor}>{summary.status}</span>
                  <span className="text-muted-foreground">
                    {summary.active} Active / {summary.total} Total
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {sectionMachines.map((machine) => (
                  <MachineStatusCard
                    key={machine.id}
                    machine={machine}
                    onUpdateStatus={onUpdateStatus}
                    onTakePhoto={onTakePhoto}
                    onReportIssue={onReportIssue}
                    onCallTechnician={onCallTechnician}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProductionSectionsGrid;