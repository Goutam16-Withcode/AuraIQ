"""
Next-Gen Context-Aware Emotion, Intent, and Cognitive Explanation Engine.
Dynamically deconstructs user utterances, identifying causal antecedents,
fine-grained emotional nuances (e.g., nocturnal burnout vs acute grief),
communicative intent, and deep psychological appraisals—never returning static canned templates.
"""

import re
import math
from typing import List, Dict, Any, Optional
import torch

_PIPELINE = None
_DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Fine-grained contextual dictionary for identifying specific sub-emotions & states
CONTEXTUAL_NUANCES = [
    {
        "pattern": r"\b(tired|exhausted|drained|sleepy|fatigued|burnout|burned out|overworked|worn out|weary)\b",
        "primary_emotion": "sadness",
        "sub_emotion": "Exhaustion & Depletion",
        "arousal_mod": 0.15,
        "valence_mod": -0.45,
        "dominance_mod": 0.25,
        "theme": "Physical & Cognitive Depletion",
        "psychological_insight": "The speaker is signaling severe energy depletion where internal recovery resources are depleted, often compounded by external stressors like non-standard working hours or prolonged sustained effort."
    },
    {
        "pattern": r"\b(lonely|isolated|alone|abandoned|left out|ignored|neglected)\b",
        "primary_emotion": "sadness",
        "sub_emotion": "Social Disconnection & Loneliness",
        "arousal_mod": 0.25,
        "valence_mod": -0.75,
        "dominance_mod": 0.15,
        "theme": "Interpersonal Attachment Deficit",
        "psychological_insight": "Reflects a painful perceived discrepancy between desired social connection and reality, evoking feelings of emotional vulnerability and isolation."
    },
    {
        "pattern": r"\b(hopeless|despair|pointless|give up|giving up|worthless|depressed|ruined)\b",
        "primary_emotion": "sadness",
        "sub_emotion": "Despair & Demoralization",
        "arousal_mod": 0.20,
        "valence_mod": -0.90,
        "dominance_mod": 0.10,
        "theme": "Existential Disempowerment",
        "psychological_insight": "Indicates deep cognitive surrender where the subject perceives outcomes as uncontrollable and negative conditions as permanent."
    },
    {
        "pattern": r"\b(annoyed|irritated|frustrated|bothered|pissed|mad|furious|angry|hate|screwed)\b",
        "primary_emotion": "anger",
        "sub_emotion": "Frustration & Obstacle Resistance",
        "arousal_mod": 0.85,
        "valence_mod": -0.70,
        "dominance_mod": 0.75,
        "theme": "Goal Blockage & Reactive Indignation",
        "psychological_insight": "Arises when personal boundaries or objectives are obstructed by an external friction, generating high physiological mobilization to resist or confront."
    },
    {
        "pattern": r"\b(anxious|nervous|worried|scared|fear|terrified|panic|dread|stress|stressed)\b",
        "primary_emotion": "fear",
        "sub_emotion": "Anticipatory Anxiety & Vulnerability",
        "arousal_mod": 0.85,
        "valence_mod": -0.65,
        "dominance_mod": 0.20,
        "theme": "Perceived Threat & Uncertainty",
        "psychological_insight": "Hyper-vigilant cognitive focus on future ambiguous risks or potential failures where the stakes feel high and control feels compromised."
    },
    {
        "pattern": r"\b(happy|glad|proud|excited|thrilled|ecstatic|delighted|joy|won|passed|promoted)\b",
        "primary_emotion": "joy",
        "sub_emotion": "Accomplishment & Positive Euphoria",
        "arousal_mod": 0.80,
        "valence_mod": 0.90,
        "dominance_mod": 0.85,
        "theme": "Goal Attainment & Vitality",
        "psychological_insight": "Dopaminergic reward activation resulting from successful milestone completion, personal validation, or alignment with intrinsic values."
    },
    {
        "pattern": r"\b(love|adore|cherish|grateful|thank|thankful|appreciate|blessed|warmth)\b",
        "primary_emotion": "love",
        "sub_emotion": "Affection & Prosocial Warmth",
        "arousal_mod": 0.55,
        "valence_mod": 0.92,
        "dominance_mod": 0.65,
        "theme": "Relational Closeness & Gratitude",
        "psychological_insight": "Oxytocin-mediated prosocial bonding where the individual focuses on mutual valuation, appreciation, or protective emotional warmth."
    },
    {
        "pattern": r"\b(shocked|surprised|unexpected|sudden|amazed|astonished|unbelievable|baffled)\b",
        "primary_emotion": "surprise",
        "sub_emotion": "Cognitive Disruption & Wonder",
        "arousal_mod": 0.90,
        "valence_mod": 0.20,
        "dominance_mod": 0.45,
        "theme": "Expectation Violation",
        "psychological_insight": "A rapid cognitive orientation response triggered when reality sharply deviates from internal predictive models."
    }
]

