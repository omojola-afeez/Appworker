import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface DashboardShellProps {
  children: ReactNode;
  onProfileClick: () => void;
  onApplicationsClick?: () => void;
  onBrowseApprenticesClick?: () => void;
  onPostJobClick?: () => void;
  className?: string;
}

export function DashboardShell({
  children,
  onProfileClick,
  onApplicationsClick,
  onBrowseApprenticesClick,
  onPostJobClick,
  className = '',
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        onProfileClick={onProfileClick}
        onApplicationsClick={onApplicationsClick}
        onBrowseApprenticesClick={onBrowseApprenticesClick}
        onPostJobClick={onPostJobClick}
      />
      <main className={`flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full ${className}`}>
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm font-medium">© 2026 ApprenticeHub. Connecting skilled talent across Nigeria.</p>
        </div>
      </footer>
    </div>
  );
}
