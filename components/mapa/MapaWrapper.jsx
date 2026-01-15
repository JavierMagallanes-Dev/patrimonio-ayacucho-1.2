'use client';

import dynamic from 'next/dynamic';
import Loader from '../ui/Loader';

const MapaInteractivo = dynamic(
  () => import('./MapaInteractivo'),
  { 
    ssr: false,
    loading: () => <Loader mensaje="Cargando mapa mejorado..." />
  }
);

export default MapaInteractivo;