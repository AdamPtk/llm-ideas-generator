import { Loader2, Sparkles } from "lucide-react";
import { ClerkLoaded, ClerkLoading, SignInButton, useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card className="mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <ClerkLoading>
            <CardContent className="mt-8 space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-36 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </ClerkLoading>
          <ClerkLoaded>
            <CardContent className="mt-8 space-y-6">
              {!isSignedIn ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Sparkles className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sign in to Generate Ideas</h3>
                  <p className="text-muted-foreground mb-6">
                    Create an account to start generating your ideas with AI
                  </p>
                  <SignInButton mode="modal">
                    <Button size="lg" className="w-full sm:w-auto">
                      Sign in to Continue
                    </Button>
                  </SignInButton>
                </div>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="model"
                    defaultValue={AI_MODELS[0].id}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {AI_MODELS.map(model => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.displayName}
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
                            placeholder="What's on your mind? (e.g., 'Create a snake game where the snake is blue and the food is red')"
                            className="min-h-36"
                            disabled={isLoading}
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
                  type="submit"
                  disabled={isLoading || form.getValues("prompt") === ""}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Idea...
                    </>
                  ) : (
                    "Generate Idea"
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
