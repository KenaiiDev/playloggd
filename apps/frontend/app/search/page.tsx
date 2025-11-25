"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSearchGames } from "@/lib/hooks/use-games";
import { GameCard } from "@/components/games/GameCard";
import {
  Card,
  CardContent,
  Input,
  Label,
  Alert,
  AlertDescription,
} from "@/components/ui";
import { Search, Loader2, GamepadIcon } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useSearchGames(debouncedQuery);

  const showResults = debouncedQuery.length >= 2;
  const hasResults = data && data.games.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Search Games</h1>
        <p className="text-muted-foreground">
          Find your next favorite game from our extensive collection
        </p>
      </div>

      {/* Search Input */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Label htmlFor="search">Game Title</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                placeholder="Search for games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <p className="text-sm text-muted-foreground">
                Please enter at least 2 characters to search
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading && showResults && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && showResults && (
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to search games. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && showResults && !hasResults && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <GamepadIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn&apos;t find any games matching &quot;{debouncedQuery}
            &quot;. Try adjusting your search terms.
          </p>
        </div>
      )}

      {!isLoading && hasResults && (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Found {data.pagination.total} game
              {data.pagination.total !== 1 ? "s" : ""} for &quot;
              {debouncedQuery}
              &quot;
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.games.map((game) => (
              <GameCard
                key={game.externalId}
                gameId={game.externalId}
                title={game.title}
                genre={game.genres[0] || ""}
                rating={game.rating / 10}
                imageUrl={game.coverUrl || "/placeholder-game.jpg"}
                description={game.description || ""}
                genres={game.genres}
              />
            ))}
          </div>
        </>
      )}

      {!showResults && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Start searching</h3>
          <p className="text-muted-foreground max-w-md">
            Enter a game title in the search box above to find games in our
            collection.
          </p>
        </div>
      )}
    </div>
  );
}
