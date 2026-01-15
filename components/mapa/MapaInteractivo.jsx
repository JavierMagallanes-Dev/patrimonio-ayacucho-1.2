'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, LayersControl } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import Link from 'next/link';
import BotonGeolocalizar from './BotonGeolocalizar';
import { Maximize2, Camera } from 'lucide-react';

// Fix para los iconos de Leaflet en Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 🎨 Función para crear marcadores con foto miniatura
function crearIconoConFoto(imagenUrl, color, tipoSitio) {
  const emoji = tipoSitio === 'patrimonio' ? '🏛️' : 
                tipoSitio === 'servicio' ? '🏨' : '🚨';
  
  return L.divIcon({
    className: 'custom-photo-marker',
    html: `
      <div class="marker-container" style="
        position: relative;
        width: 50px;
        height: 60px;
      ">
        <!-- Foto de fondo -->
        <div style="
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid ${color};
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          background: white;
          position: relative;
        ">
          <img 
            src="${imagenUrl}" 
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
            "
            onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100'"
          />
          <!-- Overlay con emoji -->
          <div style="
            position: absolute;
            bottom: -5px;
            right: -5px;
            background: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            font-size: 12px;
          ">
            ${emoji}
          </div>
        </div>
        <!-- Punta del marcador -->
        <div style="
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 10px solid ${color};
        "></div>
      </div>
      
      <style>
        .marker-container:hover {
          transform: scale(1.1);
          transition: transform 0.2s;
          z-index: 1000 !important;
        }
      </style>
    `,
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60]
  });
}

