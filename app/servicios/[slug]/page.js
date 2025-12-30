import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Clock, MapPin, Phone, Mail, Globe, ArrowLeft,
  Wifi, CreditCard, Car, Check
} from 'lucide-react';
import Button from '@/components/ui/Button';

async function getServicio(slug) {
  const res = await fetch(`http://localhost:3000/api/sitios/${slug}`, {
    cache: 'no-store'
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ServicioDetallePage({ params }) {
  const { slug } = await params;  // ✅ Correcto
  const servicio = await getServicio(slug);

  if (!servicio || servicio.tipoSitio !== 'servicio') {
    notFound();
  }

  return (
    <div>
      {/* Header con imagen */}
      <div className="relative h-96 bg-gray-900">
        <img 
          src={servicio.imagenPrincipal}
          alt={servicio.nombre}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <Link 
              href="/servicios"
              className="text-white flex items-center gap-2 mb-4 hover:text-blue-300 transition"
            >
              <ArrowLeft size={20} />
              Volver a servicios
            </Link>

            <div 
              className="inline-block px-4 py-2 rounded-full text-white text-sm font-semibold mb-4 w-fit"
              style={{ backgroundColor: servicio.categoria.color }}
            >
              {servicio.categoria.nombre}
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
              {servicio.nombre}
            </h1>

            <div className="flex items-center gap-2 text-white/90">
              <MapPin size={20} />
              <span>{servicio.direccion}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Acerca de {servicio.nombre}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {servicio.descripcionCompleta || servicio.descripcionCorta}
              </p>
            </section>

            {/* Ubicación */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">{servicio.direccion}</p>
                    {servicio.distrito && (
                      <p className="text-gray-600 text-sm">
                        {servicio.distrito}
                      </p>
                    )}
                    {servicio.referencia && (
                      <p className="text-gray-600 text-sm mt-2">
                        {servicio.referencia}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button href="/mapa" variant="primary" className="w-full">
                    Ver en mapa
                  </Button>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${servicio.latitud},${servicio.longitud}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    Cómo llegar (Google Maps)
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 space-y-6">
              <h3 className="text-xl font-bold mb-4">
                Información de Contacto
              </h3>

              {servicio.horario && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={20} className="text-blue-600" />
                    <h4 className="font-semibold">Horario</h4>
                  </div>
                  <p className="text-gray-700">{servicio.horario}</p>
                </div>
              )}

              {/* Botón favoritos */}
              <Button variant="outline" className="w-full">
                ❤️ Agregar a favoritos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
