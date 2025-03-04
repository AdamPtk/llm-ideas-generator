import React, { useState, useEffect } from "react";
import { Info, Copy, Download, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipButton } from "@/components/tooltip-button";

import { Idea } from "@/lib/types";

interface IdeaHtmlProps {
  idea: Idea;
  onHtmlChange: (html: string) => void;
}

export const IdeaHtml = ({ idea, onHtmlChange }: IdeaHtmlProps) => {
  const [htmlContent, setHtmlContent] = useState(idea.html);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${idea.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                  Beta version. Any changes you make to the code won't be saved. You can <b>copy</b>{" "}
                  or <b>download</b> the code though.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <TooltipButton
            icon={Copy}
            onClick={handleCopy}
            tooltipText="Copy code"
            ariaLabel="Copy code"
            successText="Copied!"
            isSuccess={copySuccess}
          />
          <TooltipButton
            icon={Download}
            onClick={handleDownload}
            tooltipText="Download code"
            ariaLabel="Download code"
          />
          <TooltipButton
            icon={isExpanded ? Minimize2 : Maximize2}
            onClick={handleToggleExpand}
            tooltipText={isExpanded ? "Collapse" : "Expand"}
            ariaLabel={isExpanded ? "Collapse editor" : "Expand editor"}
          />
        </div>
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
