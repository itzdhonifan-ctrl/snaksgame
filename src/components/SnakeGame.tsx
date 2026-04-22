import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
      case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
      case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
      case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      case ' ': setIsPaused(prev => !prev); break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Border collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(prev - SPEED_INCREMENT, 50));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, generateFood, isGameOver, isPaused, score, highScore]);

  useEffect(() => {
    const play = (time: number) => {
      if (time - lastUpdateRef.current > speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(play);
    };

    gameLoopRef.current = requestAnimationFrame(play);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] font-mono text-sm uppercase tracking-widest text-neon-blue">
        <div className="flex items-center gap-2">
          <span className="opacity-50">Score</span>
          <span className="text-xl font-bold neon-text-blue">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy size={16} className="opacity-50" />
          <span className="text-xl font-bold neon-text-purple">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative border-2 border-neon-purple rounded-lg bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(188,19,254,0.3)]"
        style={{ width: 400, height: 400 }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-dot opacity-30 pointer-events-none" />

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            className="absolute rounded-sm bg-neon-green shadow-[0_0_10px_rgba(57,255,20,0.5)] border-[0.5px] border-black/20"
            initial={false}
            animate={{
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
            }}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              zIndex: snake.length - i
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          className="absolute rounded-full bg-neon-red shadow-[0_0_15px_#FF3131]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity
          }}
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
          }}
        />

        {/* Overlay */}
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm rounded-lg z-50 p-8 text-center"
            >
              {isGameOver ? (
                <>
                  <h2 className="f-display text-5xl text-neon-red mb-2 animate-glitch">CRITICAL FAILURE</h2>
                  <p className="text-gray-500 f-mono text-[10px] mb-8 tracking-[0.2em]">CONNECTION_TERMINATED // LOG_ID_404</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-3 px-8 py-3 neon-bg text-black f-display text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(57,255,20,0.4)]"
                  >
                    <RotateCcw size={18} />
                    Respawn_Process
                  </button>
                </>
              ) : (
                <>
                  <h2 className="f-display text-5xl text-neon-green mb-2">SYSTEM HALTED</h2>
                  <p className="text-gray-500 f-mono text-[10px] mb-8 tracking-[0.2em]">WAITING_FOR_INTERRUPT // SPACE_TO_RESUME</p>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-3 px-8 py-3 border-2 border-neon-green text-neon-green f-display text-sm hover:bg-neon-green hover:text-black transition-all shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                  >
                    <Play size={18} />
                    Resume_Sequence
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.2em]">
        Arrows to Navigate // Space to Interrupt
      </div>
    </div>
  );
}
