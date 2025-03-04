import React, { useRef, useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Idea } from "@/lib/types";

interface IdeaPreviewProps {
  idea: Idea;
  ideaId: string;
}

export const IdeaPreview = ({ idea, ideaId }: IdeaPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ideaContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, []);

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

  return (
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
        src={`data:text/html;charset=utf-8,${encodeURIComponent(idea.html)}`}
        className="w-full h-full"
        title={idea.name}
        style={{ border: "none" }}
        tabIndex={0}
      />
    </div>
  );
};
