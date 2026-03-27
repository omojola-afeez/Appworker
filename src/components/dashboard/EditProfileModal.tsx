import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profile.service';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Plus, X, Briefcase, DollarSign, Globe } from 'lucide-react';

interface EditProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_SKILLS = [
  'Carpentry', 'Plumbing', 'Electrical Work', 'Painting', 'Tiling', 'Masonry',
  'Welding', 'Tailoring', 'Hairdressing', 'Mechanic', 'Electronics Repair',
  'HVAC', 'Landscaping', 'Cleaning', 'Catering', 'Photography', 'Videography',
  'Graphic Design', 'Web Development', 'Mobile App Development'
];

export function EditProfileModal({ onClose, onSuccess }: EditProfileModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    skills: [] as string[],
    customSkill: '',
    experience_years: '',
    hourly_rate: '',
    contract_rate: '',
    bio: '',
    portfolio_links: [''],
    availability: 'available' as 'available' | 'busy' | 'unavailable',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getApprenticeProfile(user?.id || '');
      if (data) {
        setFormData({
          skills: data.skills || [],
          customSkill: '',
          experience_years: data.experience_years.toString(),
          hourly_rate: data.hourly_rate.toString(),
          contract_rate: data.contract_rate.toString(),
          bio: data.bio || '',
          portfolio_links: data.portfolio_links.length > 0 ? data.portfolio_links : [''],
          availability: data.availability,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const addCustomSkill = () => {
    if (formData.customSkill.trim() && !formData.skills.includes(formData.customSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.customSkill.trim()],
        customSkill: '',
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addPortfolioLink = () => {
    setFormData((prev) => ({
      ...prev,
      portfolio_links: [...prev.portfolio_links, ''],
    }));
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setFormData((prev) => {
      const newLinks = [...prev.portfolio_links];
      newLinks[index] = value;
      return { ...prev, portfolio_links: newLinks };
    });
  };

  const removePortfolioLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return;
    }

    if (formData.bio.length < 50) {
      setError('Professional bio must be at least 50 characters');
      return;
    }

    setSaving(true);
    try {
      const portfolioLinks = formData.portfolio_links.filter((link) => link.trim() !== '');

      await profileService.updateApprenticeProfile(user?.id || '', {
        skills: formData.skills,
        experience_years: parseInt(formData.experience_years),
        hourly_rate: parseFloat(formData.hourly_rate),
        contract_rate: formData.contract_rate ? parseFloat(formData.contract_rate) : 0,
        bio: formData.bio,
        portfolio_links: portfolioLinks,
        availability: formData.availability,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Professional Profile" onClose={onClose} size="4xl">
      {loading ? (
        <div className="p-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading profile details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8 space-y-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Availability Status</label>
            <div className="grid grid-cols-3 gap-4">
              {(['available', 'busy', 'unavailable'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, availability: status })}
                  className={`py-4 px-6 rounded-2xl border-2 transition-all capitalize font-bold text-sm ${
                    formData.availability === status
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md shadow-blue-100'
                      : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Your Skills</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {COMMON_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                    formData.skills.includes(skill)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                value={formData.customSkill}
                onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                placeholder="Add custom skill (e.g., Tiling)"
                containerClassName="flex-1"
              />
              <Button type="button" onClick={addCustomSkill} variant="primary" className="px-6 rounded-xl">
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.skills.map((skill) => (
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Input
              label="Years of Experience"
              type="number"
              min="0"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
              required
              icon={<Briefcase className="w-5 h-5" />}
            />
            <Input
              label="Hourly Rate (₦)"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourly_rate}
              onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
              required
              icon={<DollarSign className="w-5 h-5" />}
            />
            <Input
              label="Contract Rate (₦)"
              type="number"
              min="0"
              step="0.01"
              value={formData.contract_rate}
              onChange={(e) => setFormData({ ...formData, contract_rate: e.target.value })}
              placeholder="Optional"
              icon={<Globe className="w-5 h-5" />}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Professional Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={6}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed"
              placeholder="Tell employers about your expertise, notable projects, and what makes you the right choice..."
              required
            />
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-right">{formData.bio.length} / 50 min characters</p>
          </div>

          <div className="space-y-6">
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Portfolio Links</label>
            {formData.portfolio_links.map((link, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  type="url"
                  value={link}
                  onChange={(e) => updatePortfolioLink(index, e.target.value)}
                  placeholder="https://example.com/project"
                  containerClassName="flex-1"
                  icon={<Globe className="w-5 h-5" />}
                />
                {formData.portfolio_links.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removePortfolioLink(index)}
                    variant="outline"
                    className="px-4 rounded-xl text-red-500 hover:bg-red-50 hover:border-red-200"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPortfolioLink}
              className="flex items-center gap-2 text-blue-600 font-extrabold text-sm uppercase tracking-widest hover:text-blue-700 transition-all"
            >
              <Plus className="w-5 h-5" /> Add Another Project Link
            </button>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-100">
            <Button type="button" onClick={onClose} variant="outline" fullWidth size="lg" className="rounded-2xl">
              Cancel
            </Button>
            <Button type="submit" isLoading={saving} fullWidth size="lg" className="rounded-2xl shadow-xl shadow-blue-100">
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
