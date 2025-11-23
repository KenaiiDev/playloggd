import { Card, CardContent, CardHeader, Badge, Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { GenreBadge } from "./GenreBadge";
import GenresContainer from "./GenresContainer";
import { Gamepad2, Heart, MoreHorizontal } from "lucide-react";
import GameActionButtons from "./GameActionButtons";
import { GAME_STATUS, GameStatusEnum } from "@/types";

type GameCardProps = {
  title: string;
  genre: string;
  rating: number;
  imageUrl: string;
  description: string;
  recommended: boolean;
  genres: string[];
  currentStatus: GameStatusEnum;

  onStatusChange?: (status: GameStatusEnum) => void;
  onCreateNewList: (name: string) => void;
};

export function GameCard({
  title,
  rating,
  imageUrl,
  description,
  genres,
  recommended,
  currentStatus,

  onStatusChange,
}: GameCardProps) {
  return (
    <Card className="bg-card text-card-foreground py-0 gap-0 shadow-md w-full max-w-xs">
      <CardHeader className="p-0">
        <div className="relative group overflow-hidden aspect-3/4">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="opacity-0 absolute bg-linear-to-b from-transparent via-40% via-black/30 to-black/50 bottom-0 transition-all duration-300 group-hover:opacity-100 group-has-[button[data-state=open]]:opacity-100 w-full p-1">
            <GameActionButtons
              currentStatus={currentStatus}
              onStatusChange={onStatusChange}
            />
          </div>
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
  );
}
