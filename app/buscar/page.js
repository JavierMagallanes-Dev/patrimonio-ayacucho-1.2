'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

import SitioGrid from '@/components/sitios/SitioGrid';
import ServicioCard from '@/components/servicios/ServicioCard';
import RutaCard from '@/components/rutas/RutaCard';
import Loader from '@/components/ui/Loader';

import { Search } from 'lucide-react';

function BuscarContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [resultados, setResultados] = useState({
    sitios: [],
    servicios: [],
    rutas: []
  });

  const [loading, setLoading] = useState(true);
  const [tabActiva, setTabActiva] = useState('todos');

  useEffect(() => {
    if (query) {
      buscarTodo(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  async function buscarTodo(q) {
    setLoading(true);
    try {
      // Sitios patrimoniales
      const resSitios = await fetch(
        `/api/sitios/buscar?q=${encodeURIComponent(q)}&tipo=patrimonio`
      );
      const sitios = await resSitios.json();

      // Servicios
      const resServicios = await fetch(
        `/api/sitios/buscar?q=${encodeURIComponent(q)}&tipo=servicio`
      );
      const servicios = await resServicios.json();

      // Rutas
      const resRutas = await fetch('/api/rutas');
      const todasRutas = await resRutas.json();

      const rutas = todasRutas.filter(
        (ruta) =>
          ruta.nombre.toLowerCase().includes(q.toLowerCase()) ||
          ruta.descripcion.toLowerCase().includes(q.toLowerCase())
      );

      setResultados({ sitios, servicios, rutas });
    } catch (error) {
      console.error('Error en búsqueda:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalResultados =
    resultados.sitios.length +
    resultados.servicios.length +
    resultados.rutas.length;

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Search size={20} />
          <span className="text-sm">Resultados de búsqueda</span>
        </div>

        <h1 className="text-4xl font-bold mb-4">
          Búsqueda:{' '}
          <span className="text-amber-700">{query}</span>
        </h1>

        <p className="text-gray-600 text-lg">
          {totalResultados === 0
            ? 'No se encontraron resultados'
            : `Se encontraron ${totalResultados} resultados`}
        </p>
      </div>

      {/* SIN RESULTADOS */}
      {totalResultados === 0 ? (
        <div className="text-center py-20">
          <Search size={64} className="mx-auto text-gray-300 mb-4" />

          <p className="text-xl text-gray-600 mb-4">
            No se encontraron resultados para{' '}
            <strong className="text-gray-800">{query}</strong>
          </p>

          <p className="text-gray-500 mb-6">
            Intenta con otras palabras clave o explora nuestras categorías
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/sitios"
              className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
            >
              Explorar sitios
            </Link>

            <Link
              href="/servicios"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Ver servicios
            </Link>

            <Link
              href="/mapa"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Abrir mapa
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* TABS */}
          <div className="mb-8 border-b">
            <div className="flex gap-6 overflow-x-auto">
              <button
                onClick={() => setTabActiva('todos')}
                className={`pb-4 px-2 font-medium border-b-2 transition ${
                  tabActiva === 'todos'
                    ? 'border-amber-700 text-amber-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Todos ({totalResultados})
              </button>

              <button
                onClick={() => setTabActiva('sitios')}
                className={`pb-4 px-2 font-medium border-b-2 transition ${
                  tabActiva === 'sitios'
                    ? 'border-amber-700 text-amber-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Sitios ({resultados.sitios.length})
              </button>

              <button
                onClick={() => setTabActiva('servicios')}
                className={`pb-4 px-2 font-medium border-b-2 transition ${
                  tabActiva === 'servicios'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Servicios ({resultados.servicios.length})
              </button>

              <button
                onClick={() => setTabActiva('rutas')}
                className={`pb-4 px-2 font-medium border-b-2 transition ${
                  tabActiva === 'rutas'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Rutas ({resultados.rutas.length})
              </button>
            </div>
          </div>

          {/* RESULTADOS */}
          {(tabActiva === 'todos' || tabActiva === 'sitios') &&
            resultados.sitios.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  Sitios Patrimoniales
                </h2>
                <SitioGrid sitios={resultados.sitios} />
              </section>
            )}

          {(tabActiva === 'todos' || tabActiva === 'servicios') &&
            resultados.servicios.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  Servicios Turísticos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {resultados.servicios.map((servicio) => (
                    <ServicioCard
                      key={servicio.id}
                      servicio={servicio}
                    />
                  ))}
                </div>
              </section>
            )}

          {(tabActiva === 'todos' || tabActiva === 'rutas') &&
            resultados.rutas.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6">
                  Rutas Temáticas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resultados.rutas.map((ruta) => (
                    <RutaCard key={ruta.id} ruta={ruta} />
                  ))}
                </div>
              </section>
            )}
        </>
      )}
    </div>
  );
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<Loader />}>
      <BuscarContent />
    </Suspense>
  );
}
