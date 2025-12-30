'use client';

import { useEffect, useState } from 'react';
import ServicioCard from '@/components/servicios/ServicioCard';
import Loader from '@/components/ui/Loader';
import { Filter } from 'lucide-react';

export default function ServiciosPage() {
  const [servicios, setServicios] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [filtroCategoria]);

  async function cargarDatos() {
    setLoading(true);
    try {
      // Cargar categorías de servicios
      const resCategorias = await fetch('/api/categorias?tipo=servicio');
      const dataCategorias = await resCategorias.json();
      setCategorias(dataCategorias);

      // Cargar servicios
      let url = '/api/sitios?tipo=servicio';
      if (filtroCategoria) {
        url += `&categoria=${filtroCategoria}`;
      }

      const resServicios = await fetch(url);
      const dataServicios = await resServicios.json();
      setServicios(dataServicios);
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
        Inicio / Servicios Turísticos
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Servicios Turísticos</h1>
        <p className="text-gray-600 text-lg">
          Encuentra hoteles, restaurantes, cafeterías y más servicios para tu visita a Ayacucho
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-blue-600" />
          <h3 className="font-semibold">Filtrar por tipo</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroCategoria('')}
            className={`px-4 py-2 rounded-full transition ${
              filtroCategoria === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
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
          Mostrando <span className="font-semibold">{servicios.length}</span> servicios
        </p>
      </div>

      {/* Grid de servicios */}
      {servicios.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No se encontraron servicios</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servicios.map((servicio) => (
            <ServicioCard key={servicio.id} servicio={servicio} />
          ))}
        </div>
      )}
    </div>
  );
}