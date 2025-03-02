import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { Game } from "@/lib/types";

export async function GET(req: Request, { params }: { params: { gameId: string } }) {
  try {
    const gameId = params.gameId;
    const gameDir = path.join(process.cwd(), "public", "games", gameId);

    // Check if the game directory exists
    if (!fs.existsSync(gameDir)) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Read the metadata file
    const metaPath = path.join(gameDir, "meta.json");
    if (!fs.existsSync(metaPath)) {
      return NextResponse.json({ error: "Game metadata not found" }, { status: 404 });
    }

    const metaData = fs.readFileSync(metaPath, "utf-8");
    const metadata = JSON.parse(metaData);

    // Read the HTML file
    const htmlPath = path.join(gameDir, "game.html");
    if (!fs.existsSync(htmlPath)) {
      return NextResponse.json({ error: "Game HTML not found" }, { status: 404 });
    }

    const html = fs.readFileSync(htmlPath, "utf-8");

    // Combine metadata and HTML
    const game: Game = {
      ...metadata,
      html,
    };

    return NextResponse.json({ game });
  } catch (error) {
    console.error("Error retrieving game:", error);
    return NextResponse.json({ error: "Failed to retrieve game" }, { status: 500 });
  }
}