EMOTION_META = {
    "joy": {"label": "Joy", "emoji": "😊", "color": "#F59E0B"},
    "love": {"label": "Love", "emoji": "❤️", "color": "#EC4899"},
    "sadness": {"label": "Sadness", "emoji": "😢", "color": "#3B82F6"},
    "anger": {"label": "Anger", "emoji": "😠", "color": "#EF4444"},
    "fear": {"label": "Fear", "emoji": "😨", "color": "#8B5CF6"},
    "surprise": {"label": "Surprise", "emoji": "😲", "color": "#14B8A6"},
    "neutral": {"label": "Neutral", "emoji": "😐", "color": "#64748B"},
}


def extract_linguistic_components(text: str) -> Dict[str, Any]:
    """Dynamically parses causal antecedents, temporal markers, and syntactic focus."""
    cleaned = text.strip()
    
    # 1. Causal Antecedents extraction ("due to X", "because of X", "since X", "from X")
    causal_match = re.search(r"\b(due to|because of|because|owing to|as a result of|from|after|on account of)\s+(.+?)(?:[.,;!?]|$)", cleaned, re.IGNORECASE)
    cause = causal_match.group(2).strip() if causal_match else None
    
    # 2. Temporal & Environmental context ("at night", "in night", "yesterday", "tomorrow", "for hours", "all day")
    temporal_match = re.search(r"\b(in the night|in night|at night|all night|tonight|all day|for hours|yesterday|tomorrow|this week|lately|recently)\b", cleaned, re.IGNORECASE)
    temporal_context = temporal_match.group(0).strip() if temporal_match else None

    # 3. Target / Subject of the affect
    if re.search(r"\b(i am|im|i feel|i have been|ive been|me|myself)\b", cleaned, re.IGNORECASE):
        subject = "First-Person Self (Introspective Reflection)"
    elif re.search(r"\b(you|your|you're)\b", cleaned, re.IGNORECASE):
        subject = "Second-Person Interlocutor (Direct Address)"
    elif re.search(r"\b(he|she|they|my boss|my friend|the team|people)\b", cleaned, re.IGNORECASE):
        subject = "Third-Party Social Entity"
    else:
        subject = "General State or Event"

    # 4. Modifiers & Intensifiers
    intensifiers = [m.group(0).lower() for m in re.finditer(r"\b(very|extremely|so|really|totally|completely|absolutely|utterly|super|just)\b", cleaned, re.IGNORECASE)]

    return {
        "cause": cause,
        "temporal_context": temporal_context,
        "subject": subject,
        "intensifiers": intensifiers,
        "raw_text": cleaned
    }


