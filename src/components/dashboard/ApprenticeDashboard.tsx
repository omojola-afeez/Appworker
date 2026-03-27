import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../hooks/useJobs';
import { DashboardShell } from '../layout/DashboardShell';
import { DashboardHeader } from '../layout/DashboardHeader';
import { SearchAndFilters } from '../common/SearchAndFilters';
import { JobCard } from '../common/JobCard';
import { EmptyState } from '../common/EmptyState';
import { JobDetailsModal } from './JobDetailsModal';
import { EditProfileModal } from './EditProfileModal';
import { MyBookingsModal } from './MyBookingsModal';
import { SectionHeader } from '../common/SectionHeader';
import { ApprenticeProfile, Job } from '../../types/database.types';
import { useEffect } from 'react';
import { profileService } from '../../services/profile.service';

export function ApprenticeDashboard() {
  const { profile } = useAuth();
  const { jobs, loading, refetch } = useJobs();
  
  const [apprenticeProfile, setApprenticeProfile] = useState<ApprenticeProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<'all' | 'hourly' | 'contract'>('all');
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showBookings, setShowBookings] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      profileService.getApprenticeProfile(profile.id).then(setApprenticeProfile);
    }
  }, [profile?.id]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills_required.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = !locationFilter || 
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      const matchesType = jobTypeFilter === 'all' || job.job_type === jobTypeFilter;
      
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, searchTerm, locationFilter, jobTypeFilter]);

  const typeOptions = [
    { label: 'All Types', value: 'all' },
    { label: 'Hourly', value: 'hourly' },
    { label: 'Contract', value: 'contract' },
  ];

  return (
    <DashboardShell
      onProfileClick={() => setShowEditProfile(true)}
      onApplicationsClick={() => setShowBookings(true)}
    >
      <DashboardHeader apprenticeProfile={apprenticeProfile} />

      <SectionHeader 
        title="Explore Opportunities" 
        subtitle="Find the perfect project that matches your skill set"
      />

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        typeFilter={jobTypeFilter}
        onTypeChange={(val) => setJobTypeFilter(val as any)}
        onClearFilters={() => {
          setSearchTerm('');
          setLocationFilter('');
          setJobTypeFilter('all');
        }}
        typeOptions={typeOptions}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Discovering Jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon="search"
          title="No jobs found"
          description={searchTerm || locationFilter || jobTypeFilter !== 'all' 
            ? "We couldn't find any jobs matching your current filters. Try broadening your search!" 
            : "There are currently no open jobs. Check back soon for new opportunities!"}
          action={searchTerm || locationFilter || jobTypeFilter !== 'all' ? {
            label: "Clear All Filters",
            onClick: () => {
              setSearchTerm('');
              setLocationFilter('');
              setJobTypeFilter('all');
            }
          } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job as any}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob as any}
          onClose={() => setSelectedJob(null)}
          onSuccess={refetch}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          onClose={() => setShowEditProfile(false)}
          onSuccess={() => {
            if (profile?.id) {
              profileService.getApprenticeProfile(profile.id).then(setApprenticeProfile);
            }
          }}
        />
      )}

      {showBookings && (
        <MyBookingsModal
          onClose={() => setShowBookings(false)}
        />
      )}
    </DashboardShell>
  );
}
