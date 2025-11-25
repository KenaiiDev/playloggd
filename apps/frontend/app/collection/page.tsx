"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useGameCollectionStore } from "@/stores/game-collection-store";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { GameStatusEnum, type GameStatus } from "@playloggd/domain";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Card,
} from "@/components/ui";
import { Filter, Gamepad2 } from "lucide-react";
import { CollectionGameCard } from "@/components/games/CollectionGameCard";

const STATUS_LABELS: Record<GameStatus, string> = {
  [GameStatusEnum.WISHLIST]: "Want to Play",
  [GameStatusEnum.BACKLOG]: "Backlog",
  [GameStatusEnum.PLAYING]: "Currently Playing",
  [GameStatusEnum.ON_HOLD]: "On Hold",
  [GameStatusEnum.COMPLETED]: "Completed",
  [GameStatusEnum.FULLY_COMPLETED]: "100% Completed",
  [GameStatusEnum.DROPPED]: "Dropped",
  [GameStatusEnum.NOT_FOR_ME]: "Not for Me",
  [GameStatusEnum.REPLAY]: "Replaying",
  [GameStatusEnum.REVIEWING]: "Reviewing",
};

export default function CollectionPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const entries = useGameCollectionStore((state) => state.entries);
  const [filterStatus, setFilterStatus] = useState<GameStatus | "all">("all");

  const entriesArray = useMemo(() => {
    const all = Array.from(entries.values());
    if (filterStatus === "all") return all;
    return all.filter((entry) => entry.status === filterStatus);
  }, [entries, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: entries.size };
    Array.from(entries.values()).forEach((entry) => {
      counts[entry.status] = (counts[entry.status] || 0) + 1;
    });
    return counts;
  }, [entries]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  console.log({ entries, entriesArray });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">My Collection</h1>
        <p className="text-muted-foreground">
          Track and manage your gaming journey
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by status:</span>
          </div>
          <Select
            value={filterStatus}
            onValueChange={(value) =>
              setFilterStatus(value as GameStatus | "all")
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Games ({statusCounts.all || 0})
              </SelectItem>
              <SelectItem value={GameStatusEnum.PLAYING}>
                Playing ({statusCounts[GameStatusEnum.PLAYING] || 0})
              </SelectItem>
              <SelectItem value={GameStatusEnum.COMPLETED}>
                Completed ({statusCounts[GameStatusEnum.COMPLETED] || 0})
              </SelectItem>
              <SelectItem value={GameStatusEnum.BACKLOG}>
                Backlog ({statusCounts[GameStatusEnum.BACKLOG] || 0})
              </SelectItem>
              <SelectItem value={GameStatusEnum.WISHLIST}>
                Wishlist ({statusCounts[GameStatusEnum.WISHLIST] || 0})
              </SelectItem>
              <SelectItem value={GameStatusEnum.ON_HOLD}>
                On Hold ({statusCounts[GameStatusEnum.ON_HOLD] || 0})
              </SelectItem>
              <SelectItem value={GameStatusEnum.FULLY_COMPLETED}>
                100% Completed (
                {statusCounts[GameStatusEnum.FULLY_COMPLETED] || 0})
              </SelectItem>
              <SelectItem value={GameStatusEnum.DROPPED}>
                Dropped ({statusCounts[GameStatusEnum.DROPPED] || 0})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {entriesArray.length} of {entries.size} games
        </div>
      </div>

      {/* Empty State */}
      {entriesArray.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Gamepad2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
            <h2 className="text-2xl font-bold mb-2">
              {filterStatus === "all"
                ? "No games in your collection yet"
                : `No ${STATUS_LABELS[filterStatus as GameStatus]} games`}
            </h2>
            <p className="text-muted-foreground mb-6">
              {filterStatus === "all"
                ? "Start adding games to track your gaming journey!"
                : "Try selecting a different filter or add more games."}
            </p>
            <Button onClick={() => router.push("/")}>Browse Games</Button>
          </div>
        </Card>
      )}

      {/* Games Grid */}
      {entriesArray.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {entriesArray.map((entry) => (
            <CollectionGameCard
              key={entry.gameExternalId}
              gameId={entry.gameExternalId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
