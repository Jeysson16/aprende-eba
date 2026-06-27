import { buildFallbackFeedback } from "@/lib/feedback/rules";
import { buildGeminiPrompt } from "@/lib/feedback/prompt";
import type { AttemptRecord, FeedbackReport, Instrument } from "@/lib/types";
import { z } from "zod";

const GEMINI_TIMEOUT_MS = 7000;
const GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.5-flash",
] as const;

const feedbackSchema = z.object({
  summary: z.string().trim().min(12),
  strengths: z.array(z.string().trim().min(8)).min(1).max(2),
  improvements: z.array(z.string().trim().min(8)).min(1).max(2),
  explanation: z.string().trim().min(12),
  studyRecommendation: z.string().trim().min(12),
  nextStep: z.string().trim().min(12),
});

function sanitizeJsonBlock(text: string) {
  const cleaned = text.trim().replace(/^```json/, "").replace(/```$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  return firstBrace >= 0 && lastBrace >= 0
    ? cleaned.slice(firstBrace, lastBrace + 1)
    : cleaned;
}

function normalizeFeedback(parsed: z.infer<typeof feedbackSchema>): FeedbackReport {
  return {
    summary: parsed.summary,
    strengths: parsed.strengths.slice(0, 2),
    improvements: parsed.improvements.slice(0, 2),
    explanation: parsed.explanation,
    studyRecommendation: parsed.studyRecommendation,
    nextStep: parsed.nextStep,
    provider: "gemini",
  };
}

export async function generateFeedback(
  instrument: Instrument,
  attempt: Omit<AttemptRecord, "feedback">,
): Promise<FeedbackReport> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return buildFallbackFeedback(attempt, instrument);
  }

  try {
    for (const model of GEMINI_MODELS) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
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
                temperature: 0.35,
                maxOutputTokens: 700,
                responseMimeType: "application/json",
              },
            }),
          },
        );

        if (!response.ok) {
          continue;
        }

        const data = (await response.json()) as {
          candidates?: Array<{
            content?: { parts?: Array<{ text?: string }> };
            finishReason?: string;
          }>;
        };

        const text = data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text ?? "")
          .join("")
          .trim();

        if (!text || data.candidates?.[0]?.finishReason === "MAX_TOKENS") {
          continue;
        }

        const parsed = feedbackSchema.safeParse(JSON.parse(sanitizeJsonBlock(text)));
        if (parsed.success) {
          return normalizeFeedback(parsed.data);
        }
      } catch {
        continue;
      } finally {
        clearTimeout(timeoutId);
      }
    }
  } catch {
    return buildFallbackFeedback(attempt, instrument);
  }

  return buildFallbackFeedback(attempt, instrument);
}
