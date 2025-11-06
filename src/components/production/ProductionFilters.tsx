
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductionFiltersProps {
  selectedFactory: string;
  onFactoryChange: (value: string) => void;
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  filterLabel?: string;
  filterOptions?: Array<{ value: string; label: string }>;
}

const ProductionFilters = ({
  selectedFactory,
  onFactoryChange,
  selectedFilter,
  onFilterChange,
  filterLabel = "Status",
  filterOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'maintenance', label: 'Maintenance' }
  ]
}: ProductionFiltersProps) => {
  return (
    <div className="flex items-center gap-3">
      <Select value={selectedFactory} onValueChange={onFactoryChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All Factories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Factories</SelectItem>
          <SelectItem value="Midrand">Midrand</SelectItem>
          <SelectItem value="Boksburg">Boksburg</SelectItem>
          <SelectItem value="Germiston">Germiston</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedFilter} onValueChange={onFilterChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder={filterLabel} />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductionFilters;
