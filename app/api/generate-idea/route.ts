import OpenAI from "openai";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { prompt as generateIdeaPrompt } from "@/app/api/generate-idea/lib/generateIdeaPrompt";
import { AIModel, getAIModelConfig } from "@/lib/config/ai-models";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const SDK_CLIENTS = {
  openai,
  deepseek,
} as const;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const { prompt, model }: { prompt: string; model: AIModel } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    const modelConfig = getAIModelConfig(model);
    const apiKey = process.env[modelConfig.apiKeyEnv];

    if (!apiKey) {
      return NextResponse.json(
        { error: `${modelConfig.displayName} API key not configured` },
        { status: 500 }
      );
    }

    let ideaText: string;

    if (modelConfig.useSDK) {
      const client = SDK_CLIENTS[modelConfig.provider as keyof typeof SDK_CLIENTS];

      const completion = await client.chat.completions.create(
        modelConfig.body(model, prompt, generateIdeaPrompt) as any
      );
      ideaText = completion.choices[0].message.content || "";
    } else {
      const response = await fetch(modelConfig.baseEndpoint, {
        method: "POST",
        headers: modelConfig.headers(apiKey),
        body: JSON.stringify(modelConfig.body(model, prompt, generateIdeaPrompt)),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate idea with ${modelConfig.displayName}`);
      }

      const data = await response.json();
      ideaText = modelConfig.responseParser(data);
    }

    try {
      const ideaData = JSON.parse(ideaText);
      console.log("ideaData", ideaData);
      return NextResponse.json(ideaData);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return NextResponse.json({ error: "Failed to parse idea data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error generating idea:", error);
    return NextResponse.json({ error: "Failed to generate idea" }, { status: 500 });
  }
}
