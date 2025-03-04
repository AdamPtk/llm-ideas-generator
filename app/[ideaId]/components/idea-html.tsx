import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IdeaHtmlProps {
  idea: Idea;
  onHtmlChange: (html: string) => void;
}

export const IdeaHtml = ({ idea, onHtmlChange }: IdeaHtmlProps) => {
  const [htmlContent, setHtmlContent] = useState(idea.html);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setHtmlContent(idea.html);
  }, [idea.html]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlContent(newHtml);
    onHtmlChange(newHtml);
  };

  const handleToggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex gap-2">
          <CardTitle>Play with the code below</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3 w-3 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="text-xs">
                  Beta version. Any changes you make to the code won't be saved.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleExpand}
          aria-label={isExpanded ? "Collapse editor" : "Expand editor"}
          className="transition-all duration-200"
        >
          {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <textarea
            value={htmlContent}
            onChange={handleChange}
            className={`p-4 w-full bg-[#1e1e1e] text-gray-300 font-mono text-sm rounded-lg overflow-x-auto resize-none focus:outline-none transition-all duration-200 ${
              isExpanded ? "h-[80vh]" : "h-[400px]"
            }`}
            spellCheck="false"
          />
        </div>
      </CardContent>
    </Card>
  );
};
