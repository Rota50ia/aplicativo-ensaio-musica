
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
  [SectionType.CUSTOM]: 'border-t-purple-500 bg-purple-50/30',
};

const SectionCard: React.FC<SectionCardProps> = ({ section, onUpdate, onRemove, onMove, onDuplicate }) => {
  const colorClass = SECTION_COLORS[section.type] || 'border-t-slate-200';
  const isCustom = section.type === SectionType.CUSTOM;

  return (
    <div className={`group relative flex flex-col border border-slate-200 border-t-[2px] rounded shadow-sm transition-all min-h-[9rem] bg-white overflow-hidden ${colorClass}`}>
      {/* Header do Card */}
      <div className="flex-none px-1.5 py-0.5 border-b border-slate-100 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1 flex-1 overflow-hidden">
           <div className="no-print cursor-grab active:cursor-grabbing p-0.5 text-slate-300 hover:text-slate-500 transition-colors shrink-0">
             <GripVertical size={10} />
           </div>
           
           <div className="flex flex-col flex-1 min-w-0">
             {isCustom ? (
               <div className="flex items-center gap-1 w-full">
                 <input 
                   className="bg-transparent font-bold text-[10px] uppercase tracking-tighter outline-none border-b border-purple-200 focus:border-purple-500 w-full placeholder:text-purple-200 placeholder:italic px-0.5 py-0"
                   value={section.customLabel || ''}
                   onChange={(e) => onUpdate({ customLabel: e.target.value })}
                   placeholder="NOME..."
                   autoFocus
                 />
                 <select 
                    className="w-4 bg-transparent text-slate-200 hover:text-blue-600 cursor-pointer appearance-none outline-none border-none text-[8px]"
                    value={section.type}
                    onChange={(e) => onUpdate({ type: e.target.value as SectionType })}
                  >
                    {Object.values(SectionType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
               </div>
             ) : (
               <select 
                  className="bg-transparent font-bold text-[10px] uppercase tracking-tighter outline-none cursor-pointer hover:text-blue-600 transition-colors w-full appearance-none truncate"
                  value={section.type}
                  onChange={(e) => onUpdate({ type: e.target.value as SectionType })}
                >
                  {Object.values(SectionType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
             )}
           </div>
        </div>

        <div className="flex items-center gap-0.5 no-print opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={onDuplicate} title="Duplicar" className="p-0.5 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
            <Copy size={10} />
          </button>
          <button onClick={onRemove} title="Remover" className="p-0.5 hover:bg-red-100 rounded text-slate-400 hover:text-red-600">
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Espaço para Harmonia */}
      <div className="flex-none p-1 border-b border-slate-50 bg-white">
        <div className="flex items-center gap-1 mb-0.5 opacity-60">
          <Music2 size={8} className="text-blue-600" />
          <span className="text-[7px] font-bold uppercase tracking-widest text-slate-500">Harmonia</span>
        </div>
        
        <div className="relative rounded-sm bg-slate-50 overflow-hidden border border-slate-100/30">
          <textarea 
            className="relative w-full h-7 bg-transparent resize-none outline-none font-mono text-xs font-bold text-slate-700 leading-tight placeholder:text-slate-300 px-1 py-1 z-10"
            value={section.notation || ''}
            onChange={(e) => onUpdate({ notation: e.target.value })}
            placeholder="[Am7 | D7]"
            rows={1}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Corpo: Número de Compassos */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-0.5 bg-white">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onUpdate({ measures: Math.max(1, section.measures - 1) })}
            className="no-print p-0.5 hover:bg-slate-100 rounded-full text-slate-200 hover:text-blue-600 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="min-w-[1.5rem] text-center font-handwritten text-3xl font-bold text-slate-900 select-none">
            {section.measures}
          </div>

          <button 
            onClick={() => onUpdate({ measures: section.measures + 1 })}
            className="no-print p-0.5 hover:bg-slate-100 rounded-full text-slate-200 hover:text-blue-600 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Footer: Dicas / Deixas */}
      <div className="flex-none px-1.5 py-0.5 bg-slate-50 border-t border-slate-100 min-h-[28px]">
        <textarea 
          className="w-full h-full bg-transparent resize-none outline-none font-handwritten text-[10px] font-bold text-slate-600 leading-none placeholder:text-slate-300 italic"
          value={section.cues}
          onChange={(e) => onUpdate({ cues: e.target.value })}
          placeholder="Deixas..."
          rows={2}
        />
      </div>

      <div className="no-print absolute bottom-0 left-0 right-0 flex justify-between px-1 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
         {onMove && (
           <div className="flex justify-between w-full pointer-events-auto">
             <button onClick={() => onMove('left')} className="p-0.5 hover:bg-slate-200 rounded text-slate-400"><ChevronLeft size={8}/></button>
             <button onClick={() => onMove('right')} className="p-0.5 hover:bg-slate-200 rounded text-slate-400"><ChevronRight size={8}/></button>
           </div>
         )}
      </div>
    </div>
  );
};

export default SectionCard;
