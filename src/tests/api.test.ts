import { NextRequest } from 'next/server';
import { POST as coachPost } from '../app/api/gemini/coach/route';
import { POST as visionPost } from '../app/api/gemini/vision/route';
import { describe, test, expect, vi } from 'vitest';

// Mock the global fetch
vi.stubGlobal('fetch', vi.fn());

describe('API Route - Gemini Coach', () => {
  test('should reject unauthorized request origins', async () => {
    const req = new NextRequest('http://localhost:3000/api/gemini/coach', {
      method: 'POST',
      headers: {
        'host': 'localhost:3000'
        // no origin header -> should fail isAuthorizedRequest
      },
      body: JSON.stringify({ newMessage: 'Hello' })
    });

    const res = await coachPost(req);
    expect(res.status).toBe(401);
  });

  test('should process authorized request origins', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Here is your green plan' }]
          }
        }
      ]
    };

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    );

    const req = new NextRequest('http://localhost:3000/api/gemini/coach', {
      method: 'POST',
      headers: {
        'origin': 'http://localhost:3000',
        'host': 'localhost:3000'
      },
      body: JSON.stringify({
        newMessage: 'Hello',
        history: [],
        userContext: ''
      })
    });

    // Provide mock env key
    process.env.GEMINI_API_KEY = 'mock-key';

    const res = await coachPost(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.reply).toBe('Here is your green plan');
  });
});

describe('API Route - Gemini Vision', () => {
  test('should reject unauthorized request origins', async () => {
    const formData = new FormData();
    const req = new NextRequest('http://localhost:3000/api/gemini/vision', {
      method: 'POST',
      headers: {
        'host': 'localhost:3000'
      },
      body: formData
    });

    const res = await visionPost(req);
    expect(res.status).toBe(401);
  });

  test('should handle validation failures for invalid payloads', async () => {
    const formData = new FormData(); // empty form data -> missing image file
    const req = new NextRequest('http://localhost:3000/api/gemini/vision', {
      method: 'POST',
      headers: {
        'origin': 'http://localhost:3000',
        'host': 'localhost:3000'
      },
      body: formData
    });

    const res = await visionPost(req);
    expect(res.status).toBe(400);
  });
});
