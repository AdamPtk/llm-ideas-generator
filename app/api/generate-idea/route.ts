import OpenAI from "openai";
import { NextResponse } from "next/server";
import { prompt as generateIdeaPrompt } from "./lib/generateIdeaPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // TODO: Validate prompt (is user asking for a idea or something else?)

    const ideaResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: generateIdeaPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const ideaText = ideaResponse.choices[0].message.content || "";

    try {
      const ideaData = JSON.parse(ideaText);
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
