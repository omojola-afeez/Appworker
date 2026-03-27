import { Star, Users, Briefcase } from 'lucide-react';

interface ReviewSummaryProps {
  rating: number;
  totalReviews: number;
  totalJobs: number;
  className?: string;
}

export function ReviewSummary({
  rating,
  totalReviews,
  totalJobs,
  className = '',
}: ReviewSummaryProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
        <div className="w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center border border-yellow-100 shadow-sm">
          <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Overall Rating</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-gray-400 font-medium">/ 5.0</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm">
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Reviews</p>
          <span className="text-3xl font-bold text-gray-900">{totalReviews}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center border border-green-100 shadow-sm">
          <Briefcase className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Jobs Completed</p>
          <span className="text-3xl font-bold text-gray-900">{totalJobs}</span>
        </div>
      </div>
    </div>
  );
}
