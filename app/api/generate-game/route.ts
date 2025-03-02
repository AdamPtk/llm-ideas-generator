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

    // TODO: Validate prompt (is user asking for a game or something else?)

    const systemPrompt = `You are a game developer specializing in creating HTML5 games. 
    Create a complete, playable game based on the user's description.
    
    Your response must include:
    1. A descriptive name for the game
    2. Complete, self-contained HTML that includes all necessary CSS and JavaScript
    
    Guidelines:
    - DO NOT include any text or instructions in the "html" field
    - The game must be fully functional and playable
    - Include all CSS styles inline within a <style> tag
    - Include all JavaScript within a <script> tag
    - Make the game responsive and fit within its container
    - Use vanilla JavaScript (no external libraries)
    - Ensure the game has clear instructions
    - Add appropriate keyboard/touch controls
    - Include a scoring system when appropriate
    - Make sure the game is contained within its HTML elements and doesn't affect the rest of the page
    
    Return your response as a JSON object with the following structure:
    {
      "name": "Game Name",
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
      const gameData = JSON.parse(text);
      return NextResponse.json(gameData);
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return NextResponse.json({ error: "Failed to parse game data" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error generating game:", error);
    return NextResponse.json({ error: "Failed to generate game" }, { status: 500 });
  }
}
