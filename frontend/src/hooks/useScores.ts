import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ScoreEntry } from '../backend';

export function useGetCallerScore() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<bigint>({
    queryKey: ['callerScore'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerScore();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useGetLeaderboard(limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ScoreEntry[]>({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard(BigInt(limit));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSaveScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (score: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveScore(score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerScore'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
