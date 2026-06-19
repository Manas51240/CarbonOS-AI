import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

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

/** Server-side input sanitizer using DOMPurify */
function sanitizeInput(input: string): string {
  if (!input) return '';
  return DOMPurify.sanitize(input).trim().slice(0, 2000);
}

function isAuthorizedRequest(req: NextRequest): boolean {
  const origin = req.headers.get('origin') || '';
  if (!origin) {
    return false;
  }
  const host = req.headers.get('host') || '';
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://carbonos-ai-160715832584.us-central1.run.app';
  
  // Check if origin matches host target OR matches allowed origins
  const isMatchHost = host && (origin === `http://${host}` || origin === `https://${host}`);
  const allowed = [appOrigin, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
  const isAllowed = allowed.some(o => origin.startsWith(o));
  
  return isMatchHost || isAllowed;
}

export async function POST(req: NextRequest) {
  try {
    // Authorization guard — block cross-origin API abuse
    if (!isAuthorizedRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsedRequest = CoachRequestSchema.safeParse(body);
    if (!parsedRequest.success) {
      return NextResponse.json({ error: 'Invalid request payload', details: parsedRequest.error.issues }, { status: 400 });
    }

    // Sanitize all user-supplied strings before forwarding to external API
    const sanitizedMessage = sanitizeInput(parsedRequest.data.newMessage);
    const sanitizedContext = sanitizeInput(parsedRequest.data.userContext);
    const history = parsedRequest.data.history.map(msg => ({
      role: msg.role,
      content: sanitizeInput(msg.content)
    }));

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: null, useFallback: true });
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: sanitizedContext || '' }]
      },
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content || '' }]
      })),
      {
        role: 'user',
        parts: [{ text: sanitizedMessage || '' }]
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
