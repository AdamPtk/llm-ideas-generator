import { Idea } from "@/lib/types";
import IdeaCard from "./IdeaCard";

interface IdeasGridProps {
  ideas: Idea[];
  isLoading: boolean;
}

const IdeasGrid = ({ ideas, isLoading }: IdeasGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading ideas...</p>
        </div>
      </div>
    );
  }

  if (ideas.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No ideas generated yet. Create your first idea above!
      </p>
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
