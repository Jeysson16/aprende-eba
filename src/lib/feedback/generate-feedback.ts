import { buildFallbackFeedback } from "@/lib/feedback/rules";
import { buildGeminiPrompt } from "@/lib/feedback/prompt";
import type { AttemptRecord, FeedbackReport, Instrument } from "@/lib/types";

const GEMINI_TIMEOUT_MS = 4500;

function sanitizeJsonBlock(text: string) {
  const cleaned = text.trim().replace(/^```json/, "").replace(/```$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  return firstBrace >= 0 && lastBrace >= 0
    ? cleaned.slice(firstBrace, lastBrace + 1)
    : cleaned;
}

export async function generateFeedback(
  instrument: Instrument,
  attempt: Omit<AttemptRecord, "feedback">,
): Promise<FeedbackReport> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return buildFallbackFeedback(attempt);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: buildGeminiPrompt(instrument, attempt) }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
            responseMimeType: "application/json",
          },
        }),
      },
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      return buildFallbackFeedback(attempt);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return buildFallbackFeedback(attempt);
    }

    const parsed = JSON.parse(sanitizeJsonBlock(text)) as Omit<FeedbackReport, "provider">;

    return {
      summary: parsed.summary,
      strengths: parsed.strengths,
      improvements: parsed.improvements,
      explanation: parsed.explanation,
      studyRecommendation: parsed.studyRecommendation,
      nextStep: parsed.nextStep,
      provider: "gemini",
    };
  } catch {
    return buildFallbackFeedback(attempt);
  }
}
