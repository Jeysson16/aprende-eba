import { buildFallbackFeedback } from "@/lib/feedback/rules";
import { buildGeminiPrompt } from "@/lib/feedback/prompt";
import type { AttemptRecord, FeedbackReport, Instrument } from "@/lib/types";

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
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: buildGeminiPrompt(instrument, attempt) }],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            responseMimeType: "application/json",
          },
        }),
      },
    );

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
