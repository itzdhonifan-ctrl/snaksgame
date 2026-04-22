import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer, { MusicLibrary } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col font-sans select-none border-4 border-black">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="f-mono text-[10px] ml-4 opacity-40 uppercase tracking-widest hidden md:inline">
            System_Core // Snake_Player_v4.2 // CLOUD_SYNC_ON
          </span>
        </div>
        <div className="f-display text-2xl italic tracking-tighter">
          NEON<span className="neon-green">DRIFT</span>
        </div>
        <div className="text-[10px] f-mono opacity-40 uppercase hidden sm:block">
          LATENCY: 12ms // CPU: 14% // TEMP: 42°C
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Library */}
        <aside className="w-72 bg-black border-r border-zinc-800 p-6 flex flex-col hidden lg:flex">
          <section className="flex-1 overflow-y-auto">
            <h3 className="f-mono text-[9px] opacity-30 mb-6 tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-zinc-600 rounded-full" />
              Audio_Library.db
            </h3>
            <MusicLibrary 
              currentIndex={currentTrackIndex} 
              onSelect={setCurrentTrackIndex} 
            />
          </section>
          
          <section className="mt-8">
            <div className="p-4 border border-zinc-800 rounded bg-zinc-900/10">
              <div className="flex justify-between items-end mb-2">
                <span className="f-mono text-[8px] opacity-30 tracking-widest uppercase">Equalizer</span>
                <span className="text-[7px] opacity-20 f-mono">FREQ_KHZ</span>
              </div>
              <div className="flex items-end space-x-1 h-16">
                 {[60, 90, 40, 75, 55, 30, 85, 45].map((h, i) => (
                   <motion.div 
                     key={i}
                     animate={{ height: [`${h}%`, `${h+10}%`, `${h-5}%`] }}
                     transition={{ duration: 0.5 + i*0.1, repeat: Infinity, ease: "easeInOut" }}
                     className={`w-full ${i % 2 === 0 ? 'bg-zinc-800' : 'neon-bg opacity-80'}`}
                   />
                 ))}
              </div>
            </div>
          </section>
        </aside>

        {/* Center: Game Arena */}
        <section className="flex-1 bg-black relative flex items-center justify-center p-8">
          <div className="f-display absolute inset-0 flex items-center justify-center text-[16vw] opacity-[0.03] pointer-events-none select-none tracking-tighter">
            PLAYING
          </div>
          <div className="w-full max-w-[520px] aspect-square neon-border bg-[#0a0a0a] relative overflow-hidden shadow-[0_0_50px_rgba(57,255,20,0.05)]">
            <SnakeGame />
          </div>
        </section>

        {/* Right Side: Stats */}
        <aside className="w-72 bg-black border-l border-zinc-800 p-8 flex flex-col text-right hidden xl:flex">
          <div className="mb-14">
            <h3 className="f-mono text-[9px] opacity-30 mb-2 tracking-[0.3em] uppercase">High Score</h3>
            <div className="f-display text-5xl tracking-tighter">14,200</div>
          </div>
          
          <div className="mb-14">
            <h3 className="f-mono text-[9px] opacity-30 mb-2 tracking-[0.3em] uppercase">Current Session</h3>
            <div className="f-display text-7xl neon-green tracking-tighter animate-pulse">0,240</div>
          </div>

          <div className="mt-auto border-t border-zinc-800 pt-8 space-y-4">
            {[
              { label: 'DIFFICULTY', value: 'HARD_MODE' },
              { label: 'RANK', value: 'ELITE', color: 'text-neon-green' }
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center bg-zinc-900/30 p-4 border border-zinc-800/50">
                <span className="text-[10px] f-mono opacity-40 uppercase">{item.label}</span>
                <span className={`text-[11px] font-black italic tracking-wide ${item.color || 'text-white'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </main>

      {/* Music Player Footer */}
      <MusicPlayer 
        currentTrackIndex={currentTrackIndex} 
        onIndexChange={setCurrentTrackIndex} 
      />
    </div>
  );
}


