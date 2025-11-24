import { useState } from "react";
import { GenreBadge } from "./GenreBadge";
import { Button } from "@/components/ui";

interface GenresContainerProps {
  genres: string[];
}

export default function GenresContainer({ genres }: GenresContainerProps) {
  const [isActive, setIsActive] = useState(false);

  console.log({ genres, isActive });
  console.log(genres.length <= 3);

  if (genres.length <= 3)
    return (
      <div className="w-full flex flex-wrap items-start gap-2">
        {genres &&
          genres.map((genre) => <GenreBadge key={genre} genre={genre} />)}
      </div>
    );

  return (
    <div className="w-full h-auto flex-wrap items-center flex gap-2 ">
      {!isActive ? (
        <>
          <GenreBadge genre={genres[0]} />
          <GenreBadge genre={genres[1]} />
          <GenreBadge genre={genres[2]} />
        </>
      ) : (
        genres.map((genre) => <GenreBadge key={genre} genre={genre} />)
      )}
      <Button
        variant="ghost"
        className="inline-flex items-center justify-center h-auto rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground bg-accent cursor-pointer"
        onClick={() => setIsActive((prev) => !prev)}
      >
        {isActive ? "-" : "+"}{" "}
      </Button>
    </div>
  );
}
