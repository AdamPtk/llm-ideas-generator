import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { Idea } from "@/lib/types";

const ideasDir = path.join(process.cwd(), "public", "ideas");
if (!fs.existsSync(ideasDir)) {
  fs.mkdirSync(ideasDir, { recursive: true });
}

export async function GET() {
  try {
    const indexPath = path.join(ideasDir, "index.json");
    if (!fs.existsSync(indexPath)) {
      return NextResponse.json({ ideas: [] });
    }

    const indexData = fs.readFileSync(indexPath, "utf-8");
    const ideas = JSON.parse(indexData);

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error retrieving ideas:", error);
    return NextResponse.json({ error: "Failed to retrieve ideas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const idea = (await req.json()) as Idea;

    if (!idea.id || !idea.name || !idea.html) {
      return NextResponse.json({ error: "Invalid idea data" }, { status: 400 });
    }

    const ideaDir = path.join(ideasDir, idea.id);
    if (!fs.existsSync(ideaDir)) {
      fs.mkdirSync(ideaDir, { recursive: true });
    }

    const htmlPath = path.join(ideaDir, "idea.html");
    fs.writeFileSync(htmlPath, idea.html);

    const metaPath = path.join(ideaDir, "meta.json");
    const metadata = {
      id: idea.id,
      name: idea.name,
      prompt: idea.prompt,
      model: idea.model,
      createdAt: idea.createdAt,
    };
    fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

    const indexPath = path.join(ideasDir, "index.json");
    let ideas: Idea[] = [];

    if (fs.existsSync(indexPath)) {
      const indexData = fs.readFileSync(indexPath, "utf-8");
      ideas = JSON.parse(indexData);
    }

    ideas = ideas.filter(i => i.id !== idea.id);

    ideas.unshift({
      id: idea.id,
      name: idea.name,
      prompt: idea.prompt,
      model: idea.model,
      createdAt: idea.createdAt,
      html: "",
    });

    fs.writeFileSync(indexPath, JSON.stringify(ideas, null, 2));

    return NextResponse.json({ success: true, ideaId: idea.id });
  } catch (error) {
    console.error("Error saving idea:", error);
    return NextResponse.json({ error: "Failed to save idea" }, { status: 500 });
  }
}
