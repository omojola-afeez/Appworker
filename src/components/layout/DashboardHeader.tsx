import { Star, Briefcase, Users, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ApprenticeProfile } from '../../types/database.types';

interface DashboardHeaderProps {
  apprenticeProfile?: ApprenticeProfile | null;
  stats?: {
    total_jobs: number;
    active_jobs: number;
    completed_jobs: number;
    pending_applications: number;
  } | null;
}

export function DashboardHeader({ apprenticeProfile, stats }: DashboardHeaderProps) {
  const { profile } = useAuth();
  const isApprentice = profile?.user_type === 'apprentice';

  if (isApprentice && apprenticeProfile) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3">Welcome back, {profile?.full_name}!</h2>
            <div className="flex flex-wrap items-center gap-4 text-blue-100">
              <div className="flex items-center gap-1.5 bg-blue-800/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{apprenticeProfile.rating.toFixed(1)} Rating</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-800/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Briefcase className="w-5 h-5" />
                <span className="font-semibold">{apprenticeProfile.total_jobs} Jobs Completed</span>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-800/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{apprenticeProfile.skills.length} Skills</span>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-full md:w-auto text-center md:text-right">
            <div className="text-sm text-blue-100 uppercase tracking-wider font-semibold mb-1">Your Hourly Rate</div>
            <div className="text-4xl font-bold">₦{apprenticeProfile.hourly_rate.toLocaleString()}</div>
            {apprenticeProfile.contract_rate > 0 && (
              <div className="text-blue-100 mt-1 text-sm">Contract: ₦{apprenticeProfile.contract_rate.toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isApprentice && stats) {
    return (
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {profile?.full_name}!</h2>
        <p className="text-gray-600 mb-8 text-lg">Manage your job postings and find skilled apprentices across Nigeria</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Jobs" 
            value={stats.total_jobs} 
            icon={<Briefcase className="w-6 h-6 text-blue-600" />} 
            bgColor="bg-blue-100"
          />
          <StatCard 
            label="Active Jobs" 
            value={stats.active_jobs} 
            icon={<Eye className="w-6 h-6 text-green-600" />} 
            bgColor="bg-green-100"
          />
          <StatCard 
            label="Completed" 
            value={stats.completed_jobs} 
            icon={<Star className="w-6 h-6 text-purple-600" />} 
            bgColor="bg-purple-100"
          />
          <StatCard 
            label="Applications" 
            value={stats.pending_applications} 
            icon={<Users className="w-6 h-6 text-orange-600" />} 
            bgColor="bg-orange-100"
          />
        </div>
      </div>
    );
  }

  return null;
}

function StatCard({ label, value, icon, bgColor }: { label: string; value: number; icon: React.ReactNode; bgColor: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
