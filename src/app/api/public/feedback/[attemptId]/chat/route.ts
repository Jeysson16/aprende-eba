import { NextResponse } from "next/server";
import { z } from "zod";

import { getAttemptById } from "@/lib/data-store";
import { generateFeedbackChatReply } from "@/lib/feedback/chat";

const chatSchema = z.object({
  message: z.string().trim().min(2).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .max(20)
    .optional()
    .default([]),
});

export async function POST(
  request: Request,
  context: RouteContext<"/api/public/feedback/[attemptId]/chat">,
) {
  const { attemptId } = await context.params;
  const attempt = await getAttemptById(attemptId);

  if (!attempt) {
    return NextResponse.json({ message: "Retroalimentación no encontrada." }, { status: 404 });
  }

  const payload = await request.json();
  const parsed = chatSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Escribe un comentario válido para conversar con el chatbot." },
      { status: 400 },
    );
  }

  const response = await generateFeedbackChatReply({
    attempt,
    history: parsed.data.history,
    message: parsed.data.message,
  });

  return NextResponse.json(response);
}
