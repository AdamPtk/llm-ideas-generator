"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Idea } from "@/lib/types";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { IdeaHeader } from "./components/IdeaHeader";
import { IdeaDetails } from "./components/IdeaDetails";
import { IdeaPreview } from "./components/IdeaPreview";

export default function IdeaPage() {
  const params = useParams();
  const ideaId = params.ideaId as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !idea) {
    return <ErrorState error={error || ""} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <IdeaHeader idea={idea} />
      <IdeaDetails idea={idea} />
      <IdeaPreview idea={idea} ideaId={ideaId} />
    </div>
  );
}
