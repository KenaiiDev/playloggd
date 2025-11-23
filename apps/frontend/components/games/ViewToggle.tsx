import { Button } from "@/components/ui";
import { Image as ImageIcon, LayoutList } from "lucide-react";

type ViewToggleProps = {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
};

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        title="Vista de portada"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        title="Vista detallada"
      >
        <LayoutList className="h-4 w-4" />
      </Button>
    </div>
  );
}
