import { MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';
import { Job } from '../../types/database.types';
import { Card } from './Card';
import { Badge } from './Badge';

interface JobCardProps {
  job: Job & { employer?: { full_name: string; location: string } };
  onClick?: (job: Job) => void;
  showEmployer?: boolean;
}

export function JobCard({ job, onClick, showEmployer = true }: JobCardProps) {
  return (
    <Card onClick={() => onClick?.(job)} className="flex flex-col h-full border-gray-100 hover:border-blue-300 group">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
        <Badge variant={job.job_type === 'hourly' ? 'success' : 'primary'} size="sm" className="ml-2 uppercase tracking-wider">
          {job.job_type}
        </Badge>
      </div>

      <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{job.description}</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">₦{job.budget_min.toLocaleString()} - ₦{job.budget_max.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-gray-600">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-medium text-gray-900">{job.location}</span>
        </div>
        {job.duration && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">{job.duration}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {job.skills_required.slice(0, 3).map((skill) => (
          <Badge key={skill} variant="secondary" size="xs">
            {skill}
          </Badge>
        ))}
        {job.skills_required.length > 3 && (
          <Badge variant="secondary" size="xs">
            +{job.skills_required.length - 3} more
          </Badge>
        )}
      </div>

      {showEmployer && job.employer && (
        <div className="pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-sm">
              <p className="text-gray-500 text-xs">Posted by</p>
              <p className="font-bold text-gray-900 leading-tight">{job.employer.full_name}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
