import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { X, MapPin, DollarSign, Clock, Briefcase, Calendar } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  skills_required: string[];
  location: string;
  job_type: 'hourly' | 'contract';
  budget_min: number;
  budget_max: number;
  duration: string | null;
  employer_id: string;
  created_at: string;
  employer?: {
    full_name: string;
    location: string;
  };
}

interface JobDetailsModalProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobDetailsModal({ job, onClose, onSuccess }: JobDetailsModalProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    message: '',
    proposed_rate: '',
    start_date: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.message.trim() || formData.message.trim().length < 20) {
      setError('Please write a message of at least 20 characters');
      return false;
    }
    if (!formData.proposed_rate || parseFloat(formData.proposed_rate) <= 0) {
      setError('Please enter a valid rate');
      return false;
    }
    if (parseFloat(formData.proposed_rate) < job.budget_min || parseFloat(formData.proposed_rate) > job.budget_max) {
      setError(`Rate must be between ₦${job.budget_min.toLocaleString()} and ₦${job.budget_max.toLocaleString()}`);
      return false;
    }
    if (!formData.start_date) {
      setError('Please select a start date');
      return false;
    }
    const selectedDate = new Date(formData.start_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError('Start date cannot be in the past');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('id')
        .eq('job_id', job.id)
        .eq('apprentice_id', profile?.id)
        .maybeSingle();

      if (existingBooking) {
        setError('You have already applied to this job');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('bookings').insert({
        job_id: job.id,
        apprentice_id: profile?.id,
        employer_id: job.employer_id,
        message: formData.message,
        proposed_rate: parseFloat(formData.proposed_rate),
        start_date: formData.start_date,
        status: 'pending',
      });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.job_type === 'hourly'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {job.job_type}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget Range</p>
                  <p className="font-semibold">₦{job.budget_min.toLocaleString()} - ₦{job.budget_max.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
              </div>

              {job.duration && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{job.duration}</p>
                  </div>
                </div>
              )}

              {job.employer && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Posted By</p>
                    <p className="font-semibold">{job.employer.full_name}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Submit Your Application</h4>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Min. 20 characters)
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Explain why you're the best fit for this job..."
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.message.length} characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="proposed_rate" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rate (₦)
                  </label>
                  <input
                    id="proposed_rate"
                    type="number"
                    min={job.budget_min}
                    max={job.budget_max}
                    step="0.01"
                    value={formData.proposed_rate}
                    onChange={(e) => setFormData({ ...formData, proposed_rate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`${job.budget_min} - ${job.budget_max}`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Available Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
