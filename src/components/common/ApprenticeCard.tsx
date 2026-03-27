import { MapPin, Star, Briefcase, DollarSign } from 'lucide-react';
import { ApprenticeProfile, Profile } from '../../types/database.types';
import { Card } from './Card';
import { Badge } from './Badge';

interface ApprenticeCardProps {
  apprentice: ApprenticeProfile & { profile: Partial<Profile> };
  onClick?: (apprentice: any) => void;
}

export function ApprenticeCard({ apprentice, onClick }: ApprenticeCardProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'unavailable': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Card onClick={() => onClick?.(apprentice)} className="flex flex-col h-full border-gray-100 hover:border-green-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
            {apprentice.profile.full_name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="font-medium">{apprentice.profile.location}</span>
          </div>
        </div>
        <Badge variant={getAvailabilityColor(apprentice.availability) as any} size="sm" className="ml-2 uppercase tracking-wider">
          {apprentice.availability}
        </Badge>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-yellow-900">{apprentice.rating.toFixed(1)}</span>
          <span className="text-yellow-700 text-sm">({apprentice.total_reviews})</span>
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg text-blue-900">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span className="font-bold">{apprentice.total_jobs} jobs</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">{apprentice.bio}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {apprentice.skills.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" size="xs">
            {skill}
          </Badge>
        ))}
        {apprentice.skills.length > 3 && (
          <Badge variant="secondary" size="xs">
            +{apprentice.skills.length - 3} more
          </Badge>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Hourly Rate</p>
              <p className="font-bold text-gray-900">₦{apprentice.hourly_rate.toLocaleString()}/hr</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="text-xs group-hover:bg-green-600 group-hover:text-white transition-all">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}

import { Button } from './Button';
