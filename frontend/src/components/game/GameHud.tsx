import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { GamePhase } from '../../game/types';

interface GameHudProps {
  score: number;
  gamePhase: GamePhase;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

export default function GameHud({ score, gamePhase, onPause, onResume, onRestart }: GameHudProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-medium capitalize">{gamePhase}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {gamePhase === 'playing' && (
              <Button onClick={onPause} variant="outline" size="sm">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            {gamePhase === 'paused' && (
              <Button onClick={onResume} variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}
            {(gamePhase === 'playing' || gamePhase === 'paused') && (
              <Button onClick={onRestart} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
