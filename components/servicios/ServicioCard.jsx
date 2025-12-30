import Link from 'next/link';
import { MapPin, Phone, Wifi, CreditCard, Car } from 'lucide-react';
import Card from '../ui/Card';

export default function ServicioCard({ servicio }) {
  return (
    <Card>
      <Link href={`/servicios/${servicio.slug}`}>
        {/* Imagen */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={servicio.imagenPrincipal} 
            alt={servicio.nombre}
            className="w-full h-full object-cover hover:scale-110 transition duration-300"
          />
          
          {/* Badge de categoría */}
          <div 
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold"
            style={{ backgroundColor: servicio.categoria.color }}
          >
            {servicio.categoria.nombre}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-900 hover:text-amber-700 transition">
            {servicio.nombre}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {servicio.descripcionCorta}
          </p>

          {/* Rango de precios */}
          {servicio.rangoPrecios && (
            <div className="text-amber-700 font-semibold mb-3">
              {servicio.rangoPrecios}
            </div>
          )}

          {/* Servicios disponibles */}
          <div className="flex flex-wrap gap-2 mb-3">
            {servicio.tieneWifi && (
              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                <Wifi size={12} />
                WiFi
              </span>
            )}
            {servicio.aceptaTarjetas && (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                <CreditCard size={12} />
                Tarjetas
              </span>
            )}
            {servicio.tieneEstacionamiento && (
              <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                <Car size={12} />
                Parking
              </span>
            )}
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin size={14} />
            <span className="line-clamp-1">{servicio.direccion}</span>
          </div>
        </div>
      </Link>
    </Card>
  );
}