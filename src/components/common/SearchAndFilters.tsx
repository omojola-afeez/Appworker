import { Search, MapPin, Filter, X } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  onClearFilters: () => void;
  typeOptions: { label: string; value: string }[];
  placeholder?: string;
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  typeFilter,
  onTypeChange,
  onClearFilters,
  typeOptions,
  placeholder = "Search by title, description, or skills...",
}: SearchAndFiltersProps) {
  const hasFilters = searchTerm || locationFilter || typeFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 backdrop-blur-md bg-white/80">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="text-lg py-4 focus:ring-blue-100"
          />
        </div>
        <div className="w-full lg:w-64">
          <Input
            placeholder="Filter by Location"
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            icon={<MapPin className="w-5 h-5 text-green-600" />}
            className="text-lg py-4 focus:ring-green-100"
          />
        </div>
        <div className="w-full lg:w-64">
          <Select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            options={typeOptions}
            icon={<Filter className="w-5 h-5 text-purple-600" />}
            className="text-lg py-4 focus:ring-purple-100"
          />
        </div>
      </div>
      
      {hasFilters && (
        <div className="mt-6 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearFilters}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all gap-2"
          >
            <X className="w-4 h-4" /> Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
