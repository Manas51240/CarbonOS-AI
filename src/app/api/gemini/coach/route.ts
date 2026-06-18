import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { history, newMessage, userContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: null, useFallback: true });
    }

    const contents = [
      {
        role: 'user',
        parts: [{ text: userContext || '' }]
      },
      ...(history || []).map((msg: any) => ({
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
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return NextResponse.json({ reply, useFallback: !reply });
  } catch (error: any) {
    console.error('Error in Gemini Coach API Route:', error);
    return NextResponse.json({ reply: null, useFallback: true });
  }
}
