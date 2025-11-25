"use client";

import { useState } from "react";
import { GameCard } from "@/components/games";
import {
  usePopularGames,
  useRecentGames,
  useTopRatedGames,
  useUpcomingGames,
} from "@/lib/hooks/use-games";
import {
  Alert,
  AlertDescription,
  Skeleton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";

type GameCategory = "popular" | "top" | "recent" | "upcoming";

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48] as const;

export default function Home() {
  const [category, setCategory] = useState<GameCategory>("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const offset = (currentPage - 1) * itemsPerPage;

  const popularQuery = usePopularGames({
    limit: itemsPerPage,
    offset,
    enabled: category === "popular",
  });

  const topQuery = useTopRatedGames({
    limit: itemsPerPage,
    offset,
    enabled: category === "top",
  });

  const recentQuery = useRecentGames({
    limit: itemsPerPage,
    offset,
    enabled: category === "recent",
  });

  const upcomingQuery = useUpcomingGames({
    limit: itemsPerPage,
    offset,
    enabled: category === "upcoming",
  });

  const activeQuery =
    category === "popular"
      ? popularQuery
      : category === "top"
      ? topQuery
      : category === "upcoming"
      ? upcomingQuery
      : recentQuery;

  const { data, isLoading, error } = activeQuery;

  const handleCategoryChange = (value: GameCategory) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categoryLabels: Record<GameCategory, string> = {
    popular: "Popular Games",
    top: "Top Rated",
    recent: "Recent Releases",
    upcoming: "Upcoming Games",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{categoryLabels[category]}</h1>

        {/* Category Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Category:</span>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="top">Top Rated</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Items per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <Card key={i} className="w-full p-0">
              <CardHeader className="p-0">
                <Skeleton className="aspect-3/4 w-full rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading games. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Games Grid */}
      {!isLoading && !error && data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
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

          {/* Pagination Controls */}
          {(currentPage > 1 || data.pagination.hasMore) && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <span className="text-sm font-medium">Page {currentPage}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!data.pagination.hasMore}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
