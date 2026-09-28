import { NextResponse } from 'next/server';
import { analyzeFlowLocally } from '@/lib/analyzer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const text = body.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text field is required' }, { status: 400 });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const response = await fetch('http://127.0.0.1:8000/api/analyze-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    } catch {
      // Local fallback
    }

    const flow = analyzeFlowLocally(text);
    return NextResponse.json({ flow, total_sentences: flow.length });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
