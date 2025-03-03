"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Idea } from "@/lib/types";

const loadingMessages = [
  "Brewing creative ideas...",
  "Exploring possibilities...",
  "Assembling the pieces...",
  "Making it awesome...",
  "Almost there...",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 4000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      setLoadingMessageIndex(0);
    };
  }, [isLoading]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

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
        name: data.name,
        prompt,
        model: "gpt-4o",
        html: data.html,
        createdAt: Date.now(),
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
      setPrompt("");
    } catch (error) {
      console.error("Error generating idea:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <div className="relative mt-4 h-[28px] w-[280px] mx-auto">
              {loadingMessages.map((message, index) => (
                <p
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center font-semibold ${
                    loadingMessageIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold text-center mb-4">Ideas Generator</h1>
      <p className="text-lg text-center text-muted-foreground mb-8">
        Created to explore, compare and agregate constantly improving Large Language Models
        possibilities.
      </p>

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
            {/* TODO: Add a dropdown for models */}
            {/* TODO: Add validation for the prompt */}
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

      <h2 className="text-2xl font-bold mb-4">Results</h2>
      {/* TODO: Filter ideas by model */}
      {isLoadingIdeas ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Loading ideas...</p>
          </div>
        </div>
      ) : ideas.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No ideas generated yet. Create your first idea above!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas.map(idea => (
            <Link href={`/${idea.id}`} key={idea.id}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{idea.name}</CardTitle>
                </CardHeader>
                {/* TODO: Add thumbnail */}
                <CardContent>
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
          ))}
        </div>
      )}
    </main>
  );
}
