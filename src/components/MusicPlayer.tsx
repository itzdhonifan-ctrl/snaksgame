import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TRACKS = [
  {
    id: 1,
    title: "CYBERNETIC_RHYTHM",
    artist: "AI_GEN",
    bpm: "128BPM",
    color: "from-green-500 to-zinc-900"
  },
  {
    id: 2,
    title: "VOID_RUNNER",
    artist: "AI_GEN",
    bpm: "142BPM",
    color: "from-zinc-700 to-black"
  },
  {
    id: 3,
    title: "GLITCH_MATRIX",
    artist: "AI_GEN",
    bpm: "110BPM",
    color: "from-zinc-900 to-green-900"
  }
];

export function MusicLibrary({ currentIndex, onSelect }: { currentIndex: number, onSelect: (index: number) => void }) {
  return (
    <div className="space-y-1">
      {TRACKS.map((track, i) => (
        <button 
          key={track.id}
          onClick={() => onSelect(i)}
          className={`flex flex-col w-full text-left p-3 border-l-2 transition-all group ${
            i === currentIndex 
              ? 'bg-zinc-900 border-neon-green' 
              : 'border-transparent hover:bg-zinc-900/50 hover:border-zinc-700'
          }`}
        >
          <span className={`text-[10px] font-bold tracking-tight ${i === currentIndex ? 'text-neon-green' : 'text-zinc-400'}`}>
            {track.title}
          </span>
          <span className="text-[8px] f-mono opacity-40 uppercase">
            {track.artist} // {track.bpm}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function MusicPlayer({ currentTrackIndex, onIndexChange }: { currentTrackIndex: number, onIndexChange: (i: number) => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    onIndexChange((currentTrackIndex + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBackward = () => {
    onIndexChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  return (
    <footer className="h-24 bg-[#0a0a0a] border-t border-zinc-800 px-10 flex items-center justify-between z-20">
      {/* Track Info */}
      <div className="flex items-center w-1/3 overflow-hidden">
        <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center mr-4 shrink-0 transition-transform hover:scale-105">
          <div className={`w-8 h-8 rounded-full border border-neon-green/30 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
             <div className="w-2 h-2 neon-bg rounded-full shadow-[0_0_10px_#39FF14]" />
          </div>
        </div>
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -5, opacity: 0 }}
            >
              <div className="text-xs font-bold truncate text-[#E0E0E0]">{currentTrack.title}.wav</div>
              <div className="text-[9px] f-mono opacity-40 uppercase tracking-widest mt-0.5">
                VOLUME: 84% // LOOP_ENABLED
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3 space-y-3">
        <div className="flex items-center space-x-12">
          <button onClick={skipBackward} className="text-white/40 hover:text-neon-green transition-colors text-xs f-mono tracking-tighter">
            ◁◁ PREV
          </button>
          
          <button 
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full border-2 border-neon-green flex items-center justify-center text-neon-green transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:bg-neon-green hover:text-black group active:scale-95`}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
          </button>

          <button onClick={skipForward} className="text-white/40 hover:text-neon-green transition-colors text-xs f-mono tracking-tighter">
            NEXT ▷▷
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-sm bg-zinc-800 h-[3px] rounded-full relative overflow-hidden group">
          <motion.div 
            className="absolute top-0 left-0 h-full neon-bg shadow-[0_0_10px_#39FF14]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      </div>

      {/* Telemetry */}
      <div className="w-1/3 flex justify-end items-center space-x-6 f-mono text-[9px] opacity-30 uppercase tracking-[0.1em]">
        <span>320KBPS</span>
        <span>48KHZ</span>
        <span className="text-zinc-500">01:24 / 04:30</span>
      </div>
    </footer>
  );
}

