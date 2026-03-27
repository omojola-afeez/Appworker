import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  className = '',
  containerClassName = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseStyles = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 transition-all outline-none';
  const errorStyles = error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200 focus:border-blue-500';
  const iconStyles = icon ? 'pl-10' : '';

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`${baseStyles} ${errorStyles} ${iconStyles} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      {!error && helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
}
