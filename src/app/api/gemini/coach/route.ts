import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const GeminiCoachResponseSchema = z.object({
  candidates: z.array(
    z.object({
      content: z.object({
        parts: z.array(
          z.object({
            text: z.string()
          })
        )
      })
    })
  )
});

const CoachRequestSchema = z.object({
  history: z.array(
    z.object({
      role: z.string(),
      content: z.string()
    })
  ).optional().default([]),
  newMessage: z.string(),
  userContext: z.string().optional().default('')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedRequest = CoachRequestSchema.safeParse(body);
    if (!parsedRequest.success) {
      return NextResponse.json({ error: 'Invalid request payload', details: parsedRequest.error.issues }, { status: 400 });
    }
    const { history, newMessage, userContext } = parsedRequest.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: null, useFallback: true });
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: userContext || '' }]
      },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content || '' }]
      })),
      {
        role: 'user',
        parts: [{ text: newMessage || '' }]
      }
    ];

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API call failed:', errText);
      return NextResponse.json({ reply: null, useFallback: true });
    }

    const data = await response.json();
    
    // Zod runtime schema validation on external API payload
    const validation = GeminiCoachResponseSchema.safeParse(data);
    if (!validation.success) {
      console.error('Gemini response schema validation failed:', validation.error);
      return NextResponse.json({ reply: null, useFallback: true });
    }

    const reply = validation.data.candidates[0].content.parts[0].text || null;

    return NextResponse.json({ reply, useFallback: !reply });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error in Gemini Coach API Route:', errorMsg);
    return NextResponse.json({ reply: null, useFallback: true });
  }
}
