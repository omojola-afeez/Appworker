import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  options: { label: string; value: string | number }[];
  containerClassName?: string;
}

export function Select({
  label,
  error,
  helperText,
  icon,
  options,
  className = '',
  containerClassName = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseStyles = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 transition-all outline-none appearance-none bg-white';
  const errorStyles = error ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200 focus:border-blue-500';
  const iconStyles = icon ? 'pl-10' : '';

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <select
          id={selectId}
          className={`${baseStyles} ${errorStyles} ${iconStyles} ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
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
