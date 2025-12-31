import { NextResponse } from "next/server";
import { extractPdfText } from "@/lib/pdf";
import { chunkText } from "@/lib/chunk";
import { embedTexts } from "@/lib/embeddings";
import { mongoUpsertChunks } from "@/lib/vector_mongo";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Upload a PDF file" }, { status: 400 });
    }

    const fileId = nanoid(10);
    const buf = await file.arrayBuffer();
    const text = await extractPdfText(buf);

    if (!text.trim()) {
      return NextResponse.json({ error: "Empty PDF" }, { status: 400 });
    }

    const chunks = chunkText(text);
    const embeddings = await embedTexts(chunks);

    await mongoUpsertChunks(fileId, chunks, embeddings);

    return NextResponse.json({
      fileId,
      chunks: chunks.length,
      message: "PDF processed successfully"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
