import { EmotionKey, EmotionAnalysisResult, NarrativeStep } from './types';

export const EMOTION_META: Record<EmotionKey, { label: string; emoji: string; color: string; valence: number; arousal: number; dominance: number }> = {
  joy: { label: 'Joy', emoji: '😊', color: '#F59E0B', valence: 0.85, arousal: 0.70, dominance: 0.75 },
  love: { label: 'Love', emoji: '❤️', color: '#EC4899', valence: 0.90, arousal: 0.60, dominance: 0.65 },
  sadness: { label: 'Sadness', emoji: '😢', color: '#3B82F6', valence: -0.80, arousal: 0.25, dominance: 0.20 },
  anger: { label: 'Anger', emoji: '😠', color: '#EF4444', valence: -0.75, arousal: 0.85, dominance: 0.80 },
  fear: { label: 'Fear', emoji: '😨', color: '#8B5CF6', valence: -0.70, arousal: 0.80, dominance: 0.25 },
  surprise: { label: 'Surprise', emoji: '😲', color: '#14B8A6', valence: 0.20, arousal: 0.85, dominance: 0.50 },
  neutral: { label: 'Neutral', emoji: '😐', color: '#64748B', valence: 0.0, arousal: 0.20, dominance: 0.50 },
};

interface NuanceRule {
  pattern: RegExp;
  primary: EmotionKey;
  subEmotion: string;
  arousal: number;
  valence: number;
  dominance: number;
  theme: string;
  insight: string;
}

const NUANCE_RULES: NuanceRule[] = [
  {
    pattern: /\b(tired|tried|exhausted|drained|sleepy|fatigued|burnout|burned out|overworked|worn out|weary|dead tired|lethargic)\b/i,
    primary: 'sadness',
    subEmotion: 'Exhaustion & Depletion',
    arousal: 0.15,
    valence: -0.45,
    dominance: 0.25,
    theme: 'Physical & Cognitive Resource Depletion',
    insight: 'The speaker signals severe neuro-energetic and muscular depletion where recovery mechanisms are overwhelmed, usually aggravated by nocturnal shifts or extended cognitive strain.'
  },
  {
    pattern: /\b(lonely|isolated|alone|abandoned|left out|ignored|neglected|unwanted)\b/i,
    primary: 'sadness',
    subEmotion: 'Interpersonal Disconnection & Isolation',
    arousal: 0.25,
    valence: -0.75,
    dominance: 0.18,
    theme: 'Social Belonging Deficit',
    insight: 'The speaker articulates perceived estrangement from meaningful relational bonds, producing deep emotional vulnerability and ache.'
  },
  {
    pattern: /\b(hopeless|despair|pointless|give up|worthless|depressed|ruined|defeated)\b/i,
    primary: 'sadness',
    subEmotion: 'Despair & Demoralization',
    arousal: 0.18,
    valence: -0.88,
    dominance: 0.10,
    theme: 'Learned Helplessness & Bleak Outlook',
    insight: 'Reflects an existential feeling of futility where the individual perceives zero efficacy over current stressors.'
  },
  {
    pattern: /\b(furious|pissed|hate|angry|rage|infuriated|mad|livid)\b/i,
    primary: 'anger',
    subEmotion: 'Acute Rage & Outrage',
    arousal: 0.90,
    valence: -0.80,
    dominance: 0.85,
    theme: 'Active Boundary Violation & Retaliation',
    insight: 'High physiological mobilization geared toward confronting perceived injustice, disrespect, or willful harm.'
  },
  {
    pattern: /\b(annoyed|irritated|frustrated|bothered|sick of|fed up|screwed)\b/i,
    primary: 'anger',
    subEmotion: 'Friction & Impatience',
    arousal: 0.70,
    valence: -0.60,
    dominance: 0.65,
    theme: 'Obstacle Blockage & Agitation',
    insight: 'A reactive defense mechanism against persistent minor or systemic barriers impeding task execution.'
  },
  {
    pattern: /\b(terrified|panic|anxious|nervous|worried|scared|fear|dread|stress|frightened)\b/i,
    primary: 'fear',
    subEmotion: 'Threat Anticipation & Apprehension',
    arousal: 0.85,
    valence: -0.70,
    dominance: 0.22,
    theme: 'Survival Vigilance & Risk Aversion',
    insight: 'Heightened sympathetic nervous system arousal anticipating uncertain hazard, test outcome, or physical compromise.'
  },
  {
    pattern: /\b(ecstatic|thrilled|passed|won|promoted|finally|excited|achieved|triumph|celebrate)\b/i,
    primary: 'joy',
    subEmotion: 'Triumph & Euphoric Relief',
    arousal: 0.85,
    valence: 0.92,
    dominance: 0.88,
    theme: 'Goal Mastery & Peak Dopaminergic Reward',
    insight: 'Celebration of goal attainment and resilience, validating past invested effort and elevating social standing.'
  },
  {
    pattern: /\b(happy|glad|delighted|pleased|content|smiling|blessed|cheerful)\b/i,
    primary: 'joy',
    subEmotion: 'Serene Contentment & Cheer',
    arousal: 0.60,
    valence: 0.80,
    dominance: 0.70,
    theme: 'Hedonic Satisfaction & Positivity',
    insight: 'Harmonious emotional baseline characterized by gratitude, comfort, and positive cognitive evaluation of the moment.'
  },
  {
    pattern: /\b(love|adore|cherish|romantic|sweetheart|darling|caring|treasure|warmth)\b/i,
    primary: 'love',
    subEmotion: 'Tender Attachment & Bonding',
    arousal: 0.55,
    valence: 0.92,
    dominance: 0.65,
    theme: 'Oxytocin-Driven Interpersonal Care',
    insight: 'Deep relational intimacy and prioritization of another person\'s emotional and physical well-being.'
  },
  {
    pattern: /\b(grateful|thank|thanks|appreciate|indebted|blessed)\b/i,
    primary: 'love',
    subEmotion: 'Appreciative Gratitude',
    arousal: 0.50,
    valence: 0.88,
    dominance: 0.60,
    theme: 'Prosocial Reciprocity',
    insight: 'Recognition of altruistic effort or external kindness, fostering warmth and prosocial cohesion.'
  },
  {
    pattern: /\b(shocked|surprised|unexpected|sudden|astonished|unbelievable|baffled|woah|wow)\b/i,
    primary: 'surprise',
    subEmotion: 'Cognitive Disruption & Awe',
    arousal: 0.88,
    valence: 0.25,
    dominance: 0.45,
    theme: 'Schema Mismatch & Reorientation',
    insight: 'Rapid sensory orientation triggered when reality defies internal expectations, requiring cognitive reappraisal.'
  },
];

