import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';
import { ApprenticeOnboarding } from './components/onboarding/ApprenticeOnboarding';
import { ApprenticeDashboard } from './components/dashboard/ApprenticeDashboard';
import { EmployerDashboard } from './components/dashboard/EmployerDashboard';
import { profileService } from './services/profile.service';
import { Briefcase, AlertCircle, Settings } from 'lucide-react';
import { isSupabaseConfigured } from './lib/supabase';

function AppContent() {
  const { user, profile, loading, error: authError } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-8">
            <Settings className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Configuration Required</h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Please set your Supabase environment variables in a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:
          </p>
          <div className="bg-gray-900 text-green-400 p-6 rounded-xl text-left font-mono text-sm mb-8 overflow-x-auto">
            <p>VITE_SUPABASE_URL=your_project_url</p>
            <p>VITE_SUPABASE_ANON_KEY=your_anon_key</p>
          </div>
          <p className="text-sm text-gray-500 italic">
            Restart the development server after adding the variables.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const checkApprenticeProfile = async () => {
      if (!user || !profile) {
        setCheckingProfile(false);
        return;
      }

      if (profile.user_type === 'apprentice') {
        try {
          const data = await profileService.getApprenticeProfile(user.id);

          const profileIncomplete = !data ||
            data.skills.length === 0 ||
            !data.bio ||
            data.bio.length < 50 ||
            data.hourly_rate === 0;

          setNeedsOnboarding(profileIncomplete);
        } catch (err) {
          console.error('Error checking profile:', err);
          setError('Failed to load apprentice profile. Please try again later.');
        }
      }

      setCheckingProfile(false);
    };

    checkApprenticeProfile();
  }, [user, profile]);

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <Briefcase className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ApprenticeHub</h2>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Connecting talent with opportunity...</p>
        </div>
      </div>
    );
  }

  if (authError || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{authError?.message || error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return showSignup ? (
      <SignupForm onToggle={() => setShowSignup(false)} />
    ) : (
      <LoginForm onToggle={() => setShowSignup(true)} />
    );
  }

  if (needsOnboarding && profile?.user_type === 'apprentice') {
    return <ApprenticeOnboarding onComplete={() => setNeedsOnboarding(false)} />;
  }

  if (profile?.user_type === 'apprentice') {
    return <ApprenticeDashboard />;
  }

  if (profile?.user_type === 'employer') {
    return <EmployerDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Setting up your experience...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
