
import React from 'react';
import { ChartSection, SectionType } from '../types';
import { Trash2, ChevronLeft, ChevronRight, Copy, Music2, GripVertical } from 'lucide-react';

interface SectionCardProps {
  section: ChartSection;
  onUpdate: (updates: Partial<ChartSection>) => void;
  onRemove: () => void;
  onMove?: (direction: 'left' | 'right') => void;
  onDuplicate?: () => void;
}

const SECTION_COLORS: Record<SectionType, string> = {
  [SectionType.INTRO]: 'border-t-slate-400 bg-slate-50/50',
  [SectionType.INTRO_2]: 'border-t-slate-400 bg-slate-50/50',
  [SectionType.INTRO_3]: 'border-t-slate-400 bg-slate-50/50',
  [SectionType.INTRO_4]: 'border-t-slate-400 bg-slate-50/50',
  [SectionType.VERSO_1]: 'border-t-blue-500 bg-blue-50/30',
  [SectionType.VERSO_2]: 'border-t-blue-500 bg-blue-50/30',
  [SectionType.VERSO_3]: 'border-t-blue-500 bg-blue-50/30',
  [SectionType.VERSO_4]: 'border-t-blue-500 bg-blue-50/30',
  [SectionType.PRE_REFRÃO]: 'border-t-amber-400 bg-amber-50/30',
  [SectionType.REFRÃO]: 'border-t-red-500 bg-red-50/30',
  [SectionType.POS_REFRÃO]: 'border-t-orange-400 bg-orange-50/30',
  [SectionType.PONTE]: 'border-t-emerald-500 bg-emerald-50/30',
  [SectionType.INTERLUDIO]: 'border-t-indigo-400 bg-indigo-50/30',
  [SectionType.REFRÃO_FINAL]: 'border-t-rose-600 bg-rose-50/30',
  [SectionType.OUTRO_FINAL]: 'border-t-slate-800 bg-slate-200/50',
  [SectionType.CUSTOM]: 'border-t-purple-400 bg-purple-50/30',
};

const SectionCard: React.FC<SectionCardProps> = ({ section, onUpdate, onRemove, onMove, onDuplicate }) => {
  const colorClass = SECTION_COLORS[section.type] || 'border-t-slate-200';

  return (
    <div className={`group relative flex flex-col border border-slate-200 border-t-4 rounded-lg shadow-sm hover:shadow-md transition-all min-h-[19rem] bg-white overflow-hidden ${colorClass}`}>
      {/* Header do Card */}
      <div className="flex-none p-2 border-b border-slate-100 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 flex-1">
           <div className="no-print cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-colors" title="Arraste para reordenar">
             <GripVertical size={16} />
           </div>
           <select 
              className="bg-transparent font-handwritten font-bold text-sm uppercase tracking-wider outline-none cursor-pointer hover:text-blue-600 transition-colors flex-1"
              value={section.type}
              onChange={(e) => onUpdate({ type: e.target.value as SectionType })}
            >
              {Object.values(SectionType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
        </div>

        <div className="flex items-center gap-1 no-print opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={onDuplicate}
            title="Duplicar"
            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600"
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={onRemove}
            title="Remover"
            className="p-1 hover:bg-red-100 rounded text-slate-400 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Nome Customizado */}
      {section.type === SectionType.CUSTOM && (
        <div className="px-2 pt-1">
          <input 
            className="w-full text-[10px] font-bold uppercase bg-slate-100 rounded px-1 outline-none text-black border border-transparent focus:border-slate-300"
            value={section.customLabel || ''}
            onChange={(e) => onUpdate({ customLabel: e.target.value })}
            placeholder="NOME DA SEÇÃO"
          />
        </div>
      )}

      {/* Espaço para Harmonia */}
      <div className="flex-none p-2 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2 mb-1 opacity-60">
          <Music2 size={10} className="text-blue-600" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Harmonia</span>
        </div>
        
        <div className="relative rounded bg-slate-100 overflow-hidden shadow-inner border border-slate-200/50">
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px)',
              backgroundSize: '100% 1rem',
              marginTop: '0.4rem'
            }}
          />
          <textarea 
            className="relative w-full h-16 bg-transparent resize-none outline-none font-mono text-xs font-bold text-black leading-[1rem] placeholder:text-slate-400 p-1.5 z-10"
            value={section.notation || ''}
            onChange={(e) => onUpdate({ notation: e.target.value })}
            placeholder="[Am7 | D7]"
            rows={3}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Corpo: Número de Compassos (Reduzido em 30% no espaço vertical) */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-2 bg-white">
        <div className="flex items-center">
          <button 
            onClick={() => onUpdate({ measures: Math.max(1, section.measures - 1) })}
            className="no-print opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-full text-slate-300 hover:text-slate-600 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          
          <input 
            type="number"
            className="w-16 text-center font-handwritten text-4xl font-bold bg-transparent outline-none focus:scale-110 transition-transform appearance-none text-black"
            value={section.measures}
            onChange={(e) => onUpdate({ measures: parseInt(e.target.value) || 1 })}
          />

          <button 
            onClick={() => onUpdate({ measures: section.measures + 1 })}
            className="no-print opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-100 rounded-full text-slate-300 hover:text-slate-600 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer: Dicas / Deixas */}
      <div className="flex-none p-2 bg-slate-100 border-t border-slate-200 min-h-[50px]">
        <textarea 
          className="w-full h-full bg-transparent resize-none outline-none font-handwritten text-[13px] font-bold text-black leading-tight placeholder:text-slate-400 italic"
          value={section.cues}
          onChange={(e) => onUpdate({ cues: e.target.value })}
          placeholder="Dicas ou deixas..."
          rows={2}
        />
      </div>

      <div className="no-print absolute bottom-0 left-0 right-0 flex justify-between px-1 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">
         {onMove && (
           <>
             <button onClick={() => onMove('left')} className="p-1 hover:bg-slate-200 rounded text-slate-400" title="Mover para esquerda"><ChevronLeft size={12}/></button>
             <button onClick={() => onMove('right')} className="p-1 hover:bg-slate-200 rounded text-slate-400" title="Mover para direita"><ChevronRight size={12}/></button>
           </>
         )}
      </div>
    </div>
  );
};

export default SectionCard;
