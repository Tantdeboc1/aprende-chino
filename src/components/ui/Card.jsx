// src/components/ui/Card.jsx
export default function Card({ 
  children, 
  className = "",
  ...props 
}) {
  return (
    <div 
      className={`bg-[var(--paper-hi)] rounded-2xl shadow-sm p-8 border border-[rgba(28,24,19,0.10)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}