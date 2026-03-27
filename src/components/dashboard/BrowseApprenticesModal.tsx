import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Modal } from '../common/Modal';
import { ApprenticeCard } from '../common/ApprenticeCard';
import { ApprenticeDetails } from '../common/ApprenticeDetails';
import { SearchAndFilters } from '../common/SearchAndFilters';
import { EmptyState } from '../common/EmptyState';
import { ApprenticeProfile, Profile } from '../../types/database.types';

interface BrowseApprenticesModalProps {
  onClose: () => void;
}

export function BrowseApprenticesModal({ onClose }: BrowseApprenticesModalProps) {
  const [apprentices, setApprentices] = useState<(ApprenticeProfile & { profile: Partial<Profile> })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'busy'>('all');
  const [selectedApprentice, setSelectedApprentice] = useState<(ApprenticeProfile & { profile: Partial<Profile> }) | null>(null);

  useEffect(() => {
    fetchApprentices();
  }, []);

  const fetchApprentices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('apprentice_profiles')
        .select(`
          *,
          profile:profiles!apprentice_profiles_user_id_fkey(full_name, location, phone)
        `)
        .order('rating', { ascending: false });

      if (error) throw error;
      setApprentices(data || []);
    } catch (error) {
      console.error('Error fetching apprentices:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApprentices = useMemo(() => {
    return apprentices.filter((app) => {
      const matchesSearch = !searchTerm ||
        app.profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLocation = !locationFilter ||
        app.profile.location?.toLowerCase().includes(locationFilter.toLowerCase());

      const matchesAvailability = availabilityFilter === 'all' || app.availability === availabilityFilter;

      return matchesSearch && matchesLocation && matchesAvailability;
    });
  }, [apprentices, searchTerm, locationFilter, availabilityFilter]);

  const availabilityOptions = [
    { label: 'All Availability', value: 'all' },
    { label: 'Available', value: 'available' },
    { label: 'Busy', value: 'busy' },
  ];

  return (
    <Modal title="Browse Skilled Apprentices" onClose={onClose} size="6xl">
      <div className="p-8 bg-gray-50/50">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          typeFilter={availabilityFilter}
          onTypeChange={(val) => setAvailabilityFilter(val as any)}
          onClearFilters={() => {
            setSearchTerm('');
            setLocationFilter('');
            setAvailabilityFilter('all');
          }}
          typeOptions={availabilityOptions}
          placeholder="Search by name, skills, or bio..."
        />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-4"></div>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Finding Talent...</p>
          </div>
        ) : filteredApprentices.length === 0 ? (
          <EmptyState
            icon="apprentices"
            title="No apprentices found"
            description="Try adjusting your filters or search terms to find more talent."
            action={{
              label: "Clear All Filters",
              onClick: () => {
                setSearchTerm('');
                setLocationFilter('');
                setAvailabilityFilter('all');
              }
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApprentices.map((apprentice) => (
              <ApprenticeCard
                key={apprentice.id}
                apprentice={apprentice}
                onClick={setSelectedApprentice}
              />
            ))}
          </div>
        )}
      </div>

      {selectedApprentice && (
        <Modal 
          title={selectedApprentice.profile.full_name || 'Apprentice Details'} 
          onClose={() => setSelectedApprentice(null)} 
          size="4xl"
        >
          <div className="p-8">
            <ApprenticeDetails apprentice={selectedApprentice} />
          </div>
        </Modal>
      )}
    </Modal>
  );
}
