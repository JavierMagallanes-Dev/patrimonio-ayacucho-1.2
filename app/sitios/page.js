'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import SitioGrid from '@/components/sitios/SitioGrid';
import Loader from '@/components/ui/Loader';
import { Filter } from 'lucide-react';

export default function SitiosPage() {
  const [sitios, setSitios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    cargarDatos();
  }, [filtroCategoria]);

  async function cargarDatos() {
    setLoading(true);
    try {
      // Cargar categorías de patrimonio
      const resCategorias = await fetch('/api/categorias?tipo=patrimonio');
      const dataCategorias = await resCategorias.json();
      setCategorias(dataCategorias);

      // Cargar sitios
      let url = '/api/sitios?tipo=patrimonio';
      if (filtroCategoria) {
        url += `&categoria=${filtroCategoria}`;
      }

      const resSitios = await fetch(url);
      const dataSitios = await resSitios.json();
      setSitios(dataSitios);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4">
        Inicio / Sitios Patrimoniales
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Patrimonio Cultural de Ayacucho</h1>
        <p className="text-gray-600 text-lg">
          Descubre los sitios históricos, iglesias coloniales, museos y espacios patrimoniales de Huamanga
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-amber-700" />
          <h3 className="font-semibold">Filtrar por categoría</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroCategoria('')}
            className={`px-4 py-2 rounded-full transition ${
              filtroCategoria === '' 
                ? 'bg-amber-700 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFiltroCategoria(cat.id)}
              className={`px-4 py-2 rounded-full transition ${
                filtroCategoria === cat.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: filtroCategoria === cat.id ? cat.color : undefined
              }}
            >
              {cat.nombre} ({cat._count.sitios})
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <div className="mb-6">
        <p className="text-gray-600">
          Mostrando <span className="font-semibold">{sitios.length}</span> sitios patrimoniales
        </p>
      </div>

      {/* Grid de sitios */}
      <SitioGrid sitios={sitios} />
    </div>
  );
}