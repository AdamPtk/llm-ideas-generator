import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea } from "@/lib/types";

interface IdeaCardProps {
  idea: Idea;
}

const IdeaCard = ({ idea }: IdeaCardProps) => {
  return (
    <Link href={`/${idea.id}`}>
      <Card className="h-full cursor-pointer hover:shadow-md transition-shadow flex flex-col">
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
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Created {new Date(idea.createdAt).toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default IdeaCard;
