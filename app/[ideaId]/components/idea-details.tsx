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

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="mb-4">
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
      <p className="text-muted-foreground mt-2">
        <b>Model:</b> {idea.model}
      </p>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Created on {new Date(idea.createdAt).toLocaleDateString()}
        </p>
        {idea.usage && (
          <div className="text-sm text-muted-foreground flex items-center gap-3">
            <span title="Input tokens">
              <span>Tokens used:</span>
            </span>
            <span title="Input tokens">
              <span className="font-medium">{formatNumber(idea.usage.input_tokens)}</span> in
            </span>
            <span className="text-muted-foreground">|</span>
            <span title="Output tokens">
              <span className="font-medium">{formatNumber(idea.usage.output_tokens)}</span> out
            </span>
            <span className="text-muted-foreground">|</span>
            <span title="Total tokens used">
              <span className="font-medium">{formatNumber(idea.usage.total_tokens)}</span> total
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
