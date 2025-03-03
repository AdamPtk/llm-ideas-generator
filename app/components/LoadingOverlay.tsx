import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const loadingMessages = [
  "Brewing creative ideas...",
  "Exploring possibilities...",
  "Assembling the pieces...",
  "Making it awesome...",
  "Almost there...",
];

interface LoadingOverlayProps {
  isLoading: boolean;
}

const LoadingOverlay = ({ isLoading }: LoadingOverlayProps) => {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
      }, 4000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      setLoadingMessageIndex(0);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <div className="relative mt-4 h-[28px] w-[280px] mx-auto">
          {loadingMessages.map((message, index) => (
            <p
              key={index}
              className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center font-semibold ${
                loadingMessageIndex === index ? "opacity-100" : "opacity-0"
              }`}
            >
              {message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
