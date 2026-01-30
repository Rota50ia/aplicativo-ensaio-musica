
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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('sectionId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('sectionId');
    if (sourceId && sourceId !== targetId) {
      onReorder(sourceId, targetId);
    }
    setDraggedId(null);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {sections.map((section) => (
        <div 
          key={section.id} 
          draggable="true"
          onDragStart={(e) => handleDragStart(e, section.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, section.id)}
          className={`transition-all ${draggedId === section.id ? 'opacity-30 scale-95' : 'opacity-100'}`}
        >
          <SectionCard 
            section={section}
            onUpdate={(updates) => onUpdate(section.id, updates)}
            onRemove={() => onRemove(section.id)}
            onMove={(direction) => onMove(section.id, direction)}
            onDuplicate={() => onDuplicate(section.id)}
          />
        </div>
      ))}
      {sections.length === 0 && (
        <div className="col-span-full py-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400">
          <p className="font-handwritten text-lg">Estrutura vazia.</p>
        </div>
      )}
    </div>
  );
};

export default StructureGrid;
