// src/components/ui/Button.jsx
export default function Button({ 
  children, 
  variant = "card",
  className = "",
  ...props 
}) {
  const baseStyles = "transition font-semibold";
  
  const variants = {
    card: "bg-[#fbf5e6] rounded-xl shadow-lg p-8 hover:shadow-sm transform hover:-translate-y-1 text-center border border-[rgba(28,24,19,0.10)]",
    action: "bg-[#c8392f] hover:bg-[#8b1f1a] text-[#fbf5e6] py-3 rounded-lg w-full text-lg"
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