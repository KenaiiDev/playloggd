"use client";

import { Card } from "@/components/ui";
import { GameCard } from "./GameCard";
import { useGame } from "@/lib/hooks/use-games";

type CollectionGameCardProps = {
  gameId: string;
};

export function CollectionGameCard({ gameId }: CollectionGameCardProps) {
  const { data: game, isLoading, error } = useGame(gameId);

  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <div className="aspect-3/4 bg-muted" />
        <div className="p-4 space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
      </Card>
    );
  }

  if (!game || error) {
    return null;
  }

  return (
    <GameCard
      gameId={game.externalId || gameId}
      title={game.title || "Unknown Game"}
      genre={game.genres?.[0] || "Unknown"}
      rating={game.rating || 0}
      imageUrl={game.coverUrl || ""}
      description={game.description || ""}
      genres={game.genres || []}
      showActions={true}
    />
  );
}