export function analyzeTextLocally(text: string): EmotionAnalysisResult {
  const clean = text.trim() || 'Empty statement';
  
  // 1. Causal Extraction
  const causalMatch = clean.match(/\b(due to|because of|because|owing to|as a result of|from|after|on account of)\s+([^.,;!?]+)/i);
  const cause = causalMatch ? causalMatch[2].trim() : null;

  // 2. Temporal & Environmental Context
  const tempMatch = clean.match(/\b(in the night|in night|at night|all night|tonight|all day|for hours|yesterday|tomorrow|this week|lately|recently)\b/i);
  const temporal = tempMatch ? tempMatch[0].trim() : null;

  // 3. Subject
  let subject = 'General Observation';
  if (/\b(i am|im|i feel|i have been|ive been|me|myself)\b/i.test(clean)) {
    subject = 'First-Person Self (Introspective Reflection)';
  } else if (/\b(you|your|you're)\b/i.test(clean)) {
    subject = 'Second-Person Direct Address';
  } else if (/\b(he|she|they|boss|friend|team|company)\b/i.test(clean)) {
    subject = 'Third-Party Social Entity';
  }

  // 4. Intensifiers
  const intensifiersMatch = clean.match(/\b(very|extremely|so|really|totally|completely|absolutely|utterly|super|just)\b/gi);
  const intensifiers = intensifiersMatch ? Array.from(new Set(intensifiersMatch.map(s => s.toLowerCase()))) : [];

  // Match Nuance Rule
  let matched: NuanceRule | undefined = undefined;
  for (const rule of NUANCE_RULES) {
    if (rule.pattern.test(clean)) {
      matched = rule;
      break;
    }
  }

  const dominantEmotion: EmotionKey = matched ? matched.primary : 'neutral';
  const subEmotion = matched ? matched.subEmotion : 'Objective Equilibrium';
  let valence = matched ? matched.valence : 0.0;
  let arousal = matched ? matched.arousal : 0.20;
  let dominance = matched ? matched.dominance : 0.50;
  const theme = matched ? matched.theme : 'Factual Informational Transmission';
  const insight = matched ? matched.insight : 'The statement operates in an objective or neutral semantic plane devoid of intense subjective affect.';

  // Adjust for intensifiers
  if (intensifiers.length > 0) {
    valence = valence < 0 ? Math.max(-1.0, valence * 1.15) : Math.min(1.0, valence * 1.15);
  }

  // Score distribution
  const scores: Record<EmotionKey, number> = {
    joy: 0.02,
    love: 0.02,
    sadness: 0.02,
    anger: 0.02,
    fear: 0.02,
    surprise: 0.02,
    neutral: 0.02,
  };

  scores[dominantEmotion] = 0.76;
  if (dominantEmotion === 'sadness' && subEmotion.includes('Exhaustion')) {
    // Fatigue has weariness + neutrality
    scores['neutral'] = 0.14;
  }
  const sumScores = Object.values(scores).reduce((a, b) => a + b, 0);
  for (const k of Object.keys(scores) as EmotionKey[]) {
    scores[k] = Number((scores[k] / sumScores).toFixed(4));
  }

  // Intent Detection
  let intentName = 'Sharing Factual Information';
  let intentBadge = 'ℹ️ Factual Disclosure';
  let intentDesc = 'Communicating neutral observations, procedures, or facts without elevated emotional tension.';
  let intentConf = 0.85;

  if (subEmotion === 'Exhaustion & Depletion') {
    if (cause) {
      intentName = `Sharing Exhaustion & Venting Strain from ${cause.charAt(0).toUpperCase() + cause.slice(1)}`;
      intentBadge = '🛑 Burnout & Strain Disclosure';
      intentDesc = `The speaker is openly communicating personal physical or cognitive depletion directly triggered by '${cause}', functioning both as cathartic venting and an implicit explanation for needing respite.`;
      intentConf = 0.95;
    } else {
      intentName = 'Disclosing Physical or Cognitive Fatigue';
      intentBadge = '🔋 Energy Depletion Notice';
      intentDesc = 'Signaling diminished capacity and drained reserves, inviting accommodation or rest.';
      intentConf = 0.91;
    }
  } else if (dominantEmotion === 'sadness') {
    intentName = 'Reaching Out for Social Empathy & Support';
    intentBadge = '🤝 Support Seeking';
    intentDesc = 'Expressing vulnerability to solicit reassurance, comfort, or listening presence.';
    intentConf = 0.93;
  } else if (dominantEmotion === 'anger') {
    intentName = cause ? `Venting Frustration against ${cause}` : 'Cathartic Venting & Boundary Defense';
    intentBadge = '😤 Cathartic Venting';
    intentDesc = 'Expressing hostility or indignation against perceived obstruction, unfairness, or friction.';
    intentConf = 0.92;
  } else if (dominantEmotion === 'joy') {
    intentName = 'Celebrating Personal Triumph & Milestone';
    intentBadge = '🎉 Celebration of Success';
    intentDesc = 'Sharing positive breakthroughs, good fortune, or victories with enthusiasm.';
    intentConf = 0.96;
  } else if (dominantEmotion === 'love') {
    intentName = 'Reinforcing Affection & Emotional Closeness';
    intentBadge = '💖 Affection & Bonding';
    intentDesc = 'Deepening relational trust, emotional intimacy, or expressing profound gratitude.';
    intentConf = 0.95;
  } else if (dominantEmotion === 'fear') {
    intentName = 'Expressing Apprehension & Seeking Safety';
    intentBadge = '⚠️ Threat & Caution Alert';
    intentDesc = 'Signaling anticipatory unease regarding impending hazard or high-stakes ambiguity.';
    intentConf = 0.90;
  } else if (dominantEmotion === 'surprise') {
    intentName = 'Expressing Astonishment at Novel Event';
    intentBadge = '😲 Incredulity & Awe';
    intentDesc = 'Reacting to an unexpected occurrence that conflicts with prior expectations.';
    intentConf = 0.88;
  }

  // Dynamic In-Depth Reasoning Construction
  const paragraphs: string[] = [];

  paragraphs.push(
    `**Affective State & Nuance:** The text directly reflects **${subEmotion}** (categorized under the broader ${EMOTION_META[dominantEmotion].label} domain). Rather than an ambiguous or abstract mood, the emotional state is intimately tied to ${subject.toLowerCase()}${cause ? ` with explicit causal attribution to **"${cause}"**` : ''}${temporal ? ` during **"${temporal}"**` : ''}.`
  );

  if (cause) {
    paragraphs.push(
      `**Causal Attribution Analysis:** By explicitly framing the state with causal connectors (*"${cause}"*), the speaker utilizes *external situational attribution*. In cognitive appraisal psychology, this distinguishes burnout or fatigue from chronic depressive despair: the subject perceives their drained state as a logical, physiological consequence of excessive labor or disruptive conditions rather than an intrinsic failure.`
    );
  }

  if (temporal) {
    paragraphs.push(
      `**Circadian & Environmental Stressor:** The explicit temporal marker (*"${temporal}"*) highlights chronobiological friction. Nocturnal exertion actively conflicts with human circadian rhythms, impairing melatonin synthesis and sleep architecture, which dramatically heightens subjective feelings of exhaustion and diminished cognitive bandwidth.`
    );
  }

  paragraphs.push(
    `**Pragmatic Communication Intent:** The utterance is driven by **${intentName}**. Beyond mere data transmission, it serves as a social signal of reduced operational capacity, seeking validation, empathy, or justified rest.`
  );

  const reasoning = paragraphs.join('\n\n');

  // Word Saliency
  const words = clean.split(/\s+/);
  const keyTokens = new Set(['tired', 'tried', 'exhausted', 'work', 'night', 'sleepy', 'sad', 'angry', 'hate', 'fear', 'happy', 'love', 'grateful', 'proud', 'scared', 'alone']);
  const saliency = words.map(w => {
    const raw = w.toLowerCase().replace(/[^\w]/g, '');
    let weight = 0.12;
    if (keyTokens.has(raw)) weight = 0.95;
    else if (cause && cause.toLowerCase().includes(raw) && raw.length > 2) weight = 0.75;
    else if (temporal && temporal.toLowerCase().includes(raw)) weight = 0.65;
    else if (intensifiers.includes(raw)) weight = 0.50;
    else if (raw.length > 4) weight = 0.25;

    return {
      word: w,
      weight: Number(weight.toFixed(2)),
      is_key_driver: weight >= 0.60,
    };
  });

  return {
    dominant_emotion: dominantEmotion,
    dominant_label: EMOTION_META[dominantEmotion].label,
    sub_emotion: subEmotion,
    emoji: EMOTION_META[dominantEmotion].emoji,
    color: EMOTION_META[dominantEmotion].color,
    confidence: Number(scores[dominantEmotion].toFixed(4)),
    scores,
    affect_coordinates: {
      valence: Number(valence.toFixed(3)),
      arousal: Number(arousal.toFixed(3)),
      dominance: Number(dominance.toFixed(3)),
    },
    intent: {
      name: intentName,
      badge: intentBadge,
      description: intentDesc,
      confidence: intentConf,
    },
    components: {
      cause,
      temporal_context: temporal,
      subject,
      intensifiers,
    },
    saliency,
    explanation: {
      reasoning,
      theme,
      psychological_insight: insight,
      cognitive_appraisal: {
        pleasantness: valence < -0.6 ? 'Severely Unpleasant' : (valence < 0 ? 'Negative / Displeasing' : 'Pleasant / Satisfying'),
        activation_energy: arousal < 0.3 ? 'Depleted / Low Activation' : (arousal > 0.7 ? 'Hyper-Arousal / High Energy' : 'Moderate Equilibrium'),
        attribution_source: cause ? `External Cause (${cause})` : 'Internal State',
      },
    },
    metadata: {
      word_count: words.length,
      char_count: clean.length,
      device: 'Local Context Engine',
    },
  };
}

export function analyzeFlowLocally(fullText: string): NarrativeStep[] {
  const sentences = fullText
    .split(/[.!?\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 3);

  const targets = sentences.length > 0 ? sentences : [fullText];

  return targets.map((sentence, idx) => {
    const res = analyzeTextLocally(sentence);
    return {
      step: idx + 1,
      sentence,
      dominant_emotion: res.dominant_emotion,
      dominant_label: res.dominant_label,
      sub_emotion: res.sub_emotion,
      emoji: res.emoji,
      color: res.color,
      confidence: res.confidence,
      valence: res.affect_coordinates.valence,
      arousal: res.affect_coordinates.arousal,
      intent: res.intent.badge,
    };
  });
}
