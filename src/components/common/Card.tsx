import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export function Card({
  children,
  className = '',
  onClick,
  hoverEffect = true,
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden transition-all';
  const hoverStyles = hoverEffect ? 'hover:shadow-md hover:border-blue-300' : '';
  const cursorStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${cursorStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
