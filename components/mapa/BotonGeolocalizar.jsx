'use client';

import { useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
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
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 16);
        setBuscando(false);
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        setError('No se pudo obtener tu ubicación');
        setBuscando(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="absolute bottom-24 right-4 z-[1000]">
      <button
        onClick={geolocalizarUsuario}
        disabled={buscando}
        className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Mi ubicación"
      >
        {buscando ? (
          <div className="animate-spin w-6 h-6 border-2 border-amber-700 border-t-transparent rounded-full"></div>
        ) : (
          <MapPin size={24} className="text-amber-700" />
        )}
      </button>
      {error && (
        <div className="absolute bottom-14 right-0 bg-red-100 text-red-700 text-xs p-2 rounded shadow whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}