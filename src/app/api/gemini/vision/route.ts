import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const GeminiVisionEnvelopeSchema = z.object({
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

const ScannedReceiptSchema = z.object({
  storeName: z.string(),
  date: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      carbonCategory: z.enum(['food-high', 'food-medium', 'food-low', 'electronics', 'utilities', 'other']),
      carbonEstimateKg: z.number(),
      ecoFriendlyAlternative: z.string().optional()
    })
  ),
  totalCost: z.number(),
  totalCarbonKg: z.number(),
  sustainabilityInsight: z.string()
});

const VisionRequestSchema = z.object({
  image: z.custom<File>((val) => typeof File !== 'undefined' && val instanceof File, {
    message: "Image must be a valid File object"
  })
});

function isAuthorizedRequest(req: NextRequest): boolean {
  const origin = req.headers.get('origin') || '';
  const host = req.headers.get('host') || '';
  const referer = req.headers.get('referer') || '';
  const proto = req.headers.get('x-forwarded-proto') || 'https';
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || (host ? `${proto}://${host}` : '');
  
  // Fallback: If origin is omitted (some safe browsers/clients on same-origin), use referer origin
  const resolvedOrigin = origin || (referer ? new URL(referer).origin : '');
  if (!resolvedOrigin) {
    return false;
  }
  
  // Check if resolved origin matches host target OR matches allowed origins
  const isMatchHost = host && (resolvedOrigin === `http://${host}` || resolvedOrigin === `https://${host}`);
  const allowed = [appOrigin, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
  const isAllowed = allowed.some(o => resolvedOrigin.startsWith(o));
  
  return isMatchHost || isAllowed;
}

export async function POST(req: NextRequest) {
  try {
    // Authorization guard — block cross-origin API abuse
    if (!isAuthorizedRequest(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get('image');

    const parsedRequest = VisionRequestSchema.safeParse({ image });
    if (!parsedRequest.success) {
      return NextResponse.json({ error: 'Invalid request payload', details: parsedRequest.error.issues }, { status: 400 });
    }
    const imageFile = parsedRequest.data.image;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ useFallback: true });
    }

    // Convert file to base64
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Data = buffer.toString('base64');
    const mimeType = imageFile.type;

    const prompt = `Perform OCR on this receipt or bill image and return a JSON object matching the following structure:
{
  "storeName": "string",
  "date": "string (YYYY-MM-DD)",
  "items": [
    {
      "name": "string",
      "price": number,
      "carbonCategory": "food-high" | "food-medium" | "food-low" | "electronics" | "utilities" | "other",
      "carbonEstimateKg": number,
      "ecoFriendlyAlternative": "string (optional recommendation)"
    }
  ],
  "totalCost": number,
  "totalCarbonKg": number,
  "sustainabilityInsight": "string"
}
Only return the raw JSON object. Do not include markdown code block formatting or any other text.`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini Vision API call failed:', errText);
      return NextResponse.json({ useFallback: true });
    }

    const data = await response.json();
    
    // Validate envelope structure
    const envValidation = GeminiVisionEnvelopeSchema.safeParse(data);
    if (!envValidation.success) {
      console.error('Gemini vision envelope validation failed:', envValidation.error);
      return NextResponse.json({ useFallback: true });
    }

    const responseText = envValidation.data.candidates[0].content.parts[0].text;
    if (!responseText) {
      return NextResponse.json({ useFallback: true });
    }

    // Parse and validate inner JSON content
    let parsedJson;
    try {
      parsedJson = JSON.parse(responseText.trim());
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      console.error('Failed to parse inner response as JSON:', errorMsg);
      return NextResponse.json({ useFallback: true });
    }

    const receiptValidation = ScannedReceiptSchema.safeParse(parsedJson);
    if (!receiptValidation.success) {
      console.error('Receipt schema validation failed:', receiptValidation.error);
      return NextResponse.json({ useFallback: true });
    }

    return NextResponse.json(receiptValidation.data);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error in Gemini Vision API Route:', errorMsg);
    return NextResponse.json({ useFallback: true });
  }
}
