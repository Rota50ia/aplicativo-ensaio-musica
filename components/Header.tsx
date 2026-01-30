
import React from 'react';
import { SongChart } from '../types';

interface HeaderProps {
  chart: SongChart;
  onUpdate: (key: keyof Omit<SongChart, 'sections' | 'id'>, value: string | number) => void;
}

const Header: React.FC<HeaderProps> = ({ chart, onUpdate }) => {
  const inputBaseClass = "w-full bg-slate-50 text-slate-600 font-handwritten px-2 py-1 rounded outline-none focus:ring-1 focus:ring-blue-500/20 transition-all border border-transparent hover:border-slate-200 text-xs";
  const labelClass = "text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-0.5 block px-0.5";

  return (
    <div className="grid grid-cols-2 md:grid-cols-12 gap-2 border-b border-slate-100 pb-3 mb-2">
      {/* Nome da Música */}
      <div className="col-span-2 md:col-span-4">
        <label className={labelClass}>Música</label>
        <input 
          className={`${inputBaseClass} text-sm font-bold`}
          value={chart.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="Nome da Música"
        />
      </div>

      {/* Artista */}
      <div className="col-span-2 md:col-span-3">
        <label className={labelClass}>Artista</label>
        <input 
          className={inputBaseClass}
          value={chart.artist}
          onChange={(e) => onUpdate('artist', e.target.value)}
          placeholder="Nome do Artista"
        />
      </div>

      {/* Fórmula de Compasso */}
      <div className="col-span-1 md:col-span-1">
        <label className={labelClass}>Compasso</label>
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
      </div>

      {/* Tempo */}
      <div className="col-span-1 md:col-span-1">
        <label className={labelClass}>BPM</label>
        <input 
          type="number"
          className={inputBaseClass}
          value={chart.tempo}
          onChange={(e) => onUpdate('tempo', parseInt(e.target.value) || 0)}
        />
      </div>

      {/* Feel */}
      <div className="col-span-1 md:col-span-1">
        <label className={labelClass}>Feel</label>
        <input 
          className={`${inputBaseClass} uppercase`}
          value={chart.feel}
          onChange={(e) => onUpdate('feel', e.target.value)}
          placeholder="GROOVE"
        />
      </div>

      {/* Gênero */}
      <div className="col-span-1 md:col-span-2">
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
