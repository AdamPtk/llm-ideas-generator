import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface IdeaCardProps {
  idea: Idea & { new?: boolean };
}

const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <Link href={`/${idea.id}`}>
      <Card
        className={cn(
          "h-full cursor-pointer hover:shadow-md transition-shadow duration-300 flex flex-col relative",
          idea.new && "animate-pulse-subtle border-primary/40"
        )}
      >
        {idea.new && (
          <Badge
            className="absolute top-3 right-3 bg-gradient-to-r from-primary to-[hsl(var(--chart-2))] text-white shadow-sm z-10 transition-all duration-300"
            aria-label="New idea"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        )}
        <CardHeader>
          <CardTitle className="transition-all duration-300">{idea.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            <b>Prompt:</b> {idea.prompt}
          </p>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
            <b>Model:</b> {idea.model}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Created {new Date(idea.createdAt).toLocaleDateString()}
          </p>
          {idea.usage && (
            <p className="text-xs text-muted-foreground">Tokens used: {idea.usage?.total_tokens}</p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default IdeaCard;
