
import React from 'react';
import { Box, AlertTriangle, Target, Clock } from 'lucide-react';

interface SummaryCardProps {
  icon: 'cube' | 'alert-triangle' | 'target' | 'clock';
  title: string;
  value: string;
  desc: string;
  color?: 'blue' | 'red' | 'green' | 'yellow';
}

const iconMap = {
  'cube': Box,
  'alert-triangle': AlertTriangle,
  'target': Target,
  'clock': Clock,
};

const colorStyles = {
  blue: 'text-hitec-primary',
  red: 'text-red-600',
  green: 'text-green-600',
  yellow: 'text-hitec-highlight',
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ 
  icon, 
  title, 
  value, 
  desc, 
  color = 'blue' 
}) => {
  const IconComponent = iconMap[icon];
  
  return (
    <div className="data-card">
      <div className="flex items-center gap-2 mb-1">
        <IconComponent className={`h-4 w-4 ${colorStyles[color]}`} />
        <h3 className="text-xs font-medium text-muted-foreground">
          {title}
        </h3>
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
  );
};
