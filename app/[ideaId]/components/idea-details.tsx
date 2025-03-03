import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Idea } from "@/lib/types";

interface IdeaDetailsProps {
  idea: Idea;
}

export const IdeaDetails = ({ idea }: IdeaDetailsProps) => {
  const [showFullPrompt, setShowFullPrompt] = useState(false);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleTogglePrompt = () => {
    setShowFullPrompt(prev => !prev);
  };

  return (
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
  );
};
