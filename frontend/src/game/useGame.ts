import { useState, useEffect, useCallback, useRef } from 'react';
import type { Direction, GamePhase, GameState, Position } from './types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, POINTS_PER_FOOD } from './types';

const getRandomPosition = (gridSize: number): Position => ({
  x: Math.floor(Math.random() * gridSize),
  y: Math.floor(Math.random() * gridSize),
});

const getInitialSnake = (): Position[] => [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    snake: getInitialSnake(),
    food: getRandomPosition(GRID_SIZE),
    gridSize: GRID_SIZE,
  });
  const [direction, setDirection] = useState<Direction>('right');
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const nextDirectionRef = useRef<Direction>('right');

  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return snake.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    setGameState((prevState) => {
      const currentDirection = nextDirectionRef.current;
      const head = prevState.snake[0];
      const newHead: Position = { ...head };

      switch (currentDirection) {
        case 'up':
          newHead.y -= 1;
          break;
        case 'down':
          newHead.y += 1;
          break;
        case 'left':
          newHead.x -= 1;
          break;
        case 'right':
          newHead.x += 1;
          break;
      }

      if (checkCollision(newHead, prevState.snake)) {
        setGamePhase('gameOver');
        return prevState;
      }

      const newSnake = [newHead, ...prevState.snake];
      let newFood = prevState.food;

      // Check if food is eaten
      if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
        setScore((prev) => prev + POINTS_PER_FOOD);
        setSpeed((prev) => Math.max(50, prev - SPEED_INCREMENT));
        newFood = getRandomPosition(GRID_SIZE);
      } else {
        newSnake.pop();
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
      };
    });
  }, [checkCollision]);

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gamePhase !== 'playing') {
        return;
      }

      if (timestamp - lastUpdateRef.current >= speed) {
        moveSnake();
        lastUpdateRef.current = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [gamePhase, speed, moveSnake]
  );

  useEffect(() => {
    if (gamePhase === 'playing') {
      lastUpdateRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gamePhase, gameLoop]);

  const startGame = useCallback(() => {
    setGameState({
      snake: getInitialSnake(),
      food: getRandomPosition(GRID_SIZE),
      gridSize: GRID_SIZE,
    });
    setDirection('right');
    nextDirectionRef.current = 'right';
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGamePhase('playing');
  }, []);

  const pauseGame = useCallback(() => {
    setGamePhase('paused');
  }, []);

  const resumeGame = useCallback(() => {
    setGamePhase('playing');
  }, []);

  const restartGame = useCallback(() => {
    setGameState({
      snake: getInitialSnake(),
      food: getRandomPosition(GRID_SIZE),
      gridSize: GRID_SIZE,
    });
    setDirection('right');
    nextDirectionRef.current = 'right';
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGamePhase('idle');
  }, []);

  const changeDirection = useCallback(
    (newDirection: Direction) => {
      const currentDirection = nextDirectionRef.current;
      // Prevent reversing
      if (
        (currentDirection === 'up' && newDirection === 'down') ||
        (currentDirection === 'down' && newDirection === 'up') ||
        (currentDirection === 'left' && newDirection === 'right') ||
        (currentDirection === 'right' && newDirection === 'left')
      ) {
        return;
      }
      nextDirectionRef.current = newDirection;
      setDirection(newDirection);
    },
    []
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gamePhase !== 'playing') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          changeDirection('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          changeDirection('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          changeDirection('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          changeDirection('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gamePhase, changeDirection]);

  // Trigger save score on game over
  useEffect(() => {
    if (gamePhase === 'gameOver' && score > 0) {
      // Parent component will handle saving
    }
  }, [gamePhase, score]);

  return {
    gameState,
    score,
    gamePhase,
    direction,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
  };
}
