import React from "react";

export const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading idea...</p>
      </div>
    </div>
  );
};
