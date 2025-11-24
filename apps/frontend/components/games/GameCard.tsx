import { Card, CardContent, CardHeader, Badge } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import GenresContainer from "./GenresContainer";
import GameActionButtons from "./GameActionButtons";
import { GameStatus } from "@playloggd/domain";

type GameCardProps = {
  gameId: string;
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
  description: string;
  genres: string[];
  currentStatus?: GameStatus;
  recommended?: boolean;
  onStatusChange?: (status: GameStatus) => void;
};

export function GameCard({
  gameId,
  title,
  rating,
  imageUrl,
  description,
  genres,
  currentStatus,
  recommended,

  onStatusChange,
}: GameCardProps) {
  return (
    <Link href={`/games/${gameId}`}>
      <Card className="bg-card cursor-pointer transition hover:scale-105 active:scale-100 text-card-foreground py-0 gap-0 shadow-md w-full">
        <CardHeader className="p-0">
          <div className="relative group overflow-hidden aspect-3/4">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-t-lg"
            />
            {onStatusChange && (
              <div className="opacity-0 absolute bg-linear-to-b from-transparent via-40% via-black/30 to-black/50 bottom-0 transition-all duration-300 group-hover:opacity-100 group-has-[button[data-state=open]]:opacity-100 w-full p-1">
                <GameActionButtons
                  currentStatus={currentStatus}
                  onStatusChange={onStatusChange}
                />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <Badge
              variant={
                rating < 4 ? "destructive" : rating < 7 ? "warning" : "success"
              }
            >
              {rating.toFixed(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
          <GenresContainer genres={genres} />
          {recommended && (
            <Badge
              variant="default"
              className="w-fit bg-primary text-primary-foreground"
            >
              Recommended
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
