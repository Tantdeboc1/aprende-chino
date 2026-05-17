// src/components/ui/Button.jsx
import { memo } from 'react';

const Button = memo(({
  children,
  variant = "card",
  size = "md",
  icon: Icon = null,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles = "transition font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    card: "bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 border border-gray-700 hover:border-purple-500/50 text-center",
    primary: "bg-red-600 hover:bg-red-700 text-white rounded-lg",
    secondary: "bg-purple-600 hover:bg-purple-700 text-white rounded-lg",
    ghost: "bg-transparent border border-gray-600 hover:bg-gray-800 text-white rounded-lg",
    danger: "bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const variantStyle = variant === 'card' ? 'p-8 w-full' : `${sizes[size]} w-auto`;

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${variantStyle}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {Icon && !loading && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}, (prev, next) => prev.variant === next.variant && prev.disabled === next.disabled && prev.loading === next.loading);

Button.displayName = 'Button';
export default Button;