import { Badge } from "../ui/badge";

interface GenreBadgeProps {
  genre: string;
}

function GenreBadge({ genre }: GenreBadgeProps) {
  return (
    <Badge variant="outline" className="bg-accent cursor-pointer">
      {genre}
    </Badge>
  );
}

export { GenreBadge };
