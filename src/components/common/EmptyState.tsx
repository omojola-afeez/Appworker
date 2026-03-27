import { Briefcase, Search, Users, MessageSquare } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: 'jobs' | 'search' | 'apprentices' | 'messages';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon = 'jobs',
  title,
  description,
  action,
}: EmptyStateProps) {
  const icons = {
    jobs: <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-6 bg-gray-100 p-4 rounded-full" />,
    search: <Search className="w-16 h-16 text-gray-400 mx-auto mb-6 bg-gray-100 p-4 rounded-full" />,
    apprentices: <Users className="w-16 h-16 text-gray-400 mx-auto mb-6 bg-gray-100 p-4 rounded-full" />,
    messages: <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-6 bg-gray-100 p-4 rounded-full" />,
  };

  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto px-10">
      {icons[icon]}
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary" size="lg" className="px-10 shadow-lg shadow-blue-200">
          {action.label}
        </Button>
      )}
    </div>
  );
}
