import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ClerkLoaded, ClerkLoading, SignInButton, useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

interface IdeaFormProps {
  onSubmit: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const IdeaForm = ({ onSubmit, isLoading }: IdeaFormProps) => {
  const [prompt, setPrompt] = useState("");
  const { isSignedIn } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !isSignedIn) return;
    await onSubmit(prompt);
    setPrompt("");
  };

  return (
    <Card className="mb-8">
      <form onSubmit={handleSubmit}>
        <ClerkLoading>
          <CardContent>
            <Skeleton className="h-36 w-full mt-8" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </ClerkLoading>
        <ClerkLoaded>
          <CardContent className="mt-8">
            {!isSignedIn ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sign in to Generate Ideas</h3>
                <p className="text-muted-foreground mb-6">
                  Create an account to start generating your ideas with AI
                </p>
                <SignInButton mode="modal">
                  <Button size="lg" className="w-full sm:w-auto">
                    Sign in to Continue
                  </Button>
                </SignInButton>
              </div>
            ) : (
              <Textarea
                placeholder="What's on your mind? (e.g., 'Create a snake game where the snake is blue and the food is red')"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="min-h-36"
                disabled={isLoading}
              />
            )}
          </CardContent>
          <CardFooter>
            {isSignedIn && (
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
            )}
          </CardFooter>
        </ClerkLoaded>
      </form>
    </Card>
  );
};

export default IdeaForm;
