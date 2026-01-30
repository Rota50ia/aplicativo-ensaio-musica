
import React from 'react';
import { SongChart } from '../types';

interface HeaderProps {
  chart: SongChart;
  onUpdate: (key: keyof Omit<SongChart, 'sections' | 'id'>, value: string | number) => void;
}

const Header: React.FC<HeaderProps> = ({ chart, onUpdate }) => {
  const inputBaseClass = "w-full bg-slate-100 text-slate-500 font-handwritten px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-none text-sm";
  const labelClass = "text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1 block px-1";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3 border-b border-slate-100 pb-6">
      {/* Nome da Música */}
      <div className="col-span-2">
        <label className={labelClass}>Nome da Música</label>
        <input 
          className={`${inputBaseClass} text-lg font-bold py-1`}
          value={chart.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="Nome da Música"
        />
      </div>

      {/* Artista */}
      <div className="col-span-2">
        <label className={labelClass}>Banda / Artista</label>
        <input 
          className={`${inputBaseClass} text-base py-1`}
          value={chart.artist}
          onChange={(e) => onUpdate('artist', e.target.value)}
          placeholder="Nome do Artista"
        />
      </div>

      {/* Fórmula de Compasso */}
      <div className="col-span-1">
        <label className={labelClass}>Fórmula Compasso</label>
        <div className="relative">
          <select 
            className={`${inputBaseClass} appearance-none cursor-pointer`}
            value={chart.timeSignature}
            onChange={(e) => onUpdate('timeSignature', e.target.value)}
          >
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="2/4">2/4</option>
            <option value="6/8">6/8</option>
            <option value="12/8">12/8</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-[10px]">▼</div>
        </div>
      </div>

      {/* Tempo */}
      <div className="col-span-1">
        <label className={labelClass}>Tempo (BPM)</label>
        <input 
          type="number"
          className={inputBaseClass}
          value={chart.tempo}
          onChange={(e) => onUpdate('tempo', parseInt(e.target.value) || 0)}
        />
      </div>

      {/* Feel */}
      <div className="col-span-1">
        <label className={labelClass}>Feel / Levada</label>
        <input 
          className={`${inputBaseClass} uppercase`}
          value={chart.feel}
          onChange={(e) => onUpdate('feel', e.target.value)}
          placeholder="GROOVE"
        />
      </div>

      {/* Gênero */}
      <div className="col-span-1">
        <label className={labelClass}>Gênero</label>
        <input 
          className={inputBaseClass}
          value={chart.genre}
          onChange={(e) => onUpdate('genre', e.target.value)}
          placeholder="Gênero"
        />
      </div>
    </div>
  );
};

export default Header;
