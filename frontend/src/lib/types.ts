export type EmotionKey = 'joy' | 'love' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'neutral';

export interface EmotionScore {
  key: EmotionKey;
  label: string;
  emoji: string;
  color: string;
  score: number;
}

export interface AffectCoordinates {
  valence: number;   // -1.0 (very negative) to +1.0 (very positive)
  arousal: number;   // 0.0 (lethargic/depleted) to 1.0 (intense/hyper-aroused)
  dominance: number; // 0.0 (powerless) to 1.0 (in control)
}

export interface IntentData {
  name: string;
  badge: string;
  description: string;
  confidence: number;
}

export interface SaliencyWord {
  word: string;
  weight: number;
  is_key_driver: boolean;
}

export interface CognitiveAppraisal {
  pleasantness: string;
  activation_energy: string;
  attribution_source: string;
}

export interface CognitiveExplanation {
  reasoning: string;
  theme: string;
  psychological_insight: string;
  cognitive_appraisal: CognitiveAppraisal;
}

export interface AnalysisComponents {
  cause: string | null;
  temporal_context: string | null;
  subject: string;
  intensifiers: string[];
}

export interface EmotionAnalysisResult {
  dominant_emotion: EmotionKey;
  dominant_label: string;
  sub_emotion: string;
  emoji: string;
  color: string;
  confidence: number;
  scores: Record<EmotionKey, number>;
  affect_coordinates: AffectCoordinates;
  intent: IntentData;
  components: AnalysisComponents;
  saliency: SaliencyWord[];
  explanation: CognitiveExplanation;
  metadata: {
    word_count: number;
    char_count: number;
    device?: string;
  };
}

export interface NarrativeStep {
  step: number;
  sentence: string;
  dominant_emotion: EmotionKey;
  dominant_label: string;
  sub_emotion: string;
  emoji: string;
  color: string;
  confidence: number;
  valence: number;
  arousal: number;
  intent: string;
}
