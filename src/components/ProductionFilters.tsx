
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Filter, Users, Settings } from 'lucide-react';

interface ProductionFiltersProps {
  filters: {
    dateRange: string;
    machine: string;
    shift: string;
    operator: string;
  };
  onFiltersChange: (filters: any) => void;
}

const ProductionFilters = ({ filters, onFiltersChange }: ProductionFiltersProps) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 uppercase tracking-wide">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Machine Filter */}
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <Select value={filters.machine} onValueChange={(value) => updateFilter('machine', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All machines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All machines</SelectItem>
                <SelectItem value="loom_1">Loom 1</SelectItem>
                <SelectItem value="loom_2">Loom 2</SelectItem>
                <SelectItem value="cutter_a">Cutter A</SelectItem>
                <SelectItem value="cutter_b">Cutter B</SelectItem>
                <SelectItem value="printer_1">Printer 1</SelectItem>
                <SelectItem value="bagger_1">Bagger 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shift Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Shift:</span>
            <Select value={filters.shift} onValueChange={(value) => updateFilter('shift', value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All shifts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All shifts</SelectItem>
                <SelectItem value="day">Day Shift</SelectItem>
                <SelectItem value="night">Night Shift</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operator Filter */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <Select value={filters.operator} onValueChange={(value) => updateFilter('operator', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All operators" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All operators</SelectItem>
                <SelectItem value="john_smith">John Smith</SelectItem>
                <SelectItem value="mary_johnson">Mary Johnson</SelectItem>
                <SelectItem value="david_brown">David Brown</SelectItem>
                <SelectItem value="sarah_davis">Sarah Davis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionFilters;
