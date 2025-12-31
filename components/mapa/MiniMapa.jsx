'use client';

import dynamic from 'next/dynamic';
import Loader from '../ui/Loader';

const MapaInteractivo = dynamic(
  () => import('./MapaInteractivo'),
  { 
    ssr: false,
    loading: () => <Loader />
  }
);

export default function MiniMapa({ sitio }) {
  return (
    <MapaInteractivo
      sitios={[sitio]}
      centro={[sitio.latitud, sitio.longitud]}
      zoom={15}
      altura="300px"
      mostrarGeolocalizar={false}
    />
  );
}