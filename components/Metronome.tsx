
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Volume2, VolumeX } from 'lucide-react';

interface MetronomeProps {
  tempo: number;
  isPlaying: boolean;
  onToggle: () => void;
}

const Metronome: React.FC<MetronomeProps> = ({ tempo, isPlaying, onToggle }) => {
  const [muted, setMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const lookahead = 25.0; // How frequently to call scheduler (in ms)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (in s)

  const scheduleNote = useCallback((time: number) => {
    if (!audioContextRef.current || muted) return;

    const osc = audioContextRef.current.createOscillator();
    const envelope = audioContextRef.current.createGain();

    osc.frequency.value = 880; // Click frequency
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(envelope);
    envelope.connect(audioContextRef.current.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }, [muted]);

  const scheduler = useCallback(() => {
    if (!audioContextRef.current) return;
    
    while (nextNoteTimeRef.current < audioContextRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(nextNoteTimeRef.current);
      const secondsPerBeat = 60.0 / tempo;
      nextNoteTimeRef.current += secondsPerBeat;
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  }, [tempo, scheduleNote]);

  useEffect(() => {
    if (isPlaying) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      nextNoteTimeRef.current = audioContextRef.current.currentTime;
      scheduler();
    } else {
      if (timerIDRef.current) {
        window.clearTimeout(timerIDRef.current);
      }
    }

    return () => {
      if (timerIDRef.current) {
        window.clearTimeout(timerIDRef.current);
      }
    };
  }, [isPlaying, scheduler]);

  return (
    <div className="flex items-center gap-8 bg-slate-900 text-white px-8 py-4 rounded-full shadow-2xl">
      <div className="flex flex-col items-center">
        <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Ritmo</span>
        <span className="text-3xl font-bold font-mono tracking-tighter">{tempo}</span>
      </div>

      <div className="h-10 w-px bg-slate-800"></div>

      <button 
        onClick={onToggle}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        } shadow-lg active:scale-90`}
      >
        {isPlaying ? <Square size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
      </button>

      <button 
        onClick={() => setMuted(!muted)}
        className="text-slate-400 hover:text-white transition-colors"
      >
        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
    </div>
  );
};

export default Metronome;
