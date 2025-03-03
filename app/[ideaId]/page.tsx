"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Maximize, Minimize } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Idea } from "@/lib/types";

export default function IdeaPage() {
  const params = useParams();
  const ideaId = params.ideaId as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullPrompt, setShowFullPrompt] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const ideaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`/api/ideas/${ideaId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Idea not found");
          } else {
            setError("Failed to load idea");
          }
          return;
        }

        const data = await response.json();
        setIdea(data.idea);
      } catch (err) {
        console.error("Error fetching idea:", err);
        setError("An error occurred while loading the idea");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId]);

  useEffect(() => {
    if (!isLoading && idea && iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [isLoading, idea]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleTogglePrompt = () => {
    setShowFullPrompt(prev => !prev);
  };

  const handleToggleFullscreen = () => {
    if (!ideaContainerRef.current) return;

    if (!document.fullscreenElement) {
      ideaContainerRef.current
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true);
          if (iframeRef.current) {
            iframeRef.current.focus();
          }
        })
        .catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false);
          if (iframeRef.current) {
            iframeRef.current.focus();
          }
        })
        .catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ideas
          </Button>
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
          <p className="mb-6">{error || "Sorry, we couldn't find the idea you're looking for."}</p>
          <Link href="/">
            <Button>Return to Idea Generator</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ideas
        </Button>
      </Link>

      <h1 className="text-2xl font-bold mb-4">{idea.name}</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">About this idea</h2>
        <p className="text-muted-foreground">
          <b>Prompt:</b> {showFullPrompt ? idea.prompt : truncateText(idea.prompt, 100)}
          {idea.prompt.length > 100 && (
            <Button
              variant="link"
              size="sm"
              onClick={handleTogglePrompt}
              className="ml-1 p-0 h-auto text-primary"
            >
              {showFullPrompt ? "Show less" : "Show more"}
            </Button>
          )}
        </p>
        <p className="text-muted-foreground">
          <b>Model:</b> {idea.model}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Created on {new Date(idea.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div
        className="bg-background border rounded-lg p-4 mb-6 h-[800px] relative"
        ref={ideaContainerRef}
      >
        <Button
          variant="outline"
          size="icon"
          className="absolute top-6 right-6 z-10 bg-background/80 backdrop-blur-sm"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
        <iframe
          ref={iframeRef}
          src={`/ideas/${ideaId}/idea.html`}
          className="w-full h-full"
          title={idea.name}
          style={{ border: "none" }}
          tabIndex={0}
        />
      </div>
    </div>
  );
}
