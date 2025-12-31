'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import Link from 'next/link';
import BotonGeolocalizar from './BotonGeolocalizar';

// Fix para los iconos de Leaflet en Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Componente para crear iconos personalizados
function crearIconoPersonalizado(color, tipoSitio) {
  const emoji = tipoSitio === 'patrimonio' ? '🏛️' : 
                tipoSitio === 'servicio' ? '🏨' : 
                '🚨';
  
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 20px;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
}

// Icono para la ubicación del usuario
function crearIconoUsuario() {
  return L.divIcon({
    className: 'user-location-icon',
    html: `
      <div style="
        position: relative;
        width: 20px;
        height: 20px;
      ">
        <div style="
          background-color: #3B82F6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: pulse 2s ease-in-out infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
}

// Componente para centrar el mapa
function CentrarMapa({ centro, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (centro) {
      map.setView(centro, zoom);
    }
  }, [centro, zoom, map]);
  
  return null;
}

export default function MapaInteractivo({ 
  sitios = [],
  centro = [-13.163, -74.223],
  zoom = 13,
  altura = '600px',
  sitioSeleccionado = null,
  mostrarGeolocalizar = true,
  ubicacionUsuario = null  // ← NUEVO PROP
}) {
  return (
    <div style={{ height: altura, width: '100%', position: 'relative' }}>
      <MapContainer
        center={centro}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Centrar mapa si hay sitio seleccionado */}
        {sitioSeleccionado && (
          <CentrarMapa 
            centro={[sitioSeleccionado.latitud, sitioSeleccionado.longitud]} 
            zoom={15} 
          />
        )}

        {/* Botón de geolocalización */}
        {mostrarGeolocalizar && <BotonGeolocalizar />}

        {/* Marcador de ubicación del usuario */}
        {ubicacionUsuario && (
          <>
            {/* Círculo de precisión */}
            <Circle
              center={ubicacionUsuario}
              radius={100}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.1,
                weight: 2
              }}
            />
            
            {/* Marcador del usuario */}
            <Marker
              position={ubicacionUsuario}
              icon={crearIconoUsuario()}
              zIndexOffset={1000}
            >
              <Popup>
                <div className="text-center p-2">
                  <div className="text-2xl mb-2">📍</div>
                  <p className="font-bold text-blue-600">Tu ubicación</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Lat: {ubicacionUsuario[0].toFixed(6)}<br/>
                    Lng: {ubicacionUsuario[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Marcadores de sitios */}
        {sitios.map((sitio) => (
          <Marker
            key={sitio.id}
            position={[sitio.latitud, sitio.longitud]}
            icon={crearIconoPersonalizado(
              sitio.categoria.color,
              sitio.tipoSitio
            )}
          >
            <Popup maxWidth={300}>
              <div className="p-2">
                <img 
                  src={sitio.imagenPrincipal}
                  alt={sitio.nombre}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="font-bold text-lg mb-1">{sitio.nombre}</h3>
                <p 
                  className="text-xs font-semibold px-2 py-1 rounded inline-block text-white mb-2"
                  style={{ backgroundColor: sitio.categoria.color }}
                >
                  {sitio.categoria.nombre}
                </p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {sitio.descripcionCorta}
                </p>
                
                {/* Información según tipo */}
                {sitio.tipoSitio === 'patrimonio' && (
                  <div className="text-xs text-gray-600 mb-3 space-y-1">
                    {sitio.horario && <p>🕒 {sitio.horario}</p>}
                    {sitio.precioGeneral !== null && (
                      <p>
                        🎫 {sitio.precioGeneral === 0 ? 'Gratis' : `S/ ${sitio.precioGeneral}`}
                      </p>
                    )}
                  </div>
                )}

                {sitio.tipoSitio === 'servicio' && sitio.rangoPrecios && (
                  <p className="text-sm font-semibold text-amber-700 mb-3">
                    {sitio.rangoPrecios}
                  </p>
                )}

                {sitio.tipoSitio === 'emergencia' && sitio.telefonoEmergencia && (
                  <div className="bg-red-50 p-2 rounded mb-3">
                    <p className="text-xs text-red-700 font-bold">
                      📞 Emergencia: {sitio.telefonoEmergencia}
                    </p>
                  </div>
                )}

                <Link 
                  href={`/${sitio.tipoSitio === 'servicio' ? 'servicios' : 'sitios'}/${sitio.slug}`}
                  className="block w-full text-center px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition text-sm font-medium"
                >
                  Ver detalles
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}