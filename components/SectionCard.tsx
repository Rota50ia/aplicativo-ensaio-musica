
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
    <div className={`group relative flex flex-col border border-slate-200 border-t-[3px] rounded-md shadow-sm transition-all min-h-[12rem] bg-white overflow-hidden ${colorClass}`}>
      {/* Header do Card */}
      <div className="flex-none px-2 py-1 border-b border-slate-100 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 flex-1">
           <div className="no-print cursor-grab active:cursor-grabbing p-0.5 text-slate-300 hover:text-slate-500 transition-colors">
             <GripVertical size={12} />
           </div>
           <select 
              className="bg-transparent font-bold text-[11px] uppercase tracking-tighter outline-none cursor-pointer hover:text-blue-600 transition-colors flex-1 appearance-none"
              value={section.type}
              onChange={(e) => onUpdate({ type: e.target.value as SectionType })}
            >
              {Object.values(SectionType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
        </div>

        <div className="flex items-center gap-1 no-print opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onDuplicate} title="Duplicar" className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
            <Copy size={12} />
          </button>
          <button onClick={onRemove} title="Remover" className="p-0.5 hover:bg-red-100 rounded text-slate-400 hover:text-red-600">
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Espaço para Harmonia */}
      <div className="flex-none p-1.5 border-b border-slate-50 bg-white">
        <div className="flex items-center gap-1.5 mb-0.5 opacity-60">
          <Music2 size={8} className="text-blue-600" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Harmonia</span>
        </div>
        
        <div className="relative rounded-sm bg-slate-50 overflow-hidden border border-slate-100/50">
          <textarea 
            className="relative w-full h-8 bg-transparent resize-none outline-none font-mono text-[10px] font-bold text-slate-700 leading-tight placeholder:text-slate-300 px-1 py-0.5 z-10"
            value={section.notation || ''}
            onChange={(e) => onUpdate({ notation: e.target.value })}
            placeholder="[Am7 | D7]"
            rows={2}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Corpo: Número de Compassos (Somente setas conforme solicitado) */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-1 bg-white">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onUpdate({ measures: Math.max(1, section.measures - 1) })}
            className="no-print p-1 hover:bg-slate-100 rounded-full text-slate-300 hover:text-blue-600 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="min-w-[2rem] text-center font-handwritten text-4xl font-bold text-slate-900 select-none">
            {section.measures}
          </div>

          <button 
            onClick={() => onUpdate({ measures: section.measures + 1 })}
            className="no-print p-1 hover:bg-slate-100 rounded-full text-slate-300 hover:text-blue-600 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer: Dicas / Deixas */}
      <div className="flex-none px-2 py-1 bg-slate-50 border-t border-slate-100 min-h-[36px]">
        <textarea 
          className="w-full h-full bg-transparent resize-none outline-none font-handwritten text-[11px] font-bold text-slate-600 leading-none placeholder:text-slate-300 italic"
          value={section.cues}
          onChange={(e) => onUpdate({ cues: e.target.value })}
          placeholder="Deixas..."
          rows={2}
        />
      </div>

      <div className="no-print absolute bottom-0 left-0 right-0 flex justify-between px-1 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
         {onMove && (
           <div className="flex justify-between w-full pointer-events-auto">
             <button onClick={() => onMove('left')} className="p-0.5 hover:bg-slate-200 rounded text-slate-400"><ChevronLeft size={10}/></button>
             <button onClick={() => onMove('right')} className="p-0.5 hover:bg-slate-200 rounded text-slate-400"><ChevronRight size={10}/></button>
           </div>
         )}
      </div>
    </div>
  );
};

export default SectionCard;
