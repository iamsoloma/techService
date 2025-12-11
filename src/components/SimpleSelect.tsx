import { forwardRef } from 'react';

interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

SimpleSelect.displayName = 'SimpleSelect';
