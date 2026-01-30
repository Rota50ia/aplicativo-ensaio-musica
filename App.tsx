
import React, { useState, useEffect } from 'react';
import { Plus, Download, Music, Trash } from 'lucide-react';
import { SongChart, ChartSection, SectionType } from './types';
import Header from './components/Header';
import StructureGrid from './components/StructureGrid';

const DEFAULT_CHART: SongChart = {
  id: '1',
  title: 'Nome da Música',
  artist: 'Nome do Artista',
  tempo: 120,
  timeSignature: '4/4',
  feel: 'GROOVE',
  genre: 'Gênero',
  sections: [
    { id: '1', type: SectionType.INTRO, measures: 4, notation: 'Am | G | F | E7', cues: 'Só bateria' }
  ],
};

export default function App() {
  const [chart, setChart] = useState<SongChart>(() => {
    const saved = localStorage.getItem('bandchart_last');
    return saved ? JSON.parse(saved) : DEFAULT_CHART;
  });

  useEffect(() => {
    localStorage.setItem('bandchart_last', JSON.stringify(chart));
    if (chart.title) {
      document.title = `${chart.title} - ${chart.artist} - Estúdio de Ensaio`;
    }
  }, [chart]);

  const updateMetadata = (key: keyof Omit<SongChart, 'sections' | 'id'>, value: string | number) => {
    setChart(prev => ({ ...prev, [key]: value }));
  };

  const addSection = () => {
    const newSection: ChartSection = {
      id: Math.random().toString(36).substr(2, 9),
      type: SectionType.VERSO_1,
      measures: 8,
      notation: '',
      cues: ''
    };
    setChart(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  };

  const handleExportPDF = () => {
    window.print();
  };

  const updateSection = (id: string, updates: Partial<ChartSection>) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const removeSection = (id: string) => {
    setChart(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== id)
    }));
  };

  const duplicateSection = (id: string) => {
    setChart(prev => {
      const index = prev.sections.findIndex(s => s.id === id);
      if (index === -1) return prev;
      const sectionToCopy = prev.sections[index];
      const newSection = { ...sectionToCopy, id: Math.random().toString(36).substr(2, 9) };
      const newSections = [...prev.sections];
      newSections.splice(index + 1, 0, newSection);
      return { ...prev, sections: newSections };
    });
  };

  const moveSection = (id: string, direction: 'left' | 'right') => {
    setChart(prev => {
      const index = prev.sections.findIndex(s => s.id === id);
      if (index === -1) return prev;
      if (direction === 'left' && index === 0) return prev;
      if (direction === 'right' && index === prev.sections.length - 1) return prev;

      const newSections = [...prev.sections];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      return { ...prev, sections: newSections };
    });
  };

  const reorderSections = (draggedId: string, targetId: string) => {
    setChart(prev => {
      const draggedIndex = prev.sections.findIndex(s => s.id === draggedId);
      const targetIndex = prev.sections.findIndex(s => s.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newSections = [...prev.sections];
      const [draggedItem] = newSections.splice(draggedIndex, 1);
      newSections.splice(targetIndex, 0, draggedItem);
      
      return { ...prev, sections: newSections };
    });
  };

  const clearChart = () => {
    if (confirm('Tem certeza que deseja limpar todo o mapa?')) {
      setChart(prev => ({ ...prev, sections: [] }));
    }
  };

  return (
    <div className="min-h-screen pb-10 bg-slate-50">
      <nav className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <Music className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Estúdio de Ensaio
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors shadow-sm"
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-4 px-2 md:px-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 min-h-[calc(100vh-8rem)] print:shadow-none print:border-none print:p-0">
          <Header 
            chart={chart} 
            onUpdate={updateMetadata} 
          />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                Estrutura
              </h2>
              <div className="flex gap-2 no-print items-center">
                <button 
                  onClick={clearChart}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                  title="Limpar tudo"
                >
                  <Trash size={16} />
                </button>
                <button 
                  onClick={addSection}
                  className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded hover:bg-black transition-all active:scale-95 shadow font-bold text-xs"
                >
                  <Plus size={16} />
                  Adicionar Seção
                </button>
              </div>
            </div>
            
            <StructureGrid 
              sections={chart.sections} 
              onUpdate={updateSection}
              onRemove={removeSection}
              onMove={moveSection}
              onDuplicate={duplicateSection}
              onReorder={reorderSections}
            />
          </div>
        </div>
      </main>

      <footer className="mt-8 text-center text-slate-300 text-[10px] no-print">
        Estúdio de Ensaio &bull; Salvo Automaticamente
      </footer>
    </div>
  );
}
