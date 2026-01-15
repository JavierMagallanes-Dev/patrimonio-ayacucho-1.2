'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MapaWrapper from '@/components/mapa/MapaWrapper';
import FiltrosCapas from '@/components/mapa/FiltrosCapas';
import Loader from '@/components/ui/Loader';
import { MapPin, List, Navigation, X, Radius } from 'lucide-react';

export default function MapaPage() {
  const [sitios, setSitios] = useState([]);
  const [sitiosFiltrados, setSitiosFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [capas, setCapas] = useState({
    patrimonio: true,
    servicios: true,
    emergencias: false
  });

  const [mostrarLista, setMostrarLista] = useState(false);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);
  const [buscandoCercanos, setBuscandoCercanos] = useState(false);
  const [sitiosCercanos, setSitiosCercanos] = useState([]);
  const [mostrarCercanos, setMostrarCercanos] = useState(false);
  
  // 🆕 Estado para el radio del círculo
  const [radioCirculo, setRadioCirculo] = useState(1000); // metros

  useEffect(() => {
    cargarTodosSitios();
  }, []);

  useEffect(() => {
    filtrarSitios();
  }, [capas, sitios]);

  async function cargarTodosSitios() {
    setLoading(true);
    try {
      const [resPatrimonio, resServicios, resEmergencias] = await Promise.all([
        fetch('/api/sitios?tipo=patrimonio'),
        fetch('/api/sitios?tipo=servicio'),
        fetch('/api/sitios?tipo=emergencia')
      ]);

      const [patrimonio, servicios, emergencias] = await Promise.all([
        resPatrimonio.json(),
        resServicios.json(),
        resEmergencias.json()
      ]);

      setSitios([...patrimonio, ...servicios, ...emergencias]);
    } catch (error) {
      console.error('Error al cargar sitios:', error);
    } finally {
      setLoading(false);
    }
  }

  function filtrarSitios() {
    const filtrados = sitios.filter((sitio) => {
      if (sitio.tipoSitio === 'patrimonio' && capas.patrimonio) return true;
      if (sitio.tipoSitio === 'servicio' && capas.servicios) return true;
      if (sitio.tipoSitio === 'emergencia' && capas.emergencias) return true;
      return false;
    });

    setSitiosFiltrados(filtrados);
  }

  async function buscarSitiosCercanos() {
    setBuscandoCercanos(true);

    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      setBuscandoCercanos(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // ✅ FIX: Guardar ubicación ANTES de hacer fetch
        const ubicacion = [latitude, longitude];
        setUbicacionUsuario(ubicacion);

        try {
          const radioKm = radioCirculo / 1000;
          const res = await fetch(
            `/api/sitios/cercanos?lat=${latitude}&lng=${longitude}&radio=${radioKm}`
          );
          const data = await res.json();

          setSitiosCercanos(data);
          setMostrarCercanos(true);
        } catch (error) {
          console.error('Error al buscar sitios cercanos:', error);
          alert('Error al buscar sitios cercanos');
        } finally {
          setBuscandoCercanos(false);
        }
      },
      (error) => {
        console.error('Error de geolocalización:', error);
        
        // ✅ Mensajes más específicos
        let mensaje = 'No se pudo obtener tu ubicación';
        if (error.code === error.PERMISSION_DENIED) {
          mensaje = 'Permiso de ubicación denegado. Por favor, activa la geolocalización en tu navegador.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          mensaje = 'Ubicación no disponible. Verifica tu conexión GPS.';
        } else if (error.code === error.TIMEOUT) {
          mensaje = 'Tiempo de espera agotado. Intenta de nuevo.';
        }
        
        alert(mensaje);
        setBuscandoCercanos(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="relative">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <MapPin size={32} />
                Mapa Interactivo de Ayacucho
              </h1>
              <p className="text-amber-100">
                Explora {sitiosFiltrados.length} puntos de interés
              </p>
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* 🆕 Control de radio */}
              <div className="bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
                <Radius size={20} className="text-amber-700" />
                <span className="text-sm font-medium">Radio:</span>
                <select 
                  value={radioCirculo}
                  onChange={(e) => setRadioCirculo(Number(e.target.value))}
                  className="border-none bg-transparent font-semibold text-amber-700 cursor-pointer"
                >
                  <option value={500}>500m</option>
                  <option value={1000}>1km</option>
                  <option value={2000}>2km</option>
                  <option value={5000}>5km</option>
                </select>
              </div>

              <button
                onClick={buscarSitiosCercanos}
                disabled={buscandoCercanos}
                className="bg-white text-amber-700 px-4 py-2 rounded-lg font-semibold hover:bg-amber-50 transition flex items-center gap-2 disabled:opacity-50"
              >
                <Navigation size={20} />
                {buscandoCercanos ? 'Buscando...' : 'Cerca de mí'}
              </button>

              <button
                onClick={() => setMostrarLista(!mostrarLista)}
                className="lg:hidden bg-white text-amber-700 px-4 py-2 rounded-lg font-semibold hover:bg-amber-50 transition flex items-center gap-2"
              >
                <List size={20} />
                Lista
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAPA */}
      <div className="relative" style={{ height: 'calc(100vh - 180px)' }}>
        <FiltrosCapas capas={capas} onChange={setCapas} />

        {/* PANEL DE CERCANOS */}
        {mostrarCercanos && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl z-[1000] max-w-sm max-h-96 overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100">
              <div>
                <h3 className="font-bold text-gray-900">
                  📍 Sitios cerca de ti
                </h3>
                <p className="text-xs text-gray-600">
                  Radio de {radioCirculo}m ({sitiosCercanos.length} resultados)
                </p>
              </div>
              <button 
                onClick={() => setMostrarCercanos(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="divide-y">
              {sitiosCercanos.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No hay sitios en este radio</p>
                  <p className="text-xs mt-1">Intenta aumentar el radio de búsqueda</p>
                </div>
              ) : (
                sitiosCercanos.map(({ sitio, distanciaKm, distanciaMetros }) => (
                  <Link
                    key={sitio.id}
                    href={`/${
                      sitio.tipoSitio === 'servicio' ? 'servicios' : 'sitios'
                    }/${sitio.slug}`}
                    className="block p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex gap-3">
                      <img
                        src={sitio.imagenPrincipal}
                        alt={sitio.nombre}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {sitio.nombre}
                        </h4>
                        <p 
                          className="text-xs px-2 py-0.5 rounded inline-block text-white mt-1"
                          style={{ backgroundColor: sitio.categoria.color }}
                        >
                          {sitio.categoria.nombre}
                        </p>
                        <p className="text-xs text-amber-700 font-semibold mt-1">
                          📍{' '}
                          {distanciaKm < 1
                            ? `${distanciaMetros} m`
                            : `${distanciaKm} km`}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* MAPA */}
        <MapaWrapper
          sitios={sitiosFiltrados}
          altura="100%"
          ubicacionUsuario={ubicacionUsuario}
          radioCirculo={radioCirculo}
        />
      </div>
    </div>
  );
}