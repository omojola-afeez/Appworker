import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Plus, X } from 'lucide-react';

const COMMON_SKILLS = [
  'Carpentry', 'Plumbing', 'Electrical Work', 'Painting', 'Tiling', 'Masonry',
  'Welding', 'Tailoring', 'Hairdressing', 'Mechanic', 'Electronics Repair',
  'HVAC', 'Landscaping', 'Cleaning', 'Catering', 'Photography', 'Videography',
  'Graphic Design', 'Web Development', 'Mobile App Development'
];

export function ApprenticeOnboarding({ onComplete }: { onComplete: () => void }) {
  const { user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    skills: [] as string[],
    customSkill: '',
    experience_years: '',
    hourly_rate: '',
    contract_rate: '',
    bio: '',
    portfolio_links: [''],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    if (formData.skills.length === 0) {
      setError('Please select at least one skill');
      return false;
    }
    if (!formData.experience_years || parseInt(formData.experience_years) < 0) {
      setError('Please enter valid years of experience');
      return false;
    }
    if (!formData.hourly_rate || parseFloat(formData.hourly_rate) <= 0) {
      setError('Please enter a valid hourly rate');
      return false;
    }
    if (!formData.bio.trim() || formData.bio.trim().length < 50) {
      setError('Please write a bio of at least 50 characters');
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
      const portfolioLinks = formData.portfolio_links.filter((link) => link.trim() !== '');

      const { error: updateError } = await supabase
        .from('apprentice_profiles')
        .update({
          skills: formData.skills,
          experience_years: parseInt(formData.experience_years),
          hourly_rate: parseFloat(formData.hourly_rate),
          contract_rate: formData.contract_rate ? parseFloat(formData.contract_rate) : 0,
          bio: formData.bio,
          portfolio_links: portfolioLinks,
        })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      await refreshProfile();
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 my-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="text-gray-600 mt-2">Help employers find you by showcasing your skills</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Skills (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {COMMON_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.skills.includes(skill)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={formData.customSkill}
                onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                placeholder="Add custom skill"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                id="experience_years"
                type="number"
                min="0"
                value={formData.experience_years}
                onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700 mb-2">
                Hourly Rate (₦)
              </label>
              <input
                id="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="contract_rate" className="block text-sm font-medium text-gray-700 mb-2">
                Contract Rate (₦)
              </label>
              <input
                id="contract_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.contract_rate}
                onChange={(e) => setFormData({ ...formData, contract_rate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Professional Bio (Min. 50 characters)
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Tell employers about your experience, expertise, and what makes you unique..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">{formData.bio.length} characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Links (Optional)
            </label>
            {formData.portfolio_links.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updatePortfolioLink(index, e.target.value)}
                  placeholder="https://example.com/portfolio"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.portfolio_links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePortfolioLink(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPortfolioLink}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Another Link
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
