import SitioCard from './SitioCard';

export default function SitioGrid({ sitios }) {
  if (!sitios || sitios.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">No se encontraron sitios</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sitios.map((sitio) => (
        <SitioCard key={sitio.id} sitio={sitio} />
      ))}
    </div>
  );
}