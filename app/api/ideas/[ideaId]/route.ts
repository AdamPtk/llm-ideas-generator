import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Idea from "@/lib/models/Idea";

export async function GET(req: Request, { params }: { params: { ideaId: string } }) {
  try {
    const ideaId = params.ideaId;
    await connectDB();

    const idea = await Idea.findOne({ id: ideaId });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json({ idea });
  } catch (error) {
    console.error("Error retrieving idea:", error);
    return NextResponse.json({ error: "Failed to retrieve idea" }, { status: 500 });
  }
}
