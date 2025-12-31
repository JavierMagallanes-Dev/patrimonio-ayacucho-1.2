'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BuscadorGlobal() {
  const [query, setQuery] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [indiceSugerencia, setIndiceSugerencia] = useState(-1);

  const queryDebounced = useDebounce(query, 300);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (queryDebounced.length >= 2) {
      buscarSugerencias(queryDebounced);
    } else {
      setSugerencias([]);
      setMostrar(false);
    }
  }, [queryDebounced]);

  async function buscarSugerencias(q) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/sitios/buscar?q=${encodeURIComponent(q)}&limite=5`
      );
      const data = await res.json();
      setSugerencias(data);
      setMostrar(data.length > 0);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setSugerencias([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
      setMostrar(false);
      inputRef.current?.blur();
    }
  }

  function handleKeyDown(e) {
    if (!mostrar || sugerencias.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndiceSugerencia((prev) =>
        prev < sugerencias.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndiceSugerencia((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && indiceSugerencia >= 0) {
      e.preventDefault();
      const sitio = sugerencias[indiceSugerencia];
      router.push(
        `/${sitio.tipoSitio === 'servicio' ? 'servicios' : 'sitios'}/${sitio.slug}`
      );
      setMostrar(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setMostrar(false);
      inputRef.current?.blur();
    }
  }

  function limpiar() {
    setQuery('');
    setSugerencias([]);
    setMostrar(false);
    setIndiceSugerencia(-1);
    inputRef.current?.focus();
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            ref={inputRef}
            type="search"
            placeholder="Buscar sitios, servicios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (sugerencias.length > 0) setMostrar(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />

          {query && (
            <button
              type="button"
              onClick={limpiar}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown de sugerencias */}
      {mostrar && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMostrar(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-xl rounded-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin mx-auto w-6 h-6 border-2 border-amber-700 border-t-transparent rounded-full"></div>
              </div>
            ) : sugerencias.length > 0 ? (
              <>
                {sugerencias.map((sitio, idx) => (
                  <Link
                    key={sitio.id}
                    href={`/${
                      sitio.tipoSitio === 'servicio'
                        ? 'servicios'
                        : 'sitios'
                    }/${sitio.slug}`}
                    onClick={() => {
                      setMostrar(false);
                      setQuery('');
                    }}
                    className={`block p-3 hover:bg-gray-50 transition border-b last:border-b-0 ${
                      idx === indiceSugerencia ? 'bg-amber-50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={sitio.imagenPrincipal}
                        alt={sitio.nombre}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {sitio.nombre}
                        </h4>

                        <p
                          className="text-xs px-2 py-1 rounded inline-block text-white mt-1"
                          style={{ backgroundColor: sitio.categoria.color }}
                        >
                          {sitio.categoria.nombre}
                        </p>

                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <MapPin size={12} />
                          <span className="truncate">
                            {sitio.direccion}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* ✅ TEXTO CORREGIDO (SIN WARNING JSX) */}
                <button
                  onClick={() => {
                    router.push(
                      `/buscar?q=${encodeURIComponent(query)}`
                    );
                    setMostrar(false);
                  }}
                  className="w-full p-3 text-center text-amber-700 font-medium hover:bg-amber-50 transition border-t"
                >
                  Ver todos los resultados para{' '}
                  <strong>{query}</strong>
                </button>
              </>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No se encontraron resultados
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
