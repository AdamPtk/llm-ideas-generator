import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Idea from "@/lib/models/Idea";

export async function GET() {
  try {
    await connectDB();
    const ideas = await Idea.find().sort({ createdAt: -1 });
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error retrieving ideas:", error);
    return NextResponse.json({ error: "Failed to retrieve ideas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const idea = await req.json();

    if (!idea.id || !idea.name || !idea.html) {
      return NextResponse.json({ error: "Invalid idea data" }, { status: 400 });
    }

    await connectDB();

    await Idea.deleteOne({ id: idea.id });

    const newIdea = await Idea.create({
      id: idea.id,
      userId: idea.userId,
      name: idea.name,
      prompt: idea.prompt,
      model: idea.model,
      createdAt: idea.createdAt,
      html: idea.html,
    });

    return NextResponse.json({ success: true, ideaId: newIdea.id });
  } catch (error) {
    console.error("Error saving idea:", error);
    return NextResponse.json({ error: "Failed to save idea" }, { status: 500 });
  }
}
