import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface TooltipButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  tooltipText: string;
  ariaLabel: string;
  successText?: string;
  isSuccess?: boolean;
}

export const TooltipButton = ({
  icon: Icon,
  onClick,
  tooltipText,
  ariaLabel,
  successText,
  isSuccess,
}: TooltipButtonProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setOpen(true);
      const timer = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <TooltipProvider>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            aria-label={ariaLabel}
            className="transition-all duration-200"
          >
            <Icon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">{isSuccess ? successText : tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
