"use client";

import { useState, useMemo } from "react";
import { GameCard } from "./GameCard";
import { PaginationControls } from "./PaginationControls";
import { Game, GameStatusEnum } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type GameCardsContainerProps = {
  games: Game[];
  onStatusChange?: (gameId: string, status: GameStatusEnum) => void;
  getUserGameStatus?: (gameId: string) => GameStatusEnum | undefined;
};

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48] as const;

export function GameCardsContainer({
  games,
  onStatusChange,
  getUserGameStatus,
}: GameCardsContainerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_OPTIONS[0]
  );

  const totalPages = Math.ceil(games.length / itemsPerPage);

  const currentGames = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return games.slice(startIndex, endIndex);
  }, [games, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleStatusChange = (gameId: string) => (status: GameStatusEnum) => {
    onStatusChange?.(gameId, status);
  };

  if (games.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-lg">
          No se encontraron juegos
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header with total count and items per page selector */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {currentGames.length} de {games.length} juegos
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Juegos por página:
          </span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-20">
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

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentGames.map((game) => {
          const currentStatus =
            getUserGameStatus?.(game.externalId) || undefined;

          return (
            <GameCard
              key={game.externalId}
              title={game.title}
              genre={game.genres[0] || ""}
              rating={game.rating / 10} // Convert from 0-100 to 0-10
              imageUrl={game.coverUrl || "/placeholder-game.jpg"}
              description={game.description || "Sin descripción disponible"}
              genres={game.genres}
              recommended={game.rating >= 80}
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange(game.externalId)}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
