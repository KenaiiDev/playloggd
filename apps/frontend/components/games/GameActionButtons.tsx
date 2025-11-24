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

import { GAME_STATUS, GameStatusEnum } from "@/types";

interface GameActionButtonsProps {
  currentStatus?: GameStatusEnum;

  onStatusChange?: (status: GameStatusEnum) => void;
}

const STATUS_LABELS = {
  [GAME_STATUS.WISHLIST]: "Want to Play",
  [GAME_STATUS.BACKLOG]: "Backlog",
  [GAME_STATUS.PLAYING]: "Currently Playing",
  [GAME_STATUS.ON_HOLD]: "On Hold",
  [GAME_STATUS.COMPLETED]: "Completed",
  [GAME_STATUS.FULLY_COMPLETED]: "100% Completed",
  [GAME_STATUS.DROPPED]: "Dropped",
  [GAME_STATUS.NOT_FOR_ME]: "Not for Me",
  [GAME_STATUS.REPLAY]: "Replaying",
  [GAME_STATUS.REVIEWING]: "Reviewing",
} as const;

const STATUS_GROUPS = {
  planning: [GAME_STATUS.WISHLIST, GAME_STATUS.BACKLOG],
  active: [GAME_STATUS.PLAYING, GAME_STATUS.ON_HOLD],
  finished: [GAME_STATUS.COMPLETED, GAME_STATUS.FULLY_COMPLETED],
  abandoned: [GAME_STATUS.DROPPED, GAME_STATUS.NOT_FOR_ME],
  special: [GAME_STATUS.REPLAY, GAME_STATUS.REVIEWING],
} as const;

export default function GameActionButtons({
  currentStatus,
  onStatusChange,
}: GameActionButtonsProps) {
  return (
    <div className="flex rounded-lg w-fit mx-auto px-3 py-1.5 justify-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white bg-white/10 hover:bg-white/20 hover:text-primary cursor-pointer"
          >
            <Gamepad2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56">
          <DropdownMenuRadioGroup
            value={currentStatus}
            onValueChange={(value) => onStatusChange?.(value as GameStatusEnum)}
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
