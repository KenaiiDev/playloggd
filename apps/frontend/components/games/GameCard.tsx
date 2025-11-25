"use client";

import { Card, CardContent, CardHeader, Badge } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import GenresContainer from "./GenresContainer";
import GameActionButtons from "./GameActionButtons";
import { GameStatus, GameStatusEnum } from "@playloggd/domain";
import { useGameCollectionStore } from "@/stores/game-collection-store";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type GameCardProps = {
  gameId: string;
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
  description: string;
  genres: string[];
  recommended?: boolean;
  showActions?: boolean;
};

export function GameCard({
  gameId,
  title,
  rating,
  imageUrl,
  description,
  genres,
  recommended,
  showActions = false,
}: GameCardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { getGameEntry, addGame, updateStatus, removeGame } =
    useGameCollectionStore();

  const currentEntry = getGameEntry(gameId);
  const currentStatus = currentEntry?.status;

  const STATUS_LABELS: Record<string, string> = {
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

  const handleStatusChange = async (status: GameStatus) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      if (currentStatus === status) {
        await removeGame(gameId);
        toast.success(`${title} removed from collection`);
        return;
      }

      if (currentEntry) {
        await updateStatus(gameId, status);
        toast.success(`${title} updated to ${STATUS_LABELS[status]}`);
      } else {
        await addGame(gameId, status);
        toast.success(`${title} added to ${STATUS_LABELS[status]}`);
      }
    } catch (error) {
      console.error("Failed to update game status:", error);
      toast.error("Failed to update game status. Please try again.");
    }
  };
  const shouldShowActions = showActions || isAuthenticated;

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link href={`/games/${gameId}`}>
      <Card className="bg-card cursor-pointer transition hover:scale-105 active:scale-100 text-card-foreground py-0 gap-0 shadow-md w-full h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative group overflow-hidden aspect-3/4">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-t-lg"
            />
            {shouldShowActions && (
              <div
                className="opacity-0 absolute bg-linear-to-b from-transparent via-40% via-black/30 to-black/50 bottom-0 transition-all duration-300 group-hover:opacity-100 group-has-[button[data-state=open]]:opacity-100 w-full p-1"
                onClick={handleOverlayClick}
              >
                <GameActionButtons
                  currentStatus={currentStatus}
                  onStatusChange={handleStatusChange}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
            </div>
            <Badge
              variant={
                rating < 4 ? "destructive" : rating < 7 ? "warning" : "success"
              }
              className="shrink-0 ml-2"
            >
              {rating.toFixed(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
          <div className="mt-auto">
            <GenresContainer genres={genres} />
            {recommended && (
              <Badge
                variant="default"
                className="w-fit bg-primary text-primary-foreground mt-2"
              >
                Recommended
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
