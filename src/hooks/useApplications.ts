import { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types/database.types';
import { jobService } from '../services/job.service';

export function useApplications(userId: string, isApprentice: boolean) {
  const [applications, setApplications] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = isApprentice
        ? await jobService.getApprenticeBookings(userId)
        : []; // Employer applications are fetched per job in JobManagementModal
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch applications'));
    } finally {
      setLoading(false);
    }
  }, [userId, isApprentice]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refetch: fetchApplications };
}
