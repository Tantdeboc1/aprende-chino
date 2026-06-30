// src/components/ui/Button.jsx
export default function Button({ 
  children, 
  variant = "card",
  className = "",
  ...props 
}) {
  const baseStyles = "transition font-semibold";
  
  const variants = {
    card: "bg-[var(--paper-hi)] rounded-xl shadow-lg p-8 hover:shadow-sm transform hover:-translate-y-1 text-center border border-[rgba(28,24,19,0.10)]",
    action: "bg-[var(--red)] hover:bg-[var(--red-deep)] text-[var(--on-accent)] py-3 rounded-lg w-full text-lg"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}