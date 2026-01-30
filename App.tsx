
import React, { useState, useEffect } from 'react';
import { Plus, Download, Music, Trash } from 'lucide-react';
import { SongChart, ChartSection, SectionType, ChartLink } from './types';
import Header from './components/Header';
import StructureGrid from './components/StructureGrid';
import ReferenceLinks from './components/ReferenceLinks';

const DEFAULT_CHART: SongChart = {
  id: '1',
  title: 'Nome da Música',
  artist: 'Nome do Artista',
  tempo: 120,
  timeSignature: '4/4',
  feel: 'GROOVE',
  genre: 'Gênero',
  links: [],
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
    // Define o título técnico da aba do navegador como solicitado
    document.title = "Estúdio de Ensaio";
  }, [chart]);

  const updateMetadata = (key: keyof Omit<SongChart, 'sections' | 'id' | 'links'>, value: string | number) => {
    setChart(prev => ({ ...prev, [key]: value }));
  };

  const addLink = () => {
    const newLink: ChartLink = {
      id: Math.random().toString(36).substr(2, 9),
      label: 'Referência',
      url: ''
    };
    setChart(prev => ({ ...prev, links: [...(prev.links || []), newLink] }));
  };

  const updateLink = (id: string, updates: Partial<ChartLink>) => {
    setChart(prev => ({
      ...prev,
      links: (prev.links || []).map(l => l.id === id ? { ...l, ...updates } : l)
    }));
  };

  const removeLink = (id: string) => {
    setChart(prev => ({
      ...prev,
      links: (prev.links || []).filter(l => l.id !== id)
    }));
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
      setChart(prev => ({ ...prev, title: '', artist: '', sections: [], links: [] }));
    }
  };

  return (
    <div className="min-h-screen pb-6 bg-slate-50">
      <nav className="no-print sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-1.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded">
            <Music className="w-3.5 h-3.5 text-white" />
          </div>
          <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Estúdio de Ensaio
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors shadow-sm"
          >
            <Download size={14} />
            Exportar PDF
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-2 px-2 md:px-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 print:shadow-none print:border-none print:p-0">
          <Header 
            chart={chart} 
            onUpdate={updateMetadata} 
          />

          <ReferenceLinks 
            links={chart.links || []}
            onAdd={addLink}
            onUpdate={updateLink}
            onRemove={removeLink}
          />

          <div className="mt-2">
            <div className="flex items-center justify-between mb-2 border-b border-slate-50 pb-1">
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-3 bg-blue-600 rounded-full"></span>
                Estrutura Musical
              </h2>
              <div className="flex gap-2 no-print items-center">
                <button 
                  onClick={clearChart}
                  className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                  title="Limpar tudo"
                >
                  <Trash size={14} />
                </button>
                <button 
                  onClick={addSection}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded hover:bg-black transition-all active:scale-95 shadow font-bold text-[10px]"
                >
                  <Plus size={14} />
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

      <footer className="mt-4 text-center text-slate-300 text-[9px] no-print">
        Estúdio de Ensaio • Ferramenta para Músicos by Edilson Morais . 2026
      </footer>
    </div>
  );
}
