import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Idea } from "@/lib/types";

interface IdeaHeaderProps {
  idea: Idea;
}

export const IdeaHeader = ({ idea }: IdeaHeaderProps) => {
  return (
    <>
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ideas
        </Button>
      </Link>
      <h1 className="text-2xl font-bold mb-4">{idea.name}</h1>
    </>
  );
};
