"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Idea } from "@/lib/types";
import { LoadingState } from "./components/loading-state";
import { ErrorState } from "./components/error-state";
import { IdeaDetails } from "./components/idea-details";
import { IdeaPreview } from "./components/idea-preview";
import { IdeaHtml } from "./components/idea-html";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipButton } from "@/components/tooltip-button";

export default function IdeaPage() {
  const params = useParams();
  const ideaId = params.ideaId as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);

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

  const handleHtmlChange = (newHtml: string) => {
    if (idea) {
      setIdea({ ...idea, html: newHtml });
    }
  };

  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);

      setTimeout(() => {
        setIsShared(false);
      }, 2000);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !idea) {
    return <ErrorState error={error || ""} />;
  }

  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="mb-8 group hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Ideas
          </Button>
        </Link>

        <Card className="mb-8 border border-border/50 overflow-hidden relative backdrop-blur-[2px]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h1 className="text-2xl font-bold text-primary">{idea.name}</h1>
            <TooltipButton
              icon={Share2}
              onClick={handleShareClick}
              tooltipText="Copy link to clipboard"
              ariaLabel="Share idea"
              successText="Link copied!"
              isSuccess={isShared}
              className="hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-300"
            />
          </CardHeader>
          <CardContent>
            <IdeaDetails idea={idea} />
          </CardContent>
        </Card>

        <IdeaPreview idea={idea} ideaId={ideaId} />
        <IdeaHtml idea={idea} onHtmlChange={handleHtmlChange} />
      </div>
    </div>
  );
}
