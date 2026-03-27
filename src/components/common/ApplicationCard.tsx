import { MapPin, DollarSign, Calendar, Clock, MessageSquare, Briefcase, User, Check, XCircle } from 'lucide-react';
import { Booking, Job, Profile, ApprenticeProfile } from '../../types/database.types';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

interface ApplicationCardProps {
  application: Booking & {
    job?: Partial<Job>;
    employer?: Partial<Profile>;
    apprentice?: Partial<Profile>;
    apprentice_profile?: Partial<ApprenticeProfile>;
  };
  onReview?: (application: any) => void;
  onStatusUpdate?: (applicationId: string, status: 'accepted' | 'rejected') => void;
  onViewProfile?: (application: any) => void;
  isApprentice?: boolean;
}

export function ApplicationCard({
  application,
  onReview,
  onStatusUpdate,
  isApprentice = true,
}: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'danger';
      case 'completed': return 'info';
      case 'cancelled': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className="flex flex-col border-gray-100 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {isApprentice ? application.job?.title : application.apprentice?.full_name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
            {isApprentice ? application.job?.description : application.apprentice_profile?.bio}
          </p>
        </div>
        <Badge variant={getStatusColor(application.status) as any} size="sm" className="ml-2 uppercase tracking-wider">
          {application.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-900">₦{application.proposed_rate.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-semibold text-gray-900 truncate">{isApprentice ? application.job?.location : application.apprentice?.location}</span>
        </div>
        {application.start_date && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-semibold text-gray-900">{new Date(application.start_date).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <span className="font-semibold text-gray-900 capitalize">{application.job?.job_type}</span>
        </div>
      </div>

      {application.message && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Message</p>
          <p className="text-sm text-gray-700 leading-relaxed italic">"{application.message}"</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 mt-auto gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {isApprentice ? <Briefcase className="w-5 h-5 text-gray-500" /> : <User className="w-5 h-5 text-gray-500" />}
          </div>
          <div className="text-sm">
            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">{isApprentice ? 'Employer' : 'Apprentice'}</p>
            <p className="font-bold text-gray-900 leading-tight">
              {isApprentice ? application.employer?.full_name : application.apprentice?.full_name}
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {application.status === 'pending' && !isApprentice && onStatusUpdate && (
            <>
              <Button size="sm" variant="outline" onClick={() => onStatusUpdate(application.id, 'rejected')} className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50">
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button size="sm" variant="success" onClick={() => onStatusUpdate(application.id, 'accepted')} className="flex-1 sm:flex-none">
                <Check className="w-4 h-4 mr-2" /> Accept
              </Button>
            </>
          )}

          {application.status === 'accepted' && (
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-green-700 font-bold uppercase tracking-wider">Contact:</span>
              <span className="text-sm font-bold text-green-900">{isApprentice ? application.employer?.phone : application.apprentice?.phone}</span>
            </div>
          )}

          {application.status === 'completed' && onReview && (
            <Button size="sm" variant="primary" onClick={() => onReview(application)} className="w-full sm:w-auto">
              <MessageSquare className="w-4 h-4 mr-2" /> Rate {isApprentice ? 'Employer' : 'Apprentice'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
