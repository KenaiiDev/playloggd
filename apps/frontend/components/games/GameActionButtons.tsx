import { Gamepad2 } from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui";

import { GameStatus, GameStatusEnum } from "@playloggd/domain";

interface GameActionButtonsProps {
  currentStatus?: GameStatus;

  onStatusChange?: (status: GameStatus) => void;
}

const STATUS_LABELS = {
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
} as const;

const STATUS_GROUPS = {
  planning: [GameStatusEnum.WISHLIST, GameStatusEnum.BACKLOG],
  active: [GameStatusEnum.PLAYING, GameStatusEnum.ON_HOLD],
  finished: [GameStatusEnum.COMPLETED, GameStatusEnum.FULLY_COMPLETED],
  abandoned: [GameStatusEnum.DROPPED, GameStatusEnum.NOT_FOR_ME],
  special: [GameStatusEnum.REPLAY, GameStatusEnum.REVIEWING],
} as const;

export default function GameActionButtons({
  currentStatus,
  onStatusChange,
}: GameActionButtonsProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="flex rounded-lg w-fit mx-auto px-3 py-1.5 justify-center gap-2"
      onClick={handleClick}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white bg-white/10 hover:bg-white/20 hover:text-primary cursor-pointer"
            onClick={handleClick}
          >
            <Gamepad2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuRadioGroup
            value={currentStatus}
            onValueChange={(value) => onStatusChange?.(value as GameStatus)}
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
            <DropdownMenuLabel>Other</DropdownMenuLabel>
            {STATUS_GROUPS.abandoned.map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </DropdownMenuRadioItem>
            ))}
            {STATUS_GROUPS.special.map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                {STATUS_LABELS[status]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
