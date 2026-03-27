import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { useGetCallerScore, useGetLeaderboard } from '../../hooks/useScores';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LoginButton from '../auth/LoginButton';

export default function LeaderboardPanel() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: callerScore, isLoading: callerScoreLoading } = useGetCallerScore();
  const { data: leaderboard, isLoading: leaderboardLoading } = useGetLeaderboard(10);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-amber-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Your Best Score</CardTitle>
            <CardDescription>Your personal high score</CardDescription>
          </CardHeader>
          <CardContent>
            {callerScoreLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : (
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {callerScore?.toString() || '0'}
                  </p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-sm">Sign in to save your scores and compete on the leaderboard!</p>
            <LoginButton />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
          <CardDescription>Top 10 players worldwide</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboardLoading ? (
            <p className="text-muted-foreground">Loading leaderboard...</p>
          ) : leaderboard && leaderboard.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  const isCurrentUser = isAuthenticated && entry.user.toString() === identity?.getPrincipal().toString();
                  return (
                    <TableRow key={entry.user.toString()} className={isCurrentUser ? 'bg-muted/50' : ''}>
                      <TableCell className="font-medium">{getRankIcon(rank)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs truncate max-w-[200px]">
                            {entry.user.toString().slice(0, 8)}...{entry.user.toString().slice(-6)}
                          </span>
                          {isCurrentUser && <Badge variant="secondary">You</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">{entry.highScore.toString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No scores yet. Be the first to play!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
