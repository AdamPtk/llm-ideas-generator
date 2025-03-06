import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Idea } from "@/lib/types";
import { Clock, MessageSquare, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-5 relative">
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Prompt</p>
            <p className="text-muted-foreground">
              {showFullPrompt ? idea.prompt : truncateText(idea.prompt, 100)}
              {idea.prompt.length > 100 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleTogglePrompt}
                  className="ml-1 p-0 h-auto text-primary hover:text-primary/80 hover:no-underline transition-colors"
                >
                  {showFullPrompt ? "Show less" : "Show more"}
                </Button>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Zap className="h-4 w-4 text-[hsl(var(--chart-2))] mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium mb-1">Model</p>
            <Badge
              variant="outline"
              className="bg-[hsl(var(--chart-2))]/5 border-[hsl(var(--chart-2))]/20 text-foreground"
            >
              {idea.model}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Created {new Date(idea.createdAt).toLocaleDateString()}</span>
        </div>

        {idea.usage && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
            <span className="font-medium">Tokens:</span>
            <span title="Input tokens" className="flex items-center">
              <span className="text-foreground font-semibold">
                {formatNumber(idea.usage.input_tokens)}
              </span>
              <span className="ml-1">in</span>
            </span>
            <span className="text-muted-foreground">|</span>
            <span title="Output tokens">
              <span className="text-foreground font-semibold">
                {formatNumber(idea.usage.output_tokens)}
              </span>
              <span className="ml-1">out</span>
            </span>
            <span className="text-muted-foreground">|</span>
            <span title="Total tokens used">
              <span className="text-foreground font-semibold">
                {formatNumber(idea.usage.total_tokens)}
              </span>
              <span className="ml-1">total</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
