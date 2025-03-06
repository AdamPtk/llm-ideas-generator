"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

import { Idea } from "@/lib/types";
import LoadingOverlay from "@/app/components/loading-overlay";
import IdeaForm from "@/app/components/idea-form";
import IdeasGrid from "@/app/components/idea-grid";
import { AI_MODELS } from "@/lib/config/ai-models";

export default function Home() {
  const [ideas, setIdeas] = useState<(Idea & { new?: boolean })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch("/api/ideas");
        if (response.ok) {
          const data = await response.json();
          setIdeas(data.ideas || []);
        }
      } catch (error) {
        console.error("Error loading ideas:", error);
      } finally {
        setIsLoadingIdeas(false);
      }
    };

    fetchIdeas();
  }, []);

  const handleSubmit = async (prompt: string, model: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, model }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate idea");
      }

      const data = await response.json();

      const newIdea: Idea = {
        id: uuidv4(),
        userId: user?.id || "",
        name: data.ideaData.name,
        prompt,
        usage: data.usage,
        model: AI_MODELS.find(m => m.id === model)?.displayName || model,
        html: data.ideaData.html,
        createdAt: new Date().toISOString(),
      };

      const saveResponse = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIdea),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save idea");
      }

      setIdeas(prevIdeas => [{ ...newIdea, new: true }, ...prevIdeas]);
    } catch (error) {
      console.error("Error generating idea:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative">
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <div className="mx-auto px-4">
        <div className="my-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gradient">
            AI-Powered Ideas Generator
          </h1>
          <p className="text-lg text-muted-foreground text-center mb-2 max-w-3xl mx-auto">
            Transform your concepts into fully fleshed-out ideas with the help of AI. Simply enter a
            prompt and let our AI do the creative work.
          </p>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
            Created to explore, aggregate and compare constantly improving new LLM's possibilities.
          </p>
          <IdeaForm onSubmit={handleSubmit} isLoading={isLoading} />
          <h2 className="text-2xl font-semibold mb-6">Results</h2>
          <IdeasGrid ideas={ideas} isLoading={isLoadingIdeas} />
        </div>
      </div>
    </main>
  );
}
