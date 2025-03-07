import { Loader2, Sparkles, Zap } from "lucide-react";
import { ClerkLoaded, ClerkLoading, SignInButton, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AIModel, AI_MODELS } from "@/lib/config/ai-models";

const formSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long"),
  model: z.enum(AI_MODELS.map(m => m.id) as [AIModel, ...AIModel[]], {
    message: "Please select a model",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface IdeaFormProps {
  onSubmit: (prompt: string, model: string) => Promise<void>;
  isLoading: boolean;
}

const IdeaForm = ({ onSubmit, isLoading }: IdeaFormProps) => {
  const { isSignedIn } = useUser();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!isSignedIn) return;
    await onSubmit(values.prompt, values.model);
    form.reset();
  };

  return (
    <Card className="mb-8 border border-border/50 overflow-hidden relative w-full">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-gradient">
          <Sparkles className="h-5 w-5 text-primary" />
          Generate New Idea
        </CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <ClerkLoading>
            <CardContent className="mt-6 space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-28 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </ClerkLoading>
          <ClerkLoaded>
            <CardContent className="mt-6 space-y-6">
              {!isSignedIn ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="relative mb-4">
                    <Sparkles className="h-12 w-12 text-primary animate-float" />
                    <div className="absolute top-0 left-0 h-12 w-12 bg-primary/20 rounded-full blur-xl animate-pulse-subtle"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gradient">
                    Sign in to Generate Ideas
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Create an account to start generating your ideas with AI
                  </p>
                  <SignInButton mode="modal">
                    <Button className="bg-gradient-to-r from-primary to-[hsl(var(--chart-2))] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                      Get Started
                    </Button>
                  </SignInButton>
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full border border-border/80 hover:border-primary/50 transition-colors">
                              <SelectValue placeholder="Select an AI model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AI_MODELS.map(model => (
                              <SelectItem
                                key={model.id}
                                value={model.id}
                                className="cursor-pointer hover:bg-primary/5"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{model.displayName}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            disabled={isLoading}
                            placeholder="Describe your idea... (e.g. 'An app that helps people find hiking trails')"
                            className="resize-none h-32 border border-border/80 hover:border-primary/50 focus:border-primary transition-colors"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
            <CardFooter>
              {isSignedIn && (
                <Button
                  disabled={isLoading || !form.formState.isValid}
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-[hsl(var(--chart-2))] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" /> Generate Idea
                    </div>
                  )}
                </Button>
              )}
            </CardFooter>
          </ClerkLoaded>
        </form>
      </Form>
    </Card>
  );
};

export default IdeaForm;
