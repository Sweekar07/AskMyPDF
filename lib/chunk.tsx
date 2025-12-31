export function chunkText(text: string, chunkSize = 2000, overlap = 200): string[] {
  // Input validation
  if (!text || text.trim().length === 0) {
    return [];
  }

  if (overlap >= chunkSize) {
    throw new Error("Overlap must be less than chunk size");
  }

  const chunks: string[] = [];
  let i = 0;
  const maxChunks = 10000;

  while (i < text.length && chunks.length < maxChunks) {
    const end = Math.min(i + chunkSize, text.length);
    const chunk = text.slice(i, end);

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Ensure we always advance
    const step = Math.max(chunkSize - overlap, 1);
    i += step;

    // Break if we've covered the text
    if (end >= text.length) {
      break;
    }
  }

  return chunks;
}
