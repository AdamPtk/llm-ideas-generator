import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const loadingMessages = [
  "Brewing creative ideas...",
  "Exploring possibilities...",
  "Assembling the pieces...",
  "Making it awesome...",
  "Almost there...",
  "Some models can take a while to generate...",
  "This might take a few seconds...",
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
      }, 5000);
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
      <div className="text-center max-w-md mx-auto px-6 py-8 rounded-xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[hsl(var(--chart-2))]/20 rounded-full blur-xl"></div>

        <div className="relative">
          <div className="relative h-16 w-16 mx-auto">
            <Sparkles className="h-16 w-16 text-primary animate-float" />
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl animate-pulse-subtle"></div>
          </div>

          <div className="relative w-48 h-10 mt-6">
            {loadingMessages.map((message, index) => (
              <p
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center font-semibold ${
                  loadingMessageIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                {message}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Floating dots */}
      <div className="absolute size-2 rounded-full bg-primary/80 blur-sm animate-float top-1/4 left-1/4"></div>
      <div className="absolute size-3 rounded-full bg-[hsl(var(--chart-2))]/60 blur-sm animate-float top-2/3 right-1/3 animation-delay-500"></div>
      <div className="absolute size-1.5 rounded-full bg-[hsl(var(--chart-3))]/70 blur-sm animate-float bottom-1/3 right-1/4 animation-delay-1000"></div>
      <div className="absolute size-2 rounded-full bg-primary/80 blur-sm animate-float top-1/3 left-3/4"></div>
      <div className="absolute size-3 rounded-full bg-[hsl(var(--chart-2))]/60 blur-sm animate-float top-1/3 right-2/3 animation-delay-500"></div>
      <div className="absolute size-1.5 rounded-full bg-[hsl(var(--chart-3))]/70 blur-sm animate-float bottom-1/4 right-2/3 animation-delay-1000"></div>
    </div>
  );
};

export default LoadingOverlay;
