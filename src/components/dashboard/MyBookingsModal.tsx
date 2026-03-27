import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApplications } from '../../hooks/useApplications';
import { Modal } from '../common/Modal';
import { ApplicationCard } from '../common/ApplicationCard';
import { ReviewModal } from './ReviewModal';
import { Booking } from '../../types/database.types';

interface MyBookingsModalProps {
  onClose: () => void;
}

export function MyBookingsModal({ onClose }: MyBookingsModalProps) {
  const { profile } = useAuth();
  const { applications, loading, refetch } = useApplications(profile?.id || '', true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'completed'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingToReview, setBookingToReview] = useState<Booking | null>(null);

  const filteredApplications = useMemo(() => {
    return applications.filter(
      (app) => filter === 'all' || app.status === filter
    );
  }, [applications, filter]);

  return (
    <Modal title="My Applications" onClose={onClose} size="5xl">
      <div className="p-8 border-b border-gray-100 bg-gray-50/50">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'pending', 'accepted', 'rejected', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm capitalize transition-all whitespace-nowrap border-2 ${
                filter === status
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading your history...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-500 font-bold text-lg">No applications found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application as any}
                isApprentice={true}
                onReview={(app) => {
                  setBookingToReview(app);
                  setShowReviewModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showReviewModal && bookingToReview && (
        <ReviewModal
          bookingId={bookingToReview.id}
          reviewerId={profile?.id || ''}
          revieweeId={bookingToReview.employer_id}
          revieweeName={(bookingToReview as any).employer?.full_name || 'Employer'}
          onClose={() => {
            setShowReviewModal(false);
            setBookingToReview(null);
          }}
          onSuccess={refetch}
        />
      )}
    </Modal>
  );
}
