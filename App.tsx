
import React, { useState, useEffect } from 'react';
import { Plus, Download, Trash2, Music, Trash } from 'lucide-react';
import { SongChart, ChartSection, SectionType } from './types';
import Header from './components/Header';
import StructureGrid from './components/StructureGrid';

const DEFAULT_CHART: SongChart = {
  id: '1',
  title: 'Exemplo de Música',
  artist: 'Sua Banda',
  tempo: 120,
  timeSignature: '4/4',
  feel: 'Straight',
  genre: 'Rock',
  sections: [
    { id: '1', type: SectionType.INTRO, measures: 4, notation: 'Am | G | F | E7', cues: 'Só bateria' },
    { id: '2', type: SectionType.INTRO, measures: 4, notation: 'Am | G | F | E7', cues: 'Entra Banda' },
    { id: '3', type: SectionType.VERSO_1, measures: 8, notation: 'Am | Dm | G | C', cues: '' },
    { id: '4', type: SectionType.PRE_REFRÃO, measures: 4, notation: 'F | G | F | G', cues: 'Crescendo' },
    { id: '5', type: SectionType.REFRÃO, measures: 8, notation: 'C | G | Am | F', cues: 'Forte' },
    { id: '6', type: SectionType.PONTE, measures: 8, notation: 'Dm | Am | Dm | E7', cues: 'Suave' },
    { id: '7', type: SectionType.REFRÃO_FINAL, measures: 8, notation: 'C | G | Am | F', cues: 'Dobra' },
    { id: '8', type: SectionType.OUTRO_FINAL, measures: 4, notation: 'C | G | Am | F', cues: 'Fade out' },
  ],
};

export default function App() {
  const [chart, setChart] = useState<SongChart>(() => {
    const saved = localStorage.getItem('bandchart_last');
    return saved ? JSON.parse(saved) : DEFAULT_CHART;
  });

  useEffect(() => {
    localStorage.setItem('bandchart_last', JSON.stringify(chart));
    // Define o título da página para que o PDF seja salvo com este nome
    if (chart.title) {
      document.title = `${chart.title} - ${chart.artist} - Mapa Musical`;
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
    <div className="min-h-screen pb-20 bg-slate-50">
      <nav className="no-print sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Music className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Music Practice Studio
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors shadow-sm"
          >
            <Download size={18} />
            Exportar
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 px-4 md:px-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <Header 
            chart={chart} 
            onUpdate={updateMetadata} 
          />

          <div className="mt-12">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-widest flex items-center gap-3">
                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                Estrutura
              </h2>
              <div className="flex gap-3 no-print items-center">
                <button 
                  onClick={clearChart}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Limpar tudo"
                >
                  <Trash size={18} />
                </button>
                <button 
                  onClick={addSection}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0f172a] text-white rounded-full hover:bg-black transition-all active:scale-95 shadow-lg font-bold text-sm"
                >
                  <Plus size={20} />
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

      <footer className="mt-12 text-center text-slate-400 text-xs mb-8 no-print">
        Feito para ensaios profissionais. Suas alterações são salvas automaticamente.
      </footer>
    </div>
  );
}
