
import React from 'react';
import { ChartLink } from '../types';
import { Link as LinkIcon, Plus, Trash2, ExternalLink } from 'lucide-react';

interface ReferenceLinksProps {
  links: ChartLink[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<ChartLink>) => void;
  onRemove: (id: string) => void;
}

const ReferenceLinks: React.FC<ReferenceLinksProps> = ({ links, onAdd, onUpdate, onRemove }) => {
  return (
    <div className="mt-2 mb-4">
      <div className="flex items-center justify-between mb-1 px-0.5">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
          <LinkIcon size={10} />
          Links de Referência (Spotify / YouTube)
        </label>
        <button 
          onClick={onAdd}
          className="no-print text-[9px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
        >
          <Plus size={10} />
          Adicionar Link
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {links.map((link) => (
          <div key={link.id} className="group relative flex items-center gap-2 bg-slate-50 border border-slate-100 rounded px-2 py-1 transition-all hover:border-slate-200">
            {/* Modo Edição (Apenas na tela) */}
            <div className="flex-1 flex items-center gap-1 no-print">
              <input 
                className="bg-transparent text-[10px] font-bold text-slate-600 outline-none w-20 border-r border-slate-200 pr-1"
                value={link.label}
                onChange={(e) => onUpdate(link.id, { label: e.target.value })}
                placeholder="Ex: Spotify"
              />
              <input 
                className="bg-transparent text-[10px] text-blue-500 underline outline-none flex-1 overflow-hidden truncate"
                value={link.url}
                onChange={(e) => onUpdate(link.id, { url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Modo Impressão / Exibição Final */}
            <div className="hidden print:flex items-center gap-1 flex-1 overflow-hidden">
              <span className="text-[10px] font-bold text-slate-800">{link.label}:</span>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] text-blue-600 underline truncate"
              >
                {link.url || 'Link'}
              </a>
            </div>

            <div className="flex items-center gap-1 no-print">
               <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Abrir link"
                className="p-1 text-slate-300 hover:text-blue-600"
              >
                <ExternalLink size={12} />
              </a>
              <button 
                onClick={() => onRemove(link.id)}
                className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        
        {links.length === 0 && (
          <div className="no-print col-span-full border border-dashed border-slate-200 rounded py-2 text-center">
            <span className="text-[10px] text-slate-300 italic">Nenhum link de referência adicionado.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceLinks;
