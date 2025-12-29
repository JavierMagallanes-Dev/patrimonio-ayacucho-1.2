import Link from 'next/link';
import { Clock, Ticket, MapPin, Camera } from 'lucide-react';
import Card from '../ui/Card';

export default function SitioCard({ sitio }) {
  return (
    <Card>
      <Link href={`/sitios/${sitio.slug}`}>
        {/* Imagen */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={sitio.imagenPrincipal} 
            alt={sitio.nombre}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
          
          {/* Badge de categoría */}
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: sitio.categoria.color }}
          >
            {sitio.categoria.nombre}
          </div>

          {/* Badge de fotos históricas */}
          {sitio.imagenPrincipalAntigua && (
            <div className="absolute top-3 right-3 bg-amber-900 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Camera size={12} />
              Fotos históricas
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-amber-700 transition">
            {sitio.nombre}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {sitio.descripcionCorta}
          </p>

          {/* Información rápida */}
          {sitio.tipoSitio === 'patrimonio' && (
            <div className="space-y-2 text-sm text-gray-500">
              {sitio.horario && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-amber-700" />
                  <span>{sitio.horario}</span>
                </div>
              )}
              {sitio.precioGeneral !== null && (
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-amber-700" />
                  <span>
                    {sitio.precioGeneral === 0 ? 'Entrada gratuita' : `S/ ${sitio.precioGeneral}`}
                  </span>
                </div>
              )}
            </div>
          )}

          {sitio.tipoSitio === 'servicio' && (
            <div className="space-y-2 text-sm text-gray-500">
              {sitio.rangoPrecios && (
                <div className="flex items-center gap-2">
                  <Ticket size={16} className="text-amber-700" />
                  <span>{sitio.rangoPrecios}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}