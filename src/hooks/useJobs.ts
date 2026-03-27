import { useState, useEffect, useCallback } from 'react';
import { Job } from '../types/database.types';
import { jobService } from '../services/job.service';

export function useJobs(employerId?: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = employerId 
        ? await jobService.getEmployerJobs(employerId)
        : await jobService.getOpenJobs();
      setJobs(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch jobs'));
    } finally {
      setLoading(false);
    }
  }, [employerId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return { jobs, loading, error, refetch: fetchJobs };
}
