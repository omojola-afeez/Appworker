import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 pb-4 border-b border-gray-100 ${className}`}>
      <div className="flex-1">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{title}</h3>
        {subtitle && <p className="text-gray-500 text-base font-medium">{subtitle}</p>}
      </div>
      {action && <div className="w-full md:w-auto flex items-center gap-3">{action}</div>}
    </div>
  );
}
