import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !imageFile) {
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
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      return NextResponse.json({ useFallback: true });
    }

    const parsedData = JSON.parse(responseText.trim());
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in Gemini Vision API Route:', error);
    return NextResponse.json({ useFallback: true });
  }
}
