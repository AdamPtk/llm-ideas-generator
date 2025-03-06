import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IdeaCardProps {
  idea: Idea & { new?: boolean };
}

const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <Link href={`/${idea.id}`}>
      <Card
        className={cn(
          "h-full cursor-pointer hover:shadow-md transition-shadow flex flex-col relative",
          idea.new && "animate-pulse-subtle border border-primary/30"
        )}
      >
        {idea.new && (
          <Badge
            className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white"
            aria-label="New idea"
          >
            NEW
          </Badge>
        )}
        <CardHeader>
          <CardTitle>{idea.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            <b>Prompt:</b> {idea.prompt}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-3">
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
