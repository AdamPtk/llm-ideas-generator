import React from "react";
import { Sparkles } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[60vh] relative">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[hsl(var(--chart-3))]/5 rounded-full blur-3xl opacity-70"></div>

      <div className="relative text-center">
        <div className="relative h-16 w-16 mx-auto">
          <Sparkles className="h-16 w-16 text-primary animate-float" />
          <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl animate-pulse-subtle"></div>
        </div>
        <h2 className="text-xl font-bold text-gradient mb-2">Loading Idea</h2>
        <p className="text-muted-foreground">
          Just a moment while we retrieve your brilliant idea...
        </p>

        {/* Animated loading dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {[1, 2, 3].map(dot => (
            <div
              key={dot}
              className={`h-2 w-2 rounded-full bg-primary animate-pulse-subtle animation-delay-${
                dot * 500
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
