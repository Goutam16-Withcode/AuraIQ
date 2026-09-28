import { NextResponse } from 'next/server';
import { analyzeTextLocally, EMOTION_META } from '@/lib/analyzer';
import { EmotionKey } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const texts = body.texts;

    if (!texts || !Array.isArray(texts)) {
      return NextResponse.json({ error: 'texts array is required' }, { status: 400 });
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('http://127.0.0.1:8000/api/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts }),
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

    const counts: Record<EmotionKey, number> = {
      joy: 0, love: 0, sadness: 0, anger: 0, fear: 0, surprise: 0, neutral: 0
    };

    const results = texts.filter(t => t && t.trim().length > 0).map(t => {
      const res = analyzeTextLocally(t);
      counts[res.dominant_emotion] += 1;
      return {
        text: t,
        dominant_emotion: res.dominant_emotion,
        dominant_label: res.dominant_label,
        sub_emotion: res.sub_emotion,
        emoji: res.emoji,
        confidence: res.confidence,
        intent: res.intent.name,
        intent_badge: res.intent.badge,
        valence: res.affect_coordinates.valence,
        arousal: res.affect_coordinates.arousal,
      };
    });

    return NextResponse.json({
      results,
      total_processed: results.length,
      emotion_distribution: counts,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
