import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  error: string;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ideas
        </Button>
      </Link>
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
        <p className="mb-6">{error || "Sorry, we couldn't find the idea you're looking for."}</p>
        <Link href="/">
          <Button>Return to Idea Generator</Button>
        </Link>
      </div>
    </div>
  );
};
