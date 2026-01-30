
import React, { useState } from 'react';
import { ChartSection, SectionType } from '../types';
import SectionCard from './SectionCard';

interface StructureGridProps {
  sections: ChartSection[];
  onUpdate: (id: string, updates: Partial<ChartSection>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'left' | 'right') => void;
  onDuplicate: (id: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
}

const StructureGrid: React.FC<StructureGridProps> = ({ sections, onUpdate, onRemove, onMove, onDuplicate, onReorder }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('sectionId', id);
    e.dataTransfer.effectAllowed = 'move';
    
    // Pequeno atraso para que a imagem de arrasto do navegador seja capturada 
    // antes de aplicarmos a opacidade baixa no elemento original
    setTimeout(() => {
      const el = e.target as HTMLElement;
      el.classList.add('opacity-20');
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Só limpamos se estivermos saindo do elemento pai, não dos filhos
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setDragOverId(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('sectionId');
    if (sourceId && sourceId !== targetId) {
      onReorder(sourceId, targetId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {sections.map((section) => {
        const isDragging = draggedId === section.id;
        const isDragOver = dragOverId === section.id && !isDragging;

        return (
          <div 
            key={section.id} 
            draggable="true"
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, section.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, section.id)}
            className={`
              relative transition-all duration-200 rounded-lg
              ${isDragging ? 'opacity-10 scale-95 grayscale' : 'opacity-100'}
              ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 z-10' : ''}
            `}
          >
            {/* Indicador Visual de Drop Zone (opcional, além do ring) */}
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none border-2 border-dashed border-blue-400 z-20 flex items-center justify-center">
                <div className="bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                  Mover para aqui
                </div>
              </div>
            )}

            <SectionCard 
              section={section}
              onUpdate={(updates) => onUpdate(section.id, updates)}
              onRemove={() => onRemove(section.id)}
              onMove={(direction) => onMove(section.id, direction)}
              onDuplicate={() => onDuplicate(section.id)}
            />
          </div>
        );
      })}
      
      {sections.length === 0 && (
        <div className="col-span-full py-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400">
          <p className="font-handwritten text-lg">Estrutura vazia.</p>
        </div>
      )}
    </div>
  );
};

export default StructureGrid;
