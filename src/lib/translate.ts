const MAX_CHUNK = 1800;

function splitChunks(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= MAX_CHUNK) return [trimmed];

  const paragraphs = trimmed.split(/\n\n+/);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length <= MAX_CHUNK) {
      current = next;
      continue;
    }
    if (current) chunks.push(current);
    if (paragraph.length <= MAX_CHUNK) {
      current = paragraph;
      continue;
    }
    // Hard-split very long paragraphs.
    for (let i = 0; i < paragraph.length; i += MAX_CHUNK) {
      chunks.push(paragraph.slice(i, i + MAX_CHUNK));
    }
    current = "";
  }
  if (current) chunks.push(current);
  return chunks;
}

async function translateWithGoogleCloud(text: string): Promise<string> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY?.trim();
  if (!key) throw new Error("GOOGLE_TRANSLATE_API_KEY missing");

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "am",
        format: "text",
      }),
    },
  );
  const data = (await response.json()) as {
    data?: { translations?: Array<{ translatedText?: string }> };
    error?: { message?: string };
  };
  if (!response.ok) {
    throw new Error(data.error?.message || "Google Cloud Translation failed");
  }
  const translated = data.data?.translations?.[0]?.translatedText?.trim();
  if (!translated) throw new Error("Empty Google Cloud translation");
  return translated;
}

async function translateWithGtx(text: string): Promise<string> {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "am");
  url.searchParams.set("dt", "t");
  url.searchParams.set("ie", "UTF-8");
  url.searchParams.set("oe", "UTF-8");
  url.searchParams.set("q", text);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Translate request failed (${response.status})`);
  }
  const data = (await response.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("Unexpected translate response");
  }
  const parts = (data[0] as unknown[])
    .map((segment) =>
      Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : "",
    )
    .filter(Boolean);
  const translated = parts.join("").trim();
  if (!translated) throw new Error("Empty translation");
  return translated;
}

async function translateChunk(text: string): Promise<string> {
  if (process.env.GOOGLE_TRANSLATE_API_KEY?.trim()) {
    try {
      return await translateWithGoogleCloud(text);
    } catch (error) {
      console.warn("Google Cloud Translation failed, falling back to gtx", error);
    }
  }
  return translateWithGtx(text);
}

/** Translate English copy to Amharic for Learn admin. */
export async function translateEnToAm(text: string): Promise<string> {
  const chunks = splitChunks(text);
  if (chunks.length === 0) return "";

  const translated: string[] = [];
  for (const chunk of chunks) {
    translated.push(await translateChunk(chunk));
  }
  return translated.join("\n\n").trim();
}
