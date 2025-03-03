import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface IdeaFormProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const IdeaForm = ({ onSubmit, isLoading }: IdeaFormProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await onSubmit(prompt);
    setPrompt("");
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit}>
        <CardContent className="mt-8">
          <Textarea
            placeholder="What's on your mind? (e.g., 'Create a snake game where the snake is blue and the food is red')"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            className="min-h-[120px]"
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Idea...
              </>
            ) : (
              "Generate Idea"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default IdeaForm;
