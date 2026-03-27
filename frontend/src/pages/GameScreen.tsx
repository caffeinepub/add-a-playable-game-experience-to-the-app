import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import GameCanvas from '../components/game/GameCanvas';
import GameHud from '../components/game/GameHud';
import GameControls from '../components/game/GameControls';
import LeaderboardPanel from '../components/game/LeaderboardPanel';
import LoginButton from '../components/auth/LoginButton';
import { useGame } from '../game/useGame';
import { useSaveScore } from '../hooks/useScores';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Trophy, Play, Info } from 'lucide-react';
import { toast } from 'sonner';

type View = 'menu' | 'game' | 'leaderboard';

export default function GameScreen() {
  const [view, setView] = useState<View>('menu');
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { mutate: saveScore } = useSaveScore();

  const {
    gameState,
    score,
    gamePhase,
    direction,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    changeDirection,
  } = useGame();

  const handleGameOver = () => {
    if (isAuthenticated && score > 0) {
      saveScore(BigInt(score), {
        onSuccess: () => {
          toast.success('Score saved!');
        },
        onError: (error) => {
          toast.error('Failed to save score: ' + error.message);
        },
      });
    }
  };

  const handleStartGame = () => {
    setView('game');
    startGame();
  };

  const handleRestart = () => {
    restartGame();
  };

  const handleBackToMenu = () => {
    setView('menu');
    if (gamePhase !== 'idle') {
      restartGame();
    }
  };

  const handleViewLeaderboard = () => {
    setView('leaderboard');
  };

  if (view === 'leaderboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 dark:from-emerald-950 dark:via-amber-950 dark:to-orange-950">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-xl font-bold">Snake Game</h1>
            </div>
            <LoginButton />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Button onClick={handleBackToMenu} variant="outline" className="mb-6">
              ← Back to Menu
            </Button>
            <LeaderboardPanel />
          </div>
        </main>
        <footer className="mt-16 border-t border-border/40 bg-background/80 backdrop-blur-sm py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with <span className="text-red-500">♥</span> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 dark:from-emerald-950 dark:via-amber-950 dark:to-orange-950">
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-xl font-bold">Snake Game</h1>
            </div>
            <LoginButton />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl">Snake Game</CardTitle>
              <CardDescription>Classic arcade action. Eat, grow, survive!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleStartGame} size="lg" className="w-full" variant="default">
                <Play className="w-5 h-5 mr-2" />
                Start Game
              </Button>
              <Button onClick={handleViewLeaderboard} size="lg" variant="outline" className="w-full">
                <Trophy className="w-5 h-5 mr-2" />
                Leaderboard
              </Button>
              <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">How to Play:</p>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        <li>• Use arrow keys or on-screen controls</li>
                        <li>• Eat food to grow and score points</li>
                        <li>• Don't hit walls or yourself!</li>
                      </ul>
                    </div>
                  </div>
                  {!isAuthenticated && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-muted-foreground">
                        <strong>Sign in</strong> to save your high scores and compete on the leaderboard!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </main>
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm py-6">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © 2026. Built with <span className="text-red-500">♥</span> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    );
  }

  // Game view
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-orange-50 dark:from-emerald-950 dark:via-amber-950 dark:to-orange-950">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold">Snake Game</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleBackToMenu} variant="outline" size="sm">
              Menu
            </Button>
            <LoginButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <GameHud
            score={score}
            gamePhase={gamePhase}
            onPause={pauseGame}
            onResume={resumeGame}
            onRestart={handleRestart}
          />
          <div className="relative">
            <GameCanvas gameState={gameState} gamePhase={gamePhase} />
            {gamePhase === 'gameOver' && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center">
                <Card className="w-full max-w-sm shadow-xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Game Over!</CardTitle>
                    <CardDescription>Final Score: {score}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isAuthenticated ? (
                      <p className="text-center text-sm text-muted-foreground">
                        Your score has been saved to the leaderboard.
                      </p>
                    ) : (
                      <Card className="bg-muted/50">
                        <CardContent className="pt-4 text-center text-sm">
                          <p className="mb-3">Sign in to save your score and compete on the leaderboard!</p>
                          <LoginButton />
                        </CardContent>
                      </Card>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleRestart} className="flex-1">
                        Play Again
                      </Button>
                      <Button onClick={handleViewLeaderboard} variant="outline" className="flex-1">
                        <Trophy className="w-4 h-4 mr-2" />
                        Leaderboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <GameControls direction={direction} onDirectionChange={changeDirection} disabled={gamePhase !== 'playing'} />
        </div>
      </main>
    </div>
  );
}
