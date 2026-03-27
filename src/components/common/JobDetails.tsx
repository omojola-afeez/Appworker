import { MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';
import { Job } from '../../types/database.types';
import { Badge } from './Badge';

interface JobDetailsProps {
  job: Job & { employer?: { full_name: string; location: string } };
  className?: string;
}

export function JobDetails({ job, className = '' }: JobDetailsProps) {
  return (
    <div className={`space-y-10 ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{job.title}</h3>
          <div className="flex items-center gap-3">
            <Badge variant={job.job_type === 'hourly' ? 'success' : 'primary'} size="md" className="uppercase tracking-widest font-bold">
              {job.job_type}
            </Badge>
            <span className="text-gray-400 font-bold">•</span>
            <span className="text-gray-500 font-bold text-sm uppercase tracking-wider">Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DetailItem 
          label="Budget Range" 
          value={`₦${job.budget_min.toLocaleString()} - ₦${job.budget_max.toLocaleString()}`}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <DetailItem 
          label="Location" 
          value={job.location}
          icon={<MapPin className="w-6 h-6 text-green-600" />}
          bgColor="bg-green-50"
        />
        <DetailItem 
          label="Duration" 
          value={job.duration || 'Not specified'}
          icon={<Clock className="w-6 h-6 text-purple-600" />}
          bgColor="bg-purple-50"
        />
        <DetailItem 
          label="Posted By" 
          value={job.employer?.full_name || 'Anonymous'}
          icon={<Briefcase className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-50"
        />
      </div>

      <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Job Description</h4>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{job.description}</p>
      </div>

      <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Required Skills</h4>
        <div className="flex flex-wrap gap-3">
          {job.skills_required.map((skill) => (
            <Badge key={skill} variant="secondary" size="md" className="px-4 py-1.5 text-base font-bold">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon, bgColor }: { label: string; value: string; icon: React.ReactNode; bgColor: string }) {
  return (
    <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">{label}</p>
        <p className="font-extrabold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}