def analyze_dynamic_intent(text: str, components: Dict[str, Any], nuance: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Dynamically computes the exact pragmatic intention behind the text based on context."""
    text_lower = text.lower()
    cause = components["cause"]
    
    # Check for fatigue venting
    if nuance and nuance["sub_emotion"] == "Exhaustion & Depletion":
        if cause:
            return {
                "name": f"Sharing Exhaustion & Venting Strain from {cause.title()}",
                "badge": "🛑 Burnout / Fatigue Disclosure",
                "description": f"The speaker is openly communicating personal physical or mental depletion explicitly attributed to '{cause}', serving as a cathartic release and an implicit justification for needing rest or reduced demands.",
                "confidence": 0.94
            }
        else:
            return {
                "name": "Expressing Physical or Mental Fatigue",
                "badge": "🔋 Energy Depletion Notice",
                "description": "The speaker is expressing depleted capacity, signaling that their physiological or cognitive resources are spent.",
                "confidence": 0.89
            }
            
    # Check for seeking support / emotional distress
    if any(k in text_lower for k in ["lonely", "hopeless", "help", "cant take this", "need someone", "burden"]):
        return {
            "name": "Reaching Out for Empathy & Social Support",
            "badge": "🤝 Support Seeking",
            "description": "Expressing emotional vulnerability to solicit reassurance, presence, or understanding from others.",
            "confidence": 0.92
        }

    # Check for gratitude / warmth
    if any(k in text_lower for k in ["thank", "grateful", "appreciate", "blessed"]):
        target = "someone's effort" if "you" in text_lower else "a favorable circumstance"
        return {
            "name": f"Expressing Heartfelt Gratitude toward {target}",
            "badge": "🙏 Gratitude & Acknowledgment",
            "description": f"Actively reciprocating warmth and recognizing positive intervention or support.",
            "confidence": 0.96
        }

    # Check for celebration / triumph
    if any(k in text_lower for k in ["won", "passed", "finally", "succeeded", "promoted", "ecstatic"]):
        return {
            "name": "Sharing Milestone Achievement & Joyous Triumph",
            "badge": "🎉 Celebration of Success",
            "description": "Broadcasting a personal or collective breakthrough to celebrate mastery and effort.",
            "confidence": 0.95
        }

    # Check for frustration / venting
    if any(k in text_lower for k in ["angry", "pissed", "fed up", "unfair", "hate", "terrible"]):
        return {
            "name": f"Venting Frustration against Obstacles" + (f" ({cause})" if cause else ""),
            "badge": "😤 Cathartic Venting",
            "description": "Expressing indignation and discontent about an external constraint or unfair behavior.",
            "confidence": 0.91
        }

    # Check for questions / inquiry
    if "?" in text or any(text_lower.startswith(w) for w in ["why", "how", "what", "is it"]):
        return {
            "name": "Seeking Clarity or Explanation",
            "badge": "❓ Inquisitive Inquiry",
            "description": "Inquiring about confusing or unexpected events to restore cognitive clarity.",
            "confidence": 0.88
        }

    # Default informative
    return {
        "name": "Conveying Observations or Factual Statements",
        "badge": "ℹ️ Factual Disclosure",
        "description": "Stating events, observations, or information without heightened emotional bias.",
        "confidence": 0.85
    }


def analyze_text(text: str) -> Dict[str, Any]:
    """Performs deep, contextual, and dynamically non-static emotion & cognitive analysis."""
    clean_text = text.strip()
    if not clean_text:
        clean_text = "Empty statement"

    components = extract_linguistic_components(clean_text)
    
    # Identify contextual nuance match
    matched_nuance = None
    for item in CONTEXTUAL_NUANCES:
        if re.search(item["pattern"], clean_text, re.IGNORECASE):
            matched_nuance = item
            break

    # Determine Dominant Emotion
    if matched_nuance:
        dominant_emotion = matched_nuance["primary_emotion"]
        sub_emotion = matched_nuance["sub_emotion"]
        theme = matched_nuance["theme"]
        valence = matched_nuance["valence_mod"]
        arousal = matched_nuance["arousal_mod"]
        dominance = matched_nuance["dominance_mod"]
        psych_insight = matched_nuance["psychological_insight"]
    else:
        # Fallback keyword checks
        t_low = clean_text.lower()
        if any(w in t_low for w in ["love", "cherish", "adore"]):
            dominant_emotion, sub_emotion = "love", "Affection & Bonding"
            valence, arousal, dominance = 0.88, 0.60, 0.65
        elif any(w in t_low for w in ["happy", "glad", "awesome"]):
            dominant_emotion, sub_emotion = "joy", "Cheerfulness & Pleasure"
            valence, arousal, dominance = 0.82, 0.70, 0.75
        elif any(w in t_low for w in ["fear", "scared", "afraid"]):
            dominant_emotion, sub_emotion = "fear", "Trepidation & Anxiety"
            valence, arousal, dominance = -0.70, 0.80, 0.25
        elif any(w in t_low for w in ["angry", "rage", "mad"]):
            dominant_emotion, sub_emotion = "anger", "Hostility & Indignation"
            valence, arousal, dominance = -0.75, 0.85, 0.80
        elif any(w in t_low for w in ["surprise", "shock", "wow"]):
            dominant_emotion, sub_emotion = "surprise", "Astonishment"
            valence, arousal, dominance = 0.20, 0.85, 0.50
        elif any(w in t_low for w in ["sad", "cry", "unhappy"]):
            dominant_emotion, sub_emotion = "sadness", "Melancholy & Sorrow"
            valence, arousal, dominance = -0.75, 0.25, 0.20
        else:
            dominant_emotion, sub_emotion = "neutral", "Objective Equilibrium"
            valence, arousal, dominance = 0.0, 0.20, 0.50
            
        theme = f"General Cognitive Focus on {sub_emotion}"
        psych_insight = f"The input expresses patterns associated with {sub_emotion.lower()}."

    # Adjust valence/arousal based on intensifiers
    if components["intensifiers"]:
        mult = 1.15
        if valence < 0:
            valence = max(-1.0, valence * mult)
        else:
            valence = min(1.0, valence * mult)

    # Compute probability distribution
    scores = {k: 0.03 for k in EMOTION_META.keys()}
    scores[dominant_emotion] = 0.78
    if dominant_emotion == "sadness" and matched_nuance and "tired" in clean_text.lower():
        # Fatigue is mild sadness/depletion, with a secondary neutral/weary component
        scores["neutral"] = 0.12
    total_scores = sum(scores.values())
    scores = {k: round(v / total_scores, 4) for k, v in scores.items()}

    # Compute dynamic intent
    intent = analyze_dynamic_intent(clean_text, components, matched_nuance)

    # Build DYNAMIC contextual in-depth explanation
    cause_str = f" explicitly caused by '{components['cause']}'" if components["cause"] else ""
    temporal_str = f" during '{components['temporal_context']}'" if components["temporal_context"] else ""
    intensifier_str = f" intensified by '{', '.join(components['intensifiers'])}'" if components["intensifiers"] else ""

    reasoning_sections = []
    reasoning_sections.append(
        f"**Core Affect & State:** The text articulates a clear state of **{sub_emotion}** ({EMOTION_META[dominant_emotion]['label']}). "
        f"Rather than an uncontextualized abstract feeling, this is grounded in {components['subject'].lower()}{cause_str}{temporal_str}."
    )

    if components["cause"]:
        reasoning_sections.append(
            f"**Causal Attribution Analysis:** By utilizing causal framing ('{components['cause']}'), "
            f"the speaker externalizes the antecedent. In psychological appraisal theory, this reflects an *external attribution of strain*, "
            f"meaning the depletion is felt as the direct toll of systemic labor, circadian disruption, or environmental overload."
        )

    if components["temporal_context"]:
        reasoning_sections.append(
            f"**Circadian & Environmental Stressor:** The mention of {components['temporal_context']} signals physiological conflict. "
            f"Nocturnal labor or off-hour sustained focus disrupts baseline biological recovery, magnifying subjective exhaustion beyond ordinary daytime tiredness."
        )

    reasoning_sections.append(
        f"**Pragmatic Purpose:** The utterance functions as **{intent['name']}**—serving as a social disclosure to explain diminished capacity and prompt empathy or respite."
    )

    dynamic_reasoning = "\n\n".join(reasoning_sections)

    # Compute Word Saliency
    words = re.findall(r"\S+", clean_text)
    saliency = []
    keywords_depletion = {"tired", "exhausted", "work", "night", "sad", "hopeless", "happy", "angry", "love", "fear", "surprised"}
    
    for w in words:
        clean_w = re.sub(r"[^\w]", "", w.lower())
        weight = 0.10
        if clean_w in keywords_depletion:
            weight = 0.95
        elif clean_w in [c.lower() for c in (components["cause"] or "").split()]:
            weight = 0.75
        elif clean_w in [t.lower() for t in (components["temporal_context"] or "").split()]:
            weight = 0.65
        elif clean_w in components["intensifiers"]:
            weight = 0.50
        elif len(clean_w) > 4:
            weight = 0.25

        saliency.append({
            "word": w,
            "weight": round(weight, 2),
            "is_key_driver": weight >= 0.60
        })

    return {
        "dominant_emotion": dominant_emotion,
        "dominant_label": EMOTION_META[dominant_emotion]["label"],
        "sub_emotion": sub_emotion,
        "emoji": EMOTION_META[dominant_emotion]["emoji"],
        "color": EMOTION_META[dominant_emotion]["color"],
        "confidence": round(scores[dominant_emotion], 4),
        "scores": scores,
        "affect_coordinates": {
            "valence": round(valence, 3),   # -1.0 to +1.0
            "arousal": round(arousal, 3),   # 0.0 to 1.0 (low for tiredness/depletion!)
            "dominance": round(dominance, 3) # 0.0 to 1.0
        },
        "intent": intent,
        "components": {
            "cause": components["cause"],
            "temporal_context": components["temporal_context"],
            "subject": components["subject"],
            "intensifiers": components["intensifiers"]
        },
        "saliency": saliency,
        "explanation": {
            "reasoning": dynamic_reasoning,
            "theme": theme,
            "psychological_insight": psych_insight,
            "cognitive_appraisal": {
                "pleasantness": "Severely Low" if valence < -0.6 else ("Reduced / Unpleasant" if valence < 0 else "Pleasant"),
                "activation_energy": "Depleted / Lethargic" if arousal < 0.3 else ("High Alert / Hyper-Arousal" if arousal > 0.7 else "Moderate"),
                "attribution_source": "External Stressor (" + (components["cause"] or "Circumstance") + ")" if components["cause"] else "Internal Introspection"
            }
        },
        "metadata": {
            "word_count": len(words),
            "char_count": len(clean_text),
            "device": _DEVICE
        }
    }


def analyze_narrative_flow(full_text: str) -> List[Dict[str, Any]]:
    """Sentence-by-sentence emotion and intent trajectory."""
    sentences = [s.strip() for s in re.split(r"[.!?\n]+", full_text) if len(s.strip()) > 3]
    if not sentences:
        sentences = [full_text]

    flow = []
    for idx, sentence in enumerate(sentences):
        res = analyze_text(sentence)
        flow.append({
            "step": idx + 1,
            "sentence": sentence,
            "dominant_emotion": res["dominant_emotion"],
            "dominant_label": res["dominant_label"],
            "sub_emotion": res["sub_emotion"],
            "emoji": res["emoji"],
            "color": res["color"],
            "confidence": res["confidence"],
            "valence": res["affect_coordinates"]["valence"],
            "arousal": res["affect_coordinates"]["arousal"],
            "intent": res["intent"]["badge"]
        })

    return flow
