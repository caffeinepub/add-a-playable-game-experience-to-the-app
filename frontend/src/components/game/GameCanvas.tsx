import { useEffect, useRef } from 'react';
import type { GameState, GamePhase } from '../../game/types';

interface GameCanvasProps {
  gameState: GameState;
  gamePhase: GamePhase;
}

const CELL_SIZE = 20;
const CANVAS_SIZE = 400;

export default function GameCanvas({ gameState, gamePhase }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'oklch(0.97 0 0)';
    if (document.documentElement.classList.contains('dark')) {
      ctx.fillStyle = 'oklch(0.205 0 0)';
    }
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid
    ctx.strokeStyle = 'oklch(0.922 0 0 / 0.3)';
    if (document.documentElement.classList.contains('dark')) {
      ctx.strokeStyle = 'oklch(1 0 0 / 0.1)';
    }
    ctx.lineWidth = 1;
    for (let i = 0; i <= gameState.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food
    const foodGradient = ctx.createRadialGradient(
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    foodGradient.addColorStop(0, 'oklch(0.704 0.191 22.216)');
    foodGradient.addColorStop(1, 'oklch(0.577 0.245 27.325)');
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * CELL_SIZE + CELL_SIZE / 2,
      gameState.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      if (isHead) {
        const headGradient = ctx.createLinearGradient(
          segment.x * CELL_SIZE,
          segment.y * CELL_SIZE,
          segment.x * CELL_SIZE + CELL_SIZE,
          segment.y * CELL_SIZE + CELL_SIZE
        );
        headGradient.addColorStop(0, 'oklch(0.646 0.222 141.116)');
        headGradient.addColorStop(1, 'oklch(0.6 0.118 164.704)');
        ctx.fillStyle = headGradient;
      } else {
        ctx.fillStyle = 'oklch(0.6 0.118 164.704)';
      }
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      
      // Add eyes to head
      if (isHead) {
        ctx.fillStyle = 'oklch(1 0 0)';
        ctx.beginPath();
        ctx.arc(segment.x * CELL_SIZE + 8, segment.y * CELL_SIZE + 8, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(segment.x * CELL_SIZE + 14, segment.y * CELL_SIZE + 8, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [gameState]);

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border-2 border-border rounded-lg shadow-lg bg-card"
      />
    </div>
  );
}
