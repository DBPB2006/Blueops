import { Link } from 'react-router-dom';

export default function AnimatedButton({ children, className = "", onClick, to }) {
  const innerContent = (
    <div className="relative overflow-hidden h-full flex flex-col justify-center w-full">
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full absolute inset-0 flex items-center justify-center">
        {children}
      </span>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-full group-hover:translate-y-0 absolute inset-0 flex items-center justify-center">
        {children}
      </span>
      {/* Invisible spacer to maintain button size based on content */}
      <span className="invisible px-6 py-2 block">{children}</span>
    </div>
  );

  if (to) {
    return (
      <Link 
        to={to}
        onClick={onClick}
        className={`group relative overflow-hidden flex items-center justify-center ${className}`}
      >
        {innerContent}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={`group relative overflow-hidden flex items-center justify-center ${className}`}
    >
      {innerContent}
    </button>
  );
}
