import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import { Idea } from "@/lib/types";

export async function GET(req: Request, { params }: { params: { ideaId: string } }) {
  try {
    const ideaId = params.ideaId;
    const ideaDir = path.join(process.cwd(), "public", "ideas", ideaId);

    // Check if the idea directory exists
    if (!fs.existsSync(ideaDir)) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    // Read the metadata file
    const metaPath = path.join(ideaDir, "meta.json");
    if (!fs.existsSync(metaPath)) {
      return NextResponse.json({ error: "Idea metadata not found" }, { status: 404 });
    }

    const metaData = fs.readFileSync(metaPath, "utf-8");
    const metadata = JSON.parse(metaData);

    // Read the HTML file
    const htmlPath = path.join(ideaDir, "idea.html");
    if (!fs.existsSync(htmlPath)) {
      return NextResponse.json({ error: "Idea HTML not found" }, { status: 404 });
    }

    const html = fs.readFileSync(htmlPath, "utf-8");

    // Combine metadata and HTML
    const idea: Idea = {
      ...metadata,
      html,
    };

    return NextResponse.json({ idea });
  } catch (error) {
    console.error("Error retrieving idea:", error);
    return NextResponse.json({ error: "Failed to retrieve idea" }, { status: 500 });
  }
}
