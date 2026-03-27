import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../hooks/useJobs';
import { DashboardShell } from '../layout/DashboardShell';
import { DashboardHeader } from '../layout/DashboardHeader';
import { JobCard } from '../common/JobCard';
import { EmptyState } from '../common/EmptyState';
import { SectionHeader } from '../common/SectionHeader';
import { PostJobModal } from './PostJobModal';
import { BrowseApprenticesModal } from './BrowseApprenticesModal';
import { JobManagementModal } from './JobManagementModal';
import { Job } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { useEffect } from 'react';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export function EmployerDashboard() {
  const { profile } = useAuth();
  const { jobs, loading, refetch } = useJobs(profile?.id);
  
  const [stats, setStats] = useState({
    total_jobs: 0,
    active_jobs: 0,
    completed_jobs: 0,
    pending_applications: 0,
  });
  
  const [showPostJob, setShowPostJob] = useState(false);
  const [showBrowseApprentices, setShowBrowseApprentices] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    if (jobs) {
      const fetchStats = async () => {
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('id, status')
          .eq('employer_id', profile?.id);

        const total = jobs.length;
        const active = jobs.filter((j) => j.status === 'open' || j.status === 'in_progress').length;
        const completed = jobs.filter((j) => j.status === 'completed').length;
        const pending = bookingsData?.filter((b: any) => b.status === 'pending').length || 0;

        setStats({
          total_jobs: total,
          active_jobs: active,
          completed_jobs: completed,
          pending_applications: pending,
        });
      };
      fetchStats();
    }
  }, [jobs, profile?.id]);

  return (
    <DashboardShell
      onProfileClick={() => {}} // Could add edit profile for employers too
      onBrowseApprenticesClick={() => setShowBrowseApprentices(true)}
      onPostJobClick={() => setShowPostJob(true)}
    >
      <DashboardHeader stats={stats} />

      <SectionHeader 
        title="Your Job Postings" 
        subtitle="Manage and track your active projects"
        action={
          <Button 
            onClick={() => setShowPostJob(true)} 
            variant="secondary" 
            className="shadow-md shadow-green-100 gap-2"
          >
            <Plus className="w-5 h-5" /> Post New Job
          </Button>
        }
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading your projects...</p>
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="jobs"
          title="No jobs posted yet"
          description="Start by posting your first job to connect with skilled apprentices in your area."
          action={{
            label: "Post Your First Job",
            onClick: () => setShowPostJob(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job as any}
              onClick={() => setSelectedJob(job)}
              showEmployer={false}
            />
          ))}
        </div>
      )}

      {showPostJob && (
        <PostJobModal
          onClose={() => setShowPostJob(false)}
          onSuccess={refetch}
        />
      )}

      {showBrowseApprentices && (
        <BrowseApprenticesModal
          onClose={() => setShowBrowseApprentices(false)}
        />
      )}

      {selectedJob && (
        <JobManagementModal
          job={selectedJob as any}
          onClose={() => setSelectedJob(null)}
          onSuccess={refetch}
        />
      )}
    </DashboardShell>
  );
}
