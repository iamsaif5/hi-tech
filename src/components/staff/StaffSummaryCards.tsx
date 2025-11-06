
import React from 'react';
import { Users, UserCheck, UserX, UserPlus, Clock, CheckCircle, XCircle, FileText, Calendar, Sun, Moon, AlertTriangle, Award } from 'lucide-react';

interface StaffSummaryCardsProps {
  activeTab: string;
}

const StaffSummaryCards = ({ activeTab }: StaffSummaryCardsProps) => {
  const getTabData = () => {
    switch (activeTab) {
      case 'payroll':
        return [
          {
            title: 'Ready',
            value: '2',
            icon: CheckCircle,
            color: 'text-green-600',
          },
          {
            title: 'Paid',
            value: '8',
            icon: CheckCircle,
            color: 'text-blue-600',
          },
          {
            title: 'Cancelled',
            value: '1',
            icon: XCircle,
            color: 'text-red-600',
          },
          {
            title: 'Draft',
            value: '3',
            icon: FileText,
            color: 'text-orange-600',
          },
          {
            title: 'Avg hours (this week)',
            value: '38.5h',
            icon: Clock,
            color: 'text-blue-600',
          }
        ];
      case 'directory':
        return [
          {
            title: 'Total Staff',
            value: '24',
            icon: Users,
            color: 'text-blue-600',
          },
          {
            title: 'Active',
            value: '22',
            icon: UserCheck,
            color: 'text-green-600',
          },
          {
            title: 'On Leave',
            value: '2',
            icon: UserX,
            color: 'text-orange-600',
          },
          {
            title: 'New This Month',
            value: '3',
            icon: UserPlus,
            color: 'text-blue-600',
          },
          {
            title: 'Avg Experience',
            value: '2.8 yrs',
            icon: Award,
            color: 'text-blue-600',
          }
        ];
      case 'attendance':
        return [
          {
            title: 'Present Today',
            value: '18',
            icon: UserCheck,
            color: 'text-green-600',
          },
          {
            title: 'Absent',
            value: '4',
            icon: UserX,
            color: 'text-red-600',
          },
          {
            title: 'Late Arrivals',
            value: '2',
            icon: Clock,
            color: 'text-orange-600',
          },
          {
            title: 'Early Departures',
            value: '1',
            icon: Clock,
            color: 'text-orange-600',
          },
          {
            title: 'Attendance Rate',
            value: '92%',
            icon: CheckCircle,
            color: 'text-green-600',
          }
        ];
      case 'schedule':
        return [
          {
            title: 'Scheduled Today',
            value: '20',
            icon: Calendar,
            color: 'text-blue-600',
          },
          {
            title: 'Day Shift',
            value: '12',
            icon: Sun,
            color: 'text-blue-600',
          },
          {
            title: 'Night Shift',
            value: '8',
            icon: Moon,
            color: 'text-blue-600',
          },
          {
            title: 'Overtime Hours',
            value: '24h',
            icon: Clock,
            color: 'text-orange-600',
          },
          {
            title: 'Coverage Rate',
            value: '95%',
            icon: CheckCircle,
            color: 'text-green-600',
          }
        ];
      case 'notes':
        return [
          {
            title: 'Total Notes',
            value: '45',
            icon: FileText,
            color: 'text-blue-600',
          },
          {
            title: 'This Week',
            value: '8',
            icon: FileText,
            color: 'text-blue-600',
          },
          {
            title: 'Performance',
            value: '12',
            icon: Award,
            color: 'text-green-600',
          },
          {
            title: 'Issues',
            value: '3',
            icon: AlertTriangle,
            color: 'text-red-600',
          },
          {
            title: 'Achievements',
            value: '15',
            icon: Award,
            color: 'text-green-600',
          }
        ];
      default:
        return [
          {
            title: 'Total Staff',
            value: '24',
            icon: Users,
            color: 'text-blue-600',
          },
          {
            title: 'Active',
            value: '22',
            icon: UserCheck,
            color: 'text-green-600',
          },
          {
            title: 'On Leave',
            value: '2',
            icon: UserX,
            color: 'text-orange-600',
          },
          {
            title: 'New This Month',
            value: '3',
            icon: UserPlus,
            color: 'text-blue-600',
          },
          {
            title: 'Avg Experience',
            value: '2.8 yrs',
            icon: Award,
            color: 'text-blue-600',
          }
        ];
    }
  };

  const summaryData = getTabData();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
      {summaryData.map((item, index) => (
        <div key={index} className="data-card">
          <div className="flex items-center gap-2 mb-2">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <h3 className="text-xs font-medium text-gray-600">
              {item.title}
            </h3>
          </div>
          <p className="text-base font-semibold text-gray-900">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StaffSummaryCards;
