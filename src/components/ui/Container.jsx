// src/components/ui/Container.jsx
export default function Container({ 
  children, 
  className = "",
  size = "md",
  ...props 
}) {
  const sizes = {
    md: "max-w-4xl",
    lg: "max-w-6xl"
  };

  return (
    <div 
      className={`${sizes[size]} mx-auto pt-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}