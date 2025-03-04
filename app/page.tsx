"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";

import { Idea } from "@/lib/types";
import LoadingOverlay from "@/app/components/loading-overlay";
import IdeaForm from "@/app/components/idea-form";
import IdeasGrid from "@/app/components/idea-grid";

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const { user } = useUser();

  console.log(user);

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

  const handleSubmit = async (prompt: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate idea");
      }

      const data = await response.json();

      const newIdea: Idea = {
        id: uuidv4(),
        userId: user?.id || "",
        name: data.name,
        prompt,
        model: "gpt-4o",
        html: data.html,
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

      setIdeas(prevIdeas => [newIdea, ...prevIdeas]);
    } catch (error) {
      console.error("Error generating idea:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <LoadingOverlay isLoading={isLoading} />

      <h1 className="text-3xl font-bold text-center mb-4">Ideas Generator</h1>
      <p className="text-lg text-center text-muted-foreground mb-8">
        Created to explore, aggregate and compare constantly improving new Large Language Models
        possibilities.
      </p>

      <IdeaForm onSubmit={handleSubmit} isLoading={isLoading} />

      <h2 className="text-2xl font-bold mb-4">Results</h2>
      <IdeasGrid ideas={ideas} isLoading={isLoadingIdeas} />
    </main>
  );
}
