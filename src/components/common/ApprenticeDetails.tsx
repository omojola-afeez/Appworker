import { MapPin, Briefcase, DollarSign, ExternalLink, Globe, User } from 'lucide-react';
import { ApprenticeProfile, Profile } from '../../types/database.types';
import { Badge } from './Badge';
import { ReviewSummary } from './ReviewSummary';

interface ApprenticeDetailsProps {
  apprentice: ApprenticeProfile & { profile: Partial<Profile> };
  className?: string;
}

export function ApprenticeDetails({ apprentice, className = '' }: ApprenticeDetailsProps) {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'success';
      case 'busy': return 'warning';
      case 'unavailable': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className={`space-y-10 ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{apprentice.profile.full_name}</h3>
          <div className="flex items-center gap-3">
            <Badge variant={getAvailabilityColor(apprentice.availability) as any} size="md" className="uppercase tracking-widest font-bold">
              {apprentice.availability}
            </Badge>
            <span className="text-gray-400 font-bold">•</span>
            <div className="flex items-center gap-1.5 text-gray-500 font-bold text-sm uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>{apprentice.profile.location}</span>
            </div>
          </div>
        </div>
      </div>

      <ReviewSummary 
        rating={apprentice.rating}
        totalReviews={apprentice.total_reviews}
        totalJobs={apprentice.total_jobs}
        className="shadow-md"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DetailItem 
          label="Experience" 
          value={`${apprentice.experience_years} years`}
          icon={<Briefcase className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-50"
        />
        <DetailItem 
          label="Hourly Rate" 
          value={`₦${apprentice.hourly_rate.toLocaleString()}/hr`}
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          bgColor="bg-green-50"
        />
        <DetailItem 
          label="Contract Rate" 
          value={apprentice.contract_rate > 0 ? `₦${apprentice.contract_rate.toLocaleString()}/job` : 'N/A'}
          icon={<Globe className="w-6 h-6 text-purple-600" />}
          bgColor="bg-purple-50"
        />
        <DetailItem 
          label="Member Since" 
          value={new Date(apprentice.created_at).toLocaleDateString()}
          icon={<User className="w-6 h-6 text-orange-600" />}
          bgColor="bg-orange-50"
        />
      </div>

      <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Professional Bio</h4>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{apprentice.bio}</p>
      </div>

      <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Skills & Expertise</h4>
        <div className="flex flex-wrap gap-3">
          {apprentice.skills.map((skill) => (
            <Badge key={skill} variant="secondary" size="md" className="px-4 py-1.5 text-base font-bold">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {apprentice.portfolio_links && apprentice.portfolio_links.length > 0 && (
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h4 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Portfolio Links</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {apprentice.portfolio_links.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 group-hover:border-blue-300">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{link}</span>
                </div>
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
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
