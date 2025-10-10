// src/components/ui/Button.jsx
export default function Button({ 
  children, 
  variant = "card",
  className = "",
  ...props 
}) {
  const baseStyles = "transition font-semibold";
  
  const variants = {
    card: "bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transform hover:-translate-y-1 text-center border border-gray-700",
    action: "bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg w-full text-lg"
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