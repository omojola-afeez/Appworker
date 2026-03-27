import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/job.service';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Plus, X, Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba',
  'Yobe', 'Zamfara'
];

interface PostJobModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function PostJobModal({ onClose, onSuccess }: PostJobModalProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills_required: [] as string[],
    customSkill: '',
    location: '',
    job_type: 'hourly' as 'hourly' | 'contract',
    budget_min: '',
    budget_max: '',
    duration: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (formData.customSkill.trim() && !formData.skills_required.includes(formData.customSkill.trim())) {
      setFormData({
        ...formData,
        skills_required: [...formData.skills_required, formData.customSkill.trim()],
        customSkill: '',
      });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills_required: formData.skills_required.filter((s) => s !== skill),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.location) {
      setError('Please select a location');
      return;
    }

    if (formData.skills_required.length === 0) {
      setError('Please add at least one required skill');
      return;
    }

    if (parseFloat(formData.budget_min) > parseFloat(formData.budget_max)) {
      setError('Minimum budget cannot be greater than maximum budget');
      return;
    }

    setLoading(true);
    try {
      await jobService.createJob({
        employer_id: profile?.id || '',
        title: formData.title,
        description: formData.description,
        skills_required: formData.skills_required,
        location: formData.location,
        job_type: formData.job_type,
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
        duration: formData.duration,
        status: 'open',
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Post a New Project" onClose={onClose} size="4xl">
      <form onSubmit={handleSubmit} className="p-8 space-y-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <Input
              label="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Expert Plumber Needed for Home Renovation"
              required
              icon={<Briefcase className="w-5 h-5" />}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Project Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed"
              placeholder="Describe the project requirements, scope, and any specific details..."
              required
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Required Skills</label>
            <div className="flex gap-3">
              <Input
                value={formData.customSkill}
                onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill (e.g., Welding)"
                containerClassName="flex-1"
              />
              <Button type="button" onClick={addSkill} variant="primary" className="px-6 rounded-xl">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills_required.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-blue-900 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <Select
            label="Location (State)"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            options={[
              { label: 'Select State', value: '' },
              ...NIGERIAN_STATES.map(s => ({ label: s, value: s }))
            ]}
            required
            icon={<MapPin className="w-5 h-5" />}
          />

          <Select
            label="Project Type"
            value={formData.job_type}
            onChange={(e) => setFormData({ ...formData, job_type: e.target.value as any })}
            options={[
              { label: 'Hourly Rate', value: 'hourly' },
              { label: 'Contract / Fixed Price', value: 'contract' },
            ]}
            required
            icon={<Clock className="w-5 h-5" />}
          />

          <Input
            label="Min Budget (₦)"
            type="number"
            value={formData.budget_min}
            onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
            placeholder="0.00"
            required
            icon={<DollarSign className="w-5 h-5" />}
          />

          <Input
            label="Max Budget (₦)"
            type="number"
            value={formData.budget_max}
            onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
            placeholder="0.00"
            required
            icon={<DollarSign className="w-5 h-5" />}
          />

          <div className="md:col-span-2">
            <Input
              label="Estimated Duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g., 2 weeks, 3 months, or 'Ongoing'"
              icon={<Clock className="w-5 h-5" />}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <Button type="button" onClick={onClose} variant="outline" fullWidth size="lg" className="rounded-2xl">
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} fullWidth size="lg" variant="secondary" className="rounded-2xl shadow-xl shadow-green-100">
            Post Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
