export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition ${className}`}>
      {children}
    </div>
  );
}