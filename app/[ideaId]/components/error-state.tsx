import React from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="relative min-h-[60vh]">
      {/* Decorative background elements */}
      <div className="absolute top-0 -right-40 h-80 w-80 bg-primary/5 rounded-full blur-3xl -z-10 opacity-70"></div>
      <div className="absolute bottom-40 -left-20 h-60 w-60 bg-[hsl(var(--chart-3))]/5 rounded-full blur-3xl -z-10 opacity-70"></div>

      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="mb-8 group hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Ideas
          </Button>
        </Link>

        <div className="relative text-center mt-12">
          <div className="relative h-16 w-16 mx-auto mb-6">
            <AlertTriangle className="h-16 w-16 text-primary animate-float" />
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl animate-pulse-subtle"></div>
          </div>

          <h1 className="text-2xl font-bold mb-4 text-gradient">Idea Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            {error || "Sorry, we couldn't find the idea you're looking for."}
          </p>

          <Link href="/">
            <Button className="bg-gradient-to-r from-primary to-[hsl(var(--chart-2))] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              Return to Idea Generator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
