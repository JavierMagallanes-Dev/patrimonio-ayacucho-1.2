'use client';

import { Church, Building2, Shield } from 'lucide-react';

export default function FiltrosCapas({ capas, onChange }) {
  const handleChange = (capa) => {
    onChange({
      ...capas,
      [capa]: !capas[capa]
    });
  };

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
      <h3 className="font-bold mb-3 text-gray-900">Mostrar en el mapa</h3>
      
      <div className="space-y-2">
        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
          <input
            type="checkbox"
            checked={capas.patrimonio}
            onChange={() => handleChange('patrimonio')}
            className="w-4 h-4"
          />
          <Church size={18} className="text-amber-700" />
          <span className="text-sm">Patrimonio Cultural</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
          <input
            type="checkbox"
            checked={capas.servicios}
            onChange={() => handleChange('servicios')}
            className="w-4 h-4"
          />
          <Building2 size={18} className="text-blue-600" />
          <span className="text-sm">Servicios Turísticos</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition">
          <input
            type="checkbox"
            checked={capas.emergencias}
            onChange={() => handleChange('emergencias')}
            className="w-4 h-4"
          />
          <Shield size={18} className="text-red-600" />
          <span className="text-sm">Emergencias</span>
        </label>
      </div>

      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p>Total: {
          (capas.patrimonio ? 1 : 0) + 
          (capas.servicios ? 1 : 0) + 
          (capas.emergencias ? 1 : 0)
        } capas activas</p>
      </div>
    </div>
  );
}