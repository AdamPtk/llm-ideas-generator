import React, { useRef, useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Idea } from "@/lib/types";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface IdeaPreviewProps {
  idea: Idea;
  ideaId: string;
}

export const IdeaPreview = ({ idea }: IdeaPreviewProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const ideaContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string>("");
  const debouncedHtml = useDebounce(idea.html, 1000);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  useEffect(() => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    const blob = new Blob([debouncedHtml], { type: "text/html" });
    const newBlobUrl = URL.createObjectURL(blob);
    setBlobUrl(newBlobUrl);

    if (iframeRef.current) {
      iframeRef.current.src = newBlobUrl;
    }
  }, [debouncedHtml]);

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
        src={blobUrl || "about:blank"}
        className="w-full h-full"
        title={idea.name}
        style={{ border: "none" }}
        tabIndex={0}
      />
    </div>
  );
};
