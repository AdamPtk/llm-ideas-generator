import OpenAI from "openai";
import { NextResponse } from "next/server";

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

    const systemPrompt = `You are a frontend developer specializing in creating HTML5, CSS and JavaScript users ideas. 
    Create a complete idea based on the user's prompt.
    
    Your response must include:
    1. A descriptive, short name for the idea
    2. Complete, self-contained HTML that includes all necessary CSS and JavaScript
    
    Guidelines:
    - DO NOT include any text or instructions in the "html" field
    - "name" must be a short, max 4 words description of the idea
    - The idea must be fully functional and responsive
    - Include all CSS styles inline within a <style> tag
    - Include all JavaScript within a <script> tag
    - Make the idea responsive and fit within its container
    - Use vanilla JavaScript (no external libraries)
    - Ensure the idea has clear instructions
    - Add appropriate keyboard/touch controls when appropriate
    - Include a scoring system when appropriate
    - Make sure the idea is contained within its HTML elements and doesn't affect the rest of the page
    
    Return your response as a JSON object with the following structure:
    {
      "name": "idea Name",
      "html": "Complete HTML including CSS and JavaScript"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const text = response.choices[0].message.content || "";

    try {
      const ideaData = JSON.parse(text);
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
