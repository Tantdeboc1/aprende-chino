// src/components/ui/Card.jsx
import { memo } from 'react';

const Card = memo(({
  children,
  variant = "default",
  interactive = false,
  className = "",
  onClick,
  ...props
}) => {
  const variants = {
    default: "bg-gray-800 border-gray-700",
    interactive: "bg-gray-800 border-gray-700 hover:border-purple-500 cursor-pointer transition-all",
    success: "bg-green-900/20 border-green-700 border-l-4 border-l-green-500",
    warning: "bg-yellow-900/20 border-yellow-700 border-l-4 border-l-yellow-500",
    error: "bg-red-900/20 border-red-700 border-l-4 border-l-red-500",
    elevated: "bg-gray-800 border-gray-700 shadow-2xl hover:shadow-purple-500/20 transition-all"
  };

  const selectedVariant = interactive ? 'interactive' : variant;

  return (
    <div
      className={`
        rounded-xl shadow-lg border p-6
        ${variants[selectedVariant]}
        ${onClick ? 'hover:shadow-xl' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}, (prev, next) =>
  prev.variant === next.variant &&
  prev.interactive === next.interactive &&
  prev.className === next.className
);

Card.displayName = 'Card';
export default Card;