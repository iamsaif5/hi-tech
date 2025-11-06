
import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, subtitle, icon, status = 'neutral' }) => {
  const getIconColor = () => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-hitec-highlight';
      case 'critical': return 'text-red-600';
      default: return 'text-hitec-primary';
    }
  };

  return (
    <div className="data-card">
      <div className="flex items-center gap-2 mb-1">
        <div className={getIconColor()}>{icon}</div>
        <h3 className="text-xs font-medium text-muted-foreground">
          {title}
        </h3>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
  );
};
