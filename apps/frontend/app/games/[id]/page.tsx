"use client";

import { useParams, useRouter } from "next/navigation";
import { useGame } from "@/lib/hooks/use-games";
import { useAuthStore } from "@/stores/auth-store";
import { useGameCollectionStore } from "@/stores/game-collection-store";
import {
  Alert,
  AlertDescription,
  Skeleton,
  Badge,
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui";
import { ArrowLeft, Calendar, Star, Plus } from "lucide-react";
import Image from "next/image";
import { GameStatusEnum, type GameStatus } from "@playloggd/domain";
import { toast } from "sonner";

export default function GameDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const { data: game, isLoading, error } = useGame(gameId);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { getGameEntry, addGame, updateStatus, removeGame } =
    useGameCollectionStore();

  const currentStatus = getGameEntry(gameId)?.status ?? null;

  const handleStatusChange = async (status: GameStatus) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      if (currentStatus === status) {
        await removeGame(gameId);
        toast.success("Game removed from collection");
        return;
      }

      const existingEntry = getGameEntry(gameId);

      if (existingEntry) {
        await updateStatus(gameId, status);
        toast.success(`Status updated to ${STATUS_LABELS[status]}`);
      } else {
        await addGame(gameId, status);
        toast.success(`Added to ${STATUS_LABELS[status]}`);
      }
    } catch (error) {
      console.error("Failed to update game status:", error);
      toast.error("Failed to update game status. Please try again.");
    }
  };

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

  const STATUS_GROUPS = {
    planning: [GameStatusEnum.WISHLIST, GameStatusEnum.BACKLOG],
    active: [GameStatusEnum.PLAYING, GameStatusEnum.ON_HOLD],
    finished: [GameStatusEnum.COMPLETED, GameStatusEnum.FULLY_COMPLETED],
    abandoned: [GameStatusEnum.DROPPED, GameStatusEnum.NOT_FOR_ME],
    special: [GameStatusEnum.REPLAY, GameStatusEnum.REVIEWING],
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="aspect-3/4 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertDescription>
            Game not found or error loading game details.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const rating = game.rating / 10;
  const releaseYear = game.releaseDate
    ? new Date(game.releaseDate).getFullYear()
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="overflow-hidden p-0">
            <div className="relative aspect-3/4 w-full">
              <Image
                src={game.coverUrl || "/placeholder-game.jpg"}
                alt={game.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Card>

          <Card className="mt-4">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Status
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      {!currentStatus && <Plus className="h-4 w-4" />}
                      {currentStatus
                        ? STATUS_LABELS[currentStatus]
                        : "Add to Collection"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuRadioGroup
                      value={currentStatus || undefined}
                      onValueChange={(value) =>
                        handleStatusChange(value as GameStatus)
                      }
                    >
                      <DropdownMenuLabel>Planning</DropdownMenuLabel>
                      {STATUS_GROUPS.planning.map((status) => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </DropdownMenuRadioItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Active</DropdownMenuLabel>
                      {STATUS_GROUPS.active.map((status) => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </DropdownMenuRadioItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Finished</DropdownMenuLabel>
                      {STATUS_GROUPS.finished.map((status) => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </DropdownMenuRadioItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Abandoned</DropdownMenuLabel>
                      {STATUS_GROUPS.abandoned.map((status) => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </DropdownMenuRadioItem>
                      ))}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Special</DropdownMenuLabel>
                      {STATUS_GROUPS.special.map((status) => (
                        <DropdownMenuRadioItem key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Rating
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{rating.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
              </div>

              {releaseYear && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Release Year
                  </span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">{releaseYear}</span>
                  </div>
                </div>
              )}

              {game.developer && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Developer
                  </span>
                  <span className="text-sm">{game.developer}</span>
                </div>
              )}

              {game.publisher && (
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Publisher
                  </span>
                  <span className="text-sm">{game.publisher}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
            {game.releaseDate && (
              <p className="text-muted-foreground">
                {new Date(game.releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>

          {game.genres && game.genres.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
                GENRES
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {game.platforms && game.platforms.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
                PLATFORMS
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((platform) => (
                  <Badge key={platform} variant="outline">
                    {platform}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {game.description && (
            <div>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground">
                ABOUT
              </h2>
              <p className="text-foreground leading-relaxed">
                {game.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
