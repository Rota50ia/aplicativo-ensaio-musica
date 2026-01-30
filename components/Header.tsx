
import React from 'react';
import { SongChart } from '../types';

interface HeaderProps {
  chart: SongChart;
  onUpdate: (key: keyof Omit<SongChart, 'sections' | 'id'>, value: string | number) => void;
}

const Header: React.FC<HeaderProps> = ({ chart, onUpdate }) => {
  // Alterado text-black para text-slate-500 conforme solicitado ("letras em cinza")
  const inputBaseClass = "w-full bg-slate-100 text-slate-500 font-handwritten p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border-none";
  const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block px-1";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Coluna Esquerda: Título e Artista */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <label className={labelClass}>Nome da Música</label>
          <input 
            className={`${inputBaseClass} text-xl font-bold`}
            value={chart.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            placeholder="Exemplo de Música"
          />
        </div>
        <div>
          <label className={labelClass}>Banda / Artista</label>
          <input 
            className={`${inputBaseClass} text-base`}
            value={chart.artist}
            onChange={(e) => onUpdate('artist', e.target.value)}
            placeholder="Sua Banda"
          />
        </div>
      </div>

      {/* Coluna Direita: Metadados Técnicos */}
      <div className="lg:col-span-6 grid grid-cols-2 gap-4 h-fit">
        <div>
          <label className={labelClass}>Fórmula Compasso</label>
          <div className="relative">
            <select 
              className={`${inputBaseClass} text-base appearance-none cursor-pointer`}
              value={chart.timeSignature}
              onChange={(e) => onUpdate('timeSignature', e.target.value)}
            >
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="2/4">2/4</option>
              <option value="6/8">6/8</option>
              <option value="12/8">12/8</option>
              <option value="5/4">5/4</option>
              <option value="7/8">7/8</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">▼</div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Tempo (BPM)</label>
          <input 
            type="number"
            className={`${inputBaseClass} text-base`}
            value={chart.tempo}
            onChange={(e) => onUpdate('tempo', parseInt(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className={labelClass}>Feel / Levada</label>
          <input 
            className={`${inputBaseClass} text-base uppercase`}
            value={chart.feel}
            onChange={(e) => onUpdate('feel', e.target.value)}
            placeholder="STRAIGHT"
          />
        </div>

        <div>
          <label className={labelClass}>Gênero</label>
          <input 
            className={`${inputBaseClass} text-base`}
            value={chart.genre}
            onChange={(e) => onUpdate('genre', e.target.value)}
            placeholder="Rock"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
