import { Briefcase, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

interface NavbarProps {
  onProfileClick?: () => void;
  onApplicationsClick?: () => void;
  onBrowseApprenticesClick?: () => void;
  onPostJobClick?: () => void;
}

export function Navbar({
  onProfileClick,
  onApplicationsClick,
  onBrowseApprenticesClick,
  onPostJobClick,
}: NavbarProps) {
  const { profile, signOut } = useAuth();
  const isApprentice = profile?.user_type === 'apprentice';
  const isEmployer = profile?.user_type === 'employer';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/'}>
            <Briefcase className={`w-8 h-8 ${isApprentice ? 'text-blue-600' : 'text-green-600'}`} />
            <h1 className="text-xl font-bold text-gray-900">ApprenticeHub</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {isApprentice && onApplicationsClick && (
              <button
                onClick={onApplicationsClick}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors hidden md:block"
              >
                My Applications
              </button>
            )}

            {isEmployer && onBrowseApprenticesClick && (
              <button
                onClick={onBrowseApprenticesClick}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors hidden md:block"
              >
                Browse Apprentices
              </button>
            )}

            {isEmployer && onPostJobClick && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onPostJobClick}
                className="hidden md:flex gap-2"
              >
                Post a Job
              </Button>
            )}

            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

            <button
              onClick={onProfileClick}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                isApprentice ? 'hover:bg-blue-50 text-blue-700' : 'hover:bg-green-50 text-green-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">{profile?.full_name.split(' ')[0]}</span>
            </button>

            <button
              onClick={signOut}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
