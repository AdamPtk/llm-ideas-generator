import { LightbulbIcon, Loader2 } from "lucide-react";
import { Idea } from "@/lib/types";
import IdeaCard from "./idea-card";

interface IdeasGridProps {
  ideas: (Idea & { new?: boolean })[];
  isLoading: boolean;
}

const IdeasGrid = ({ ideas, isLoading }: IdeasGridProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px] py-8">
        <div className="relative">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <div className="absolute inset-0 h-10 w-10 bg-primary/20 rounded-full blur-xl animate-pulse-subtle"></div>
        </div>
        <p className="mt-4 text-muted-foreground">Loading ideas...</p>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[200px] py-8 text-center">
        <div className="relative mb-4">
          <LightbulbIcon className="h-12 w-12 text-primary animate-float" />
          <div className="absolute inset-0 h-12 w-12 bg-primary/20 rounded-full blur-xl animate-pulse-subtle"></div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gradient">No ideas yet</h3>
        <p className="text-muted-foreground max-w-md">
          Get started by creating your first idea using the form above!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {ideas.map(idea => (
        <IdeaCard key={idea.id} idea={idea} />
      ))}
    </div>
  );
};

export default IdeasGrid;
