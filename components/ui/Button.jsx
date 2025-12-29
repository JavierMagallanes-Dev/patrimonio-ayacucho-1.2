import Link from 'next/link';

export default function Button({ 
  children, 
  href, 
  variant = 'primary', 
  className = '',
  ...props 
}) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition inline-block text-center';
  
  const variants = {
    primary: 'bg-amber-700 text-white hover:bg-amber-800',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border-2 border-amber-700 text-amber-700 hover:bg-amber-50',
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}