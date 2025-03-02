import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { Game } from "@/lib/types";

const gamesDir = path.join(process.cwd(), "public", "games");
if (!fs.existsSync(gamesDir)) {
  fs.mkdirSync(gamesDir, { recursive: true });
}

export async function GET() {
  try {
    const indexPath = path.join(gamesDir, "index.json");
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ games: [] });
    }

    const indexData = fs.readFileSync(indexPath, "utf-8");
    const games = JSON.parse(indexData);

    return NextResponse.json({ games });
  } catch (error) {
    console.error("Error retrieving games:", error);
    return NextResponse.json({ error: "Failed to retrieve games" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const game = (await req.json()) as Game;

    if (!game.id || !game.name || !game.html) {
      return NextResponse.json({ error: "Invalid game data" }, { status: 400 });
    }

    const gameDir = path.join(gamesDir, game.id);
    if (!fs.existsSync(gameDir)) {
      fs.mkdirSync(gameDir, { recursive: true });
    }

    const htmlPath = path.join(gameDir, "game.html");
    fs.writeFileSync(htmlPath, game.html);

    const metaPath = path.join(gameDir, "meta.json");
    const metadata = {
      id: game.id,
      name: game.name,
      prompt: game.prompt,
      model: game.model,
      createdAt: game.createdAt,
    };
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

    const indexPath = path.join(gamesDir, "index.json");
    let games: Game[] = [];

    if (fs.existsSync(indexPath)) {
      const indexData = fs.readFileSync(indexPath, "utf-8");
      games = JSON.parse(indexData);
    }

    games = games.filter(g => g.id !== game.id);

    games.unshift({
      id: game.id,
      name: game.name,
      prompt: game.prompt,
      model: game.model,
      createdAt: game.createdAt,
      html: "",
    });

    fs.writeFileSync(indexPath, JSON.stringify(games, null, 2));

    return NextResponse.json({ success: true, gameId: game.id });
  } catch (error) {
    console.error("Error saving game:", error);
    return NextResponse.json({ error: "Failed to save game" }, { status: 500 });
  }
}
