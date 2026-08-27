import React from 'react';

// ==========================================
// 1. Loading Spinner
// ==========================================
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <svg
        className={`animate-spin text-forest-600 ${sizeClasses[size]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

// ==========================================
// 2. Button Component
// ==========================================
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-md',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  const variants = {
    primary: 'bg-forest-600 hover:bg-forest-700 text-white focus:ring-forest-500 shadow-sm shadow-forest-100',
    secondary: 'bg-earth-600 hover:bg-earth-700 text-white focus:ring-earth-500 shadow-sm shadow-earth-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-500',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyle} ${sizeStyles[size]} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

// ==========================================
// 3. Input Component
// ==========================================
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  required,
  ...props
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        className={`block w-full rounded-lg border text-sm px-3.5 py-2 transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 text-slate-900 focus:ring-forest-500 focus:border-forest-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

// ==========================================
// 4. Select Component
// ==========================================
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helperText,
  className = '',
  id,
  required,
  ...props
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={id}
        className={`block w-full rounded-lg border text-sm px-3.5 py-2 bg-white transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 text-slate-900 focus:ring-forest-500 focus:border-forest-500'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

// ==========================================
// 5. Textarea Component
// ==========================================
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  required,
  ...props
}) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        className={`block w-full rounded-lg border text-sm px-3.5 py-2 transition focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-slate-300 text-slate-900 focus:ring-forest-500 focus:border-forest-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

// ==========================================
// 6. Card Component
// ==========================================
export const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-100 shadow-sm p-6 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ==========================================
// 7. Badge Component
// ==========================================
export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'forest' | 'earth' | 'neutral' | 'red' | 'yellow' | 'emerald';
  className?: string;
}> = ({ children, variant = 'neutral', className = '' }) => {
  const styles = {
    forest: 'bg-forest-50 text-forest-700 border border-forest-200',
    earth: 'bg-earth-50 text-earth-700 border border-earth-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    red: 'bg-red-50 text-red-700 border border-red-200',
    yellow: 'bg-amber-50 text-amber-700 border border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// 8. Toast Notification Component
// ==========================================
export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

export const Toast: React.FC<{
  message: ToastMessage;
  onClose: (id: string) => void;
}> = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(message.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-slate-800 text-white',
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg shadow-lg max-w-sm w-full animate-fade-in ${
        bgColors[message.type]
      }`}
    >
      <span className="text-sm font-medium">{message.text}</span>
      <button
        onClick={() => onClose(message.id)}
        className="ml-4 text-white hover:text-slate-200 focus:outline-none"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