// 🎨 Icono para ubicación del usuario (mejorado)
function crearIconoUsuario() {
  return L.divIcon({
    className: 'user-location-icon',
    html: `
      <div style="position: relative; width: 20px; height: 20px;">
        <!-- Pulso exterior -->
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
          left: -10px;
          top: -10px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        "></div>
        <!-- Punto central -->
        <div style="
          background: #3B82F6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.3; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

// 🎯 Componente para centrar el mapa
function CentrarMapa({ centro, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (centro) {
      map.setView(centro, zoom);
    }
  }, [centro, zoom, map]);
  
  return null;
}

// 🔍 Componente Fullscreen
function FullscreenControl() {
  const map = useMap();
  
  const toggleFullscreen = () => {
    const container = map.getContainer();
    if (!document.fullscreenElement) {
      container.requestFullscreen?.() || 
      container.webkitRequestFullscreen?.() || 
      container.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || 
      document.webkitExitFullscreen?.() || 
      document.msExitFullscreen?.();
    }
  };
  
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '80px' }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={toggleFullscreen}
          className="bg-white hover:bg-gray-50 w-8 h-8 flex items-center justify-center border-none cursor-pointer"
          title="Pantalla completa"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
}

// 📝 Componente Popup Mejorado con Comparador
function PopupMejorado({ sitio, tipo }) {
  const [mostrarComparador, setMostrarComparador] = useState(false);

  return (
    <div className="w-80">
      {/* Imagen principal */}
      <div className="relative">
        <img 
          src={sitio.imagenPrincipal}
          alt={sitio.nombre}
          className="w-full h-48 object-cover rounded-t"
        />
        
        {/* Badge de categoría */}
        <div 
          className="absolute top-2 left-2 px-3 py-1 rounded-full text-white text-xs font-semibold"
          style={{ backgroundColor: sitio.categoria.color }}
        >
          {sitio.categoria.nombre}
        </div>

        {/* Indicador de fotos históricas */}
        {sitio.imagenPrincipalAntigua && (
          <button
            onClick={() => setMostrarComparador(!mostrarComparador)}
            className="absolute top-2 right-2 bg-amber-900 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-amber-800"
          >
            <Camera size={12} />
            Fotos históricas
          </button>
        )}
      </div>

      {/* Comparador histórico */}
      {mostrarComparador && sitio.imagenPrincipalAntigua && (
        <div className="p-3 bg-amber-50 border-t-2 border-amber-600">
          <p className="text-xs font-semibold text-amber-900 mb-2">
            📸 Foto histórica ({sitio.anioImagenAntigua})
          </p>
          <img 
            src={sitio.imagenPrincipalAntigua}
            alt={`${sitio.nombre} - ${sitio.anioImagenAntigua}`}
            className="w-full h-32 object-cover rounded mb-2"
          />
          <p className="text-xs text-amber-800 italic">
            {sitio.descripcionImagenAntigua || 'Imagen histórica del sitio'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Fuente: {sitio.fuenteImagenAntigua || 'Archivo histórico'}
          </p>
        </div>
      )}

      {/* Contenido del popup */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{sitio.nombre}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {sitio.descripcionCorta}
        </p>

        {/* Info según tipo */}
        {tipo === 'patrimonio' && (
          <div className="space-y-1 text-sm text-gray-700 mb-3">
            {sitio.horario && <p>🕒 {sitio.horario}</p>}
            {sitio.precioGeneral !== null && (
              <p>🎫 {sitio.precioGeneral === 0 ? 'Gratis' : `S/ ${sitio.precioGeneral}`}</p>
            )}
            {sitio.tiempoVisitaMinutos && (
              <p>⏱️ ~{sitio.tiempoVisitaMinutos} minutos</p>
            )}
          </div>
        )}

        {tipo === 'servicio' && (
          <div className="space-y-1 text-sm text-gray-700 mb-3">
            {sitio.rangoPrecios && <p>💰 {sitio.rangoPrecios}</p>}
            {sitio.telefono && <p>📞 {sitio.telefono}</p>}
          </div>
        )}

        {tipo === 'emergencia' && (
          <div className="bg-red-50 p-2 rounded mb-3">
            {sitio.telefonoEmergencia && (
              <p className="text-sm font-bold text-red-700">
                🚨 Emergencia: {sitio.telefonoEmergencia}
              </p>
            )}
            {sitio.atencion24h && (
              <p className="text-xs text-red-600">⏰ Atención 24 horas</p>
            )}
          </div>
        )}

        {/* Botón de acción */}
        <Link 
          href={`/${tipo === 'servicio' ? 'servicios' : 'sitios'}/${sitio.slug}`}
          className="block w-full text-center px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition text-sm font-medium"
        >
          Ver detalles completos
        </Link>
      </div>
    </div>
  );
}

// 🎨 Función para crear clusters con colores
function createClusterCustomIcon(cluster) {
  const markers = cluster.getAllChildMarkers();
  
  // Contar tipos
  let patrimonio = 0, servicio = 0, emergencia = 0;
  markers.forEach(marker => {
    const tipo = marker.options.customData?.tipoSitio;
    if (tipo === 'patrimonio') patrimonio++;
    else if (tipo === 'servicio') servicio++;
    else if (tipo === 'emergencia') emergencia++;
  });

  const total = markers.length;
  
  // Determinar color predominante
  let color = '#8B4513'; // default marrón (patrimonio)
  if (servicio > patrimonio && servicio > emergencia) color = '#FF6B6B'; // naranja (servicio)
  if (emergencia > patrimonio && emergencia > servicio) color = '#DC2626'; // rojo (emergencia)

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${total}
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40, true)
  });
}

// 🗺️ COMPONENTE PRINCIPAL
export default function MapaInteractivo({ 
  sitios = [],
  centro = [-13.163, -74.223],
  zoom = 13,
  altura = '600px',
  sitioSeleccionado = null,
  mostrarGeolocalizar = true,
  ubicacionUsuario = null,
  radioCirculo = 1000 // metros
}) {
  const { BaseLayer } = LayersControl;

  return (
    <div style={{ height: altura, width: '100%', position: 'relative' }}>
      <MapContainer
        center={centro}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        {/* 🎨 Control de capas (Mapa / Satélite) */}
        <LayersControl position="topright">
          {/* Mapa base profesional */}
          <BaseLayer checked name="Mapa claro">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
          </BaseLayer>

          {/* Alternativa: Mapa con relieve */}
          <BaseLayer name="Mapa con relieve">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </BaseLayer>

          {/* Vista satélite */}
          <BaseLayer name="Vista satélite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </BaseLayer>
        </LayersControl>

        {/* Centrar mapa si hay sitio seleccionado */}
        {sitioSeleccionado && (
          <CentrarMapa 
            centro={[sitioSeleccionado.latitud, sitioSeleccionado.longitud]} 
            zoom={15} 
          />
        )}

        {/* Botón de geolocalización */}
        {mostrarGeolocalizar && <BotonGeolocalizar />}

        {/* Control fullscreen */}
        <FullscreenControl />

        {/* Marcador y círculo de ubicación del usuario */}
        {ubicacionUsuario && (
          <>
            {/* Círculo de radio de búsqueda */}
            <Circle
              center={ubicacionUsuario}
              radius={radioCirculo}
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.15,
                weight: 2,
                dashArray: '5, 10'
              }}
            />

            {/* Círculo de precisión (más pequeño, sólido) */}
            <Circle
              center={ubicacionUsuario}
              radius={50} // 50 metros de precisión aproximada
              pathOptions={{
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.3,
                weight: 1
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
                  <p className="font-bold text-blue-600">Estás aquí</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Lat: {ubicacionUsuario[0].toFixed(6)}<br/>
                    Lng: {ubicacionUsuario[1].toFixed(6)}
                  </p>
                  <div className="mt-2 pt-2 border-t">
                    <p className="text-xs text-blue-700">
                      📏 Radio de búsqueda: {radioCirculo}m
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* 🎨 Marcadores con Clustering */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          maxClusterRadius={50}
        >
          {sitios.map((sitio) => (
            <Marker
              key={sitio.id}
              position={[sitio.latitud, sitio.longitud]}
              icon={crearIconoConFoto(
                sitio.imagenPrincipal,
                sitio.categoria.color,
                sitio.tipoSitio
              )}
              customData={{ tipoSitio: sitio.tipoSitio }}
            >
              <Popup maxWidth={320} className="custom-popup">
                <PopupMejorado 
                  sitio={sitio} 
                  tipo={sitio.tipoSitio}
                />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}