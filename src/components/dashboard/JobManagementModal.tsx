import { useState, useEffect } from 'react';
import { jobService } from '../../services/job.service';
import { Modal } from '../common/Modal';
import { JobDetails } from '../common/JobDetails';
import { ApplicationCard } from '../common/ApplicationCard';
import { ReviewModal } from './ReviewModal';
import { Job, Booking } from '../../types/database.types';
import { Button } from '../common/Button';
import { Check, XCircle, Users, Layout } from 'lucide-react';

interface JobManagementModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobManagementModal({ job, onClose, onSuccess }: JobManagementModalProps) {
  const [applications, setApplications] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'applications'>('applications');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [applicationToReview, setApplicationToReview] = useState<Booking | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobBookings(job.id);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await jobService.updateBookingStatus(applicationId, newStatus);

      if (newStatus === 'accepted') {
        await jobService.updateJob(job.id, { status: 'in_progress' });
      }

      await fetchApplications();
      onSuccess();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleUpdateJobStatus = async (newStatus: 'open' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await jobService.updateJob(job.id, { status: newStatus });

      if (newStatus === 'completed' || newStatus === 'cancelled') {
        // Find all accepted applications and update them too
        const acceptedApps = applications.filter(a => a.status === 'accepted');
        for (const app of acceptedApps) {
          await jobService.updateBookingStatus(app.id, newStatus);
        }
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  return (
    <Modal title={job.title} onClose={onClose} size="6xl">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="flex p-2 gap-2">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-extrabold transition-all rounded-xl ${
              activeTab === 'applications'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-500 hover:bg-white/50'
            }`}
          >
            <Users className="w-5 h-5" />
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-extrabold transition-all rounded-xl ${
              activeTab === 'details'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-500 hover:bg-white/50'
            }`}
          >
            <Layout className="w-5 h-5" />
            Project Details
          </button>
        </div>
      </div>

      <div className="p-8">
        {activeTab === 'details' ? (
          <div className="space-y-10">
            <JobDetails job={job as any} />
            
            <div className="pt-10 border-t border-gray-100">
              <h4 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Project Controls</h4>
              <div className="flex flex-wrap gap-4">
                {job.status === 'open' && (
                  <>
                    <Button
                      onClick={() => handleUpdateJobStatus('in_progress')}
                      variant="primary"
                      size="lg"
                      className="px-8 shadow-lg shadow-blue-100"
                    >
                      <Check className="w-5 h-5 mr-2" /> Start Project
                    </Button>
                    <Button
                      onClick={() => handleUpdateJobStatus('cancelled')}
                      variant="danger"
                      size="lg"
                      className="px-8 shadow-lg shadow-red-100"
                    >
                      <XCircle className="w-5 h-5 mr-2" /> Cancel Project
                    </Button>
                  </>
                )}
                {job.status === 'in_progress' && (
                  <Button
                    onClick={() => handleUpdateJobStatus('completed')}
                    variant="success"
                    size="lg"
                    className="px-8 shadow-lg shadow-green-100"
                  >
                    <Check className="w-5 h-5 mr-2" /> Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h4 className="text-2xl font-bold text-gray-900 mb-2">No applications yet</h4>
            <p className="text-gray-500 font-medium text-lg">Apprentices will apply to your job soon. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application as any}
                isApprentice={false}
                onStatusUpdate={handleUpdateApplicationStatus}
                onReview={(app) => {
                  setApplicationToReview(app);
                  setShowReviewModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {showReviewModal && applicationToReview && (
        <ReviewModal
          bookingId={applicationToReview.id}
          reviewerId={job.employer_id}
          revieweeId={applicationToReview.apprentice_id}
          revieweeName={(applicationToReview as any).apprentice?.full_name || 'Apprentice'}
          onClose={() => {
            setShowReviewModal(false);
            setApplicationToReview(null);
          }}
          onSuccess={() => {
            fetchApplications();
            onSuccess();
          }}
        />
      )}
    </Modal>
  );
}
