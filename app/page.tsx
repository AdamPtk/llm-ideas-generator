"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Game } from "@/lib/types";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("/api/games");
        if (response.ok) {
          const data = await response.json();
          setGames(data.games || []);
        }
      } catch (error) {
        console.error("Error loading games:", error);
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate game");
      }

      const data = await response.json();

      const newGame: Game = {
        id: uuidv4(),
        name: data.name,
        prompt,
        model: "gpt-4o",
        html: data.html,
        createdAt: Date.now(),
      };

      const saveResponse = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save game");
      }

      setGames(prevGames => [newGame, ...prevGames]);
      setPrompt("");
    } catch (error) {
      console.error("Error generating game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Games Generator</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate a Game</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea
              placeholder="Describe the game you want to create... (e.g., 'Create a snake game where the snake is blue and the food is red')"
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
                  Generating Game...
                </>
              ) : (
                "Generate Game"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Games</h2>
      {/* TODO: Filter games by model */}
      {isLoadingGames ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Loading games...</p>
          </div>
        </div>
      ) : games.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No games generated yet. Create your first game above!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map(game => (
            <Link href={`/${game.id}`} key={game.id}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{game.name}</CardTitle>
                </CardHeader>
                {/* TODO: Add thumbnail */}
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    <b>Prompt:</b> {game.prompt}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    <b>Model:</b> {game.model}
                  </p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(game.createdAt).toLocaleDateString()}
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
