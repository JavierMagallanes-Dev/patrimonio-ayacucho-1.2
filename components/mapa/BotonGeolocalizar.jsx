'use client';

import { useMap } from 'react-leaflet';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function BotonGeolocalizar() {
  const map = useMap();
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);

  const geolocalizarUsuario = () => {
    setBuscando(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      setBuscando(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        
        // Centrar mapa en ubicación real
        map.setView([latitude, longitude], 16);
        
        // Mostrar precisión al usuario
        console.log(`📍 Ubicación obtenida con precisión de ${Math.round(accuracy)}m`);
        
        setBuscando(false);
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        
        let mensajeError = 'No se pudo obtener tu ubicación';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensajeError = 'Permiso denegado. Activa la ubicación en tu navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            mensajeError = 'Ubicación no disponible. Verifica tu GPS.';
            break;
          case error.TIMEOUT:
            mensajeError = 'Tiempo agotado. Intenta de nuevo.';
            break;
        }
        
        setError(mensajeError);
        setBuscando(false);
        
        // Ocultar error después de 5 segundos
        setTimeout(() => setError(null), 5000);
      },
      {
        enableHighAccuracy: true, // Usar GPS de alta precisión
        timeout: 10000, // 10 segundos máximo
        maximumAge: 0 // No usar caché
      }
    );
  };

  return (
    <div className="absolute bottom-24 right-4 z-[1000]">
      <button
        onClick={geolocalizarUsuario}
        disabled={buscando}
        className={`p-3 rounded-full shadow-lg transition ${
          buscando 
            ? 'bg-gray-100 cursor-not-allowed' 
            : error
            ? 'bg-red-100 hover:bg-red-200'
            : 'bg-white hover:bg-gray-50'
        }`}
        title={error || "Mi ubicación"}
      >
        {buscando ? (
          <Loader2 className="animate-spin text-amber-700" size={24} />
        ) : error ? (
          <AlertCircle className="text-red-600" size={24} />
        ) : (
          <MapPin className="text-amber-700" size={24} />
        )}
      </button>
      
      {/* Tooltip de error */}
      {error && (
        <div className="absolute bottom-14 right-0 bg-red-100 text-red-700 text-xs p-2 rounded shadow-lg whitespace-nowrap max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}