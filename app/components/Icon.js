export default function Icon({ src, alt, className = "w-6 h-6" }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={(e) => {
        e.target.style.display = 'none';
        console.error(`Failed to load icon: ${src}`);
      }}
    />
  );
}
