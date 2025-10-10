// src/components/ui/Card.jsx
export default function Card({ 
  children, 
  className = "",
  ...props 
}) {
  return (
    <div 
      className={`bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}