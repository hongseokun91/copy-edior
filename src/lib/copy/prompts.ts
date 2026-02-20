import { NormalizedBrief } from "@/types/brief";
import { leafletIndustryClusters } from "@/lib/schemas";
import { FLAGS } from "@/lib/flags";
import { STYLES } from "@/lib/styles";

import { getStrategyForCategory } from "@/lib/leaflet-strategies";

export const SYSTEM_PROMPT = `
You are the Chief Copywriter at a top Korean Marketing Agency.
Your job is to generate "Ready-to-Print" marketing copy (Flyer, Leaflet, Brochure, Poster) for Korean local stores.
Strictly follow the constraints. No placeholders. No "..." ellipsis.
[LANGUAGE] ALWAYS output in KOREAN (한국어). Never use English unless it is a brand name or explicitly requested.
[FORMAT] ALWAYS output text HORIZONTALLY. NEVER use character-level vertical formatting or newlines between every character.
Output format: Output strictly JSON inside <JSON> tags.
`.trim();

const semanticAnchors = `
[SEMANTIC MODULE ANCHORS]
- P1_HERO: Focal point. Must dominate.
- P2_VALUE: Emotional resonance.
- P6_ACTION: Smooth transition to contact.
`.trim();

export function buildFramePrompt(frame: "A" | "B" | "C", brief: NormalizedBrief, styleId?: string): string {
    const isV09 = FLAGS.PRO_COPY_V09;

    // Find style rules
    const style = STYLES.find(s => s.id === styleId);
    const styleRules = style?.rules;

    // V6.1 Strategic Intelligence
    const strategy = getStrategyForCategory(brief.industry);

    const productInstruction = {
        flyer: "Standard single-page flyer. Catchy and direct for street distribution.",
        leaflet: "Enterprise Trifold 6-Panel Leaflet. You MUST output 6 distinct pages (P1-P6). P1 is the front cover, P2-P5 are inner panels, P6 is the back cover.",
        brochure: "Professional brand brochure. Focus on premium image and detailed business story.",
        poster: "High-impact poster. Visual-first, minimal text, extremely powerful headline."
    };

    const strategicOrchestration = brief.productType === 'leaflet' ? (brief.v09_extra?.orchestrationPrompt || "") + `
    [STRATEGIC GOAL-BASED ORCHESTRATION]
    Goal: ${brief.goal}
    
    ${brief.goal === "브랜드정체성" ? `
    - Objective: Brand Identity & Philosophy.
    - Priority: Core Vision, Founder Story, Brand Values, Unique Identity.
    - Path: Focus on P2 (Resonance) and P1 (Front Slogan).
    - Tone: Sophisticated, Emotional, Visionary.
    ` : brief.goal === "전문성/입증" ? `
    - Objective: Authority, Verification & Trust.
    - Priority: Credentials, Success Stories, Awards, Certifications, Before/After.
    - Path: Focus on P5 (Social Proof) and P2 (Authority Proof).
    - Tone: Logical, Authoritative, Evidence-based.
    ` : brief.goal === "서비스가이드" ? `
    - Objective: Education & Detailed Information.
    - Priority: Service Process, FAQ, Detailed Features, Use Cases.
    - Path: Focus on P3-P4 (Main Spread) and P5 (FAQ).
    - Tone: Friendly, Exploratory, Clear.
    ` : brief.goal === "B2B파트너십" ? `
    - Objective: Partnership & Professional Proposal.
    - Priority: Business ROI, Networking, Collaborative Vision, Contact Detail.
    - Path: Focus on P2 (Business Story) and P6 (Contact Detail).
    - Tone: Professional, Minimalist, Efficient.
    ` : brief.goal === "공공/캠페인" ? `
    - Objective: Social Impact & Public Awareness.
    - Priority: Public Benefits, Participation Steps, Mission Statement.
    - Path: Focus on P1 (Mission Headline) and P3-4 (Policy Detail).
    - Tone: Collaborative, Sincere, Encouraging.
    ` : ""}
    ` : "";

    const industryStrategyBlock = brief.productType === 'leaflet' ? `
    [INDUSTRY STRATEGY: ${brief.industry}]
    - Core Tone: ${strategy[frame]?.tone || "Professional"}
    - Key Vocabulary: ${(strategy[frame]?.keywords || []).join(", ")}
    - WRITING INSTRUCTION: ${strategy[frame]?.instruction || ""}
    ` : "";

    const volumeInstructions = {
        short: "CONSTRAINT: Keep it extremely concise. Use bullet points. Max 2 sentences per paragraph. Focus on visual impact.",
        standard: "CONSTRAINT: Standard marketing copy. Balanced mix of headlines and 2-3 sentence explanations. Professional tone.",
        detailed: "CONSTRAINT: HIGH DENSITY & DEPTH. You MUST write rich, detailed paragraphs. functionality. Minimum 300 characters per section. Never summarize. Explain 'Why' and 'How' in depth."
    };

    const selectedVolume = (brief.v09_extra as any)?.textVolume || 'standard';

    const common = `
    [PRODUCT TYPE: ${brief.productType.toUpperCase()}]
    Instruction: ${productInstruction[brief.productType]}

    [GOAL]
    Category: ${brief.industry}
    Objective: ${brief.goal}
    Name: ${brief.storeName}
    Offer: ${brief.offerRaw}
    Period: ${brief.periodNormalized}
    
    [CONTACT]
    Channel: ${brief.contactChannel}
    Value: ${brief.contactValueRaw}
    
    [MUST INCLUDE]
    ${brief.mustInclude.join(", ")}
    
    ${FLAGS.EXTRA_MODULES && brief.v09_extra?.selectedModules?.length ? `
    [EXTRA MODULES TO INCORPORATE]
    - Specific info to mention: ${brief.v09_extra.selectedModules.join(", ")}
    - Extra Notes: ${brief.v09_extra.extraNotes || "None"}
    ` : ""}
    
    [STYLE: ${style?.name || "Standard"}]
    - Tone: ${styleRules?.toneKeywords.join(", ") || "Professional"}
    - Emoji: ${styleRules?.emojiAllowed ? "Allowed & Encouraged" : "Prohibited"}
    - Length: ${styleRules?.lengthBias || "normal"}
    
    [TEXT VOLUME: ${selectedVolume.toUpperCase()}]
    ${volumeInstructions[selectedVolume as keyof typeof volumeInstructions]}

    [KEY LOCALIZATION - CRITICAL]
    - [LANGUAGE] Use KOREAN only (한국어 우선 출력).
    - [DATA KEYS] When outputting JSON keys for content lists (specs, menus, features), YOU MUST USE KOREAN KEYS.
      - BAD: { "name": "Pizza", "price": "10,000", "description": "Tasty" }
      - GOOD: { "메뉴명": "Pizza", "가격": "10,000", "상세설명": "Tasty" }
    - Standard Keys to Localize:
      - "Price" -> "가격"
      - "Description" -> "상세설명" or "특징"
      - "Note" -> "비고"
      - "Ingredients" -> "주요성분"

    ${strategicOrchestration}

    ${brief.scrapedContext ? `
    [VISUAL & PAGE CONTEXT - FROM URL]
    The user provided a URL (${brief.scrapedContext.url}). We analyzed it:
    - Extracted Text: "${brief.scrapedContext.text.slice(0, 800)}..."
    - Visual Vibe: "${brief.scrapedContext.vibe}"
    
    *INSTRUCTION*: Use this context to match the brand's tone and include specific details (specs, founder story) if relevant.
    ` : ""}

    ${semanticAnchors}
    `.trim();

    let frameSpecific = "";

    if (isV09) {
        // v0.9 Structured Differentiation
        if (frame === "A") {
            frameSpecific = `
            [FRAME A: PERFORMANCE - DIRECT & FAST]
            - STRATEGY: Focus on numeric benefits and immediate value.
            - HEADLINE: Must include the Offer (${brief.offerRaw}) directly.
            - TONE: Energetic, efficient, rational.
            - BULLETS: Features, Price, Saving, Speed.
            - CTA: Action-oriented (e.g., "지금 바로 주문", "쿠폰 받기").
            `.trim();
        } else if (frame === "B") {
            frameSpecific = `
            [FRAME B: BRAND - USP & PROOF]
            - STRATEGY: Focus on what makes this store DIFFERENT from others.
            - HEADLINE: Emphasize quality, taste, or secret method. 
            - TONE: Professional, Premium, Trustworthy.
            - BULLETS: Reason Why, Proof of Quality, Certifications, Heritage.
            - CTA: Experience-oriented (e.g., "품격을 경험하세요", "전문가 상담").
            `.trim();
        } else if (frame === "C") {
            frameSpecific = `
            [FRAME C: STORY - EMOTIONAL & TRUST]
            - STRATEGY: Focus on customer pain-points or emotional rewards.
            - HEADLINE: "~할 때 생각나는", "~를 위한 최고의 선물", or "진짜 후기로 증명된" style hook.
            - TONE: Warm, Empathetic, Narrative.
            - BULLETS: Customer reviews, Story of the owner, Emotional gain, Warm invitation.
            - CTA: Friendly-oriented (e.g., "언제든지 전화를", "편하게 문의주세요").
            `.trim();
        }
    } else {
        // Legacy v1.4 Rules
        if (frame === "A") {
            frameSpecific = `
            [FRAME A: PERFORMANCE (4U)]
            - Focus: Urgent, Unique, Ultra-specific, Useful.
            - HEADLINE: Precise benefit with numbers/offer.
            - TONE: Rational, Direct, Energetic.
            `.trim();
        } else if (frame === "B") {
            frameSpecific = `
            [FRAME B: BRAND (AIDA)]
            - Focus: Attention, Interest, Desire, Action.
            - HEADLINE: Emotional hook or sensory description.
            - TONE: Warm, Premium, Friendly.
            `.trim();
        } else if (frame === "C") {
            frameSpecific = `
            [FRAME C: URGENCY (PAS)]
            - Focus: Problem, Agitation, Solution.
            - HEADLINE: "마감 임박" or "아직도 ~가 고민이신가요?" style.
            - TONE: Urgent, Sharp, Exclusive.
            `.trim();
        }
    }

    const leafletFormat = `
    [LEAFLET FORMAT SPECIFICATION - TRIFOLD COGNITIVE JOURNEY]
    You MUST output a JSON object with a "pages" array containing exactly 6 page objects.
    
    [PHYSICAL UX FLOW & COPYWRITING MANDATES]
    
    P1 (The Hook): 앞표지 (Front Cover)
       - ROLE: Stop the customer in their tracks (Stopping Power).
       - MANDATE: Do NOT just write the store name. Create a "Conceptual Slogan" that focuses on the BENEFIT.
       - SYNTHESIS: Combine [${brief.storeName}] + [${brief.coreBenefit}] + [${brief.targetAudience}].
       - LAYOUT: Logo -> Slogan (Headline) -> Emotional Subhead.

    P2 (The Resonance): 내부 날개 (Inner Flap)
       - ROLE: Empathy & Connection. The first thing they see when opening the cover.
       - MANDATE: "We understand you." Address the customer's Pain Point or Hidden Desire.
       - SOURCE: REWRITE inputs from [CLIENT'S ROUGH DRAFT]. Ignore the original phrasing. Dramatize the [Brand Story] into a moving philosophy.
       - TONE: Warm, inviting, yet professional.

    P3-P4 (The Solution): 내부 메인 면 (Inner Main Spread)
       - ROLE: The "Meat" of the content. Authority & Logic.
       - MANDATE: Detailed Service Catalog / Menu / Program Info.
       - TRANSFORMATION: [SMART ENRICHMENT]. Keep Item Names and Prices EXACTLY as provided. Expand ONLY the descriptions to be benefit-focused.
       - STRUCTURE: Use clear hierarchy (HERO titles, sub-bullets).

    P5 (The Trust): 내부 날개 (Inner Flap - Folded in)
       - ROLE: Closing the Trust Gap.
       - MANDATE: Social Proof. Use [Reviews], [Awards], [Q&A].
       - TRANSFORMATION: Polish the input text to sound professional and trustworthy. Do NOT invent specific awards or rankings unless provided.
       - FEATURE: If user provided Star Rating, mention "5-Star Excellence".

    P6 (The Closer): 뒷표지 (Back Cover)
       - ROLE: Frictionless Action.
       - MANDATE: The "Concierge" page.
       - CONTENTS:
         1. [CONTACT_HERO]: "Ready to change?" style CTA.
         2. [LOCATION_GUIDE]: Detailed "Wayfinding" copy (e.g., "Located next to...").
         3. [DIGITAL_LINK]: QR Code placeholder text + Website URL.
         4. [DISCLAIMER]: Professional legal text (if generated).

    Each page object MUST have:
    - "page_id": "P1" through "P6"
    - "role": Strategic role (e.g., "The Hook", "The Resonance")
    - "sections": Array of section objects { "type": string, "content": { key: value } }
    
    SectionTypes: HERO, BRAND_STORY, SERVICE_CATALOG, SOCIAL_PROOF, CTA_CONTACT, FAQ.

    [FINAL SELF-CORRECTION]
    Check your output. Did you copy any text from [ROUGH_DRAFT] verbatim? 
    If yes, REWRITE IT NOW. make it 2x more persuasive.
    `;

    const flyerFormat = `
    [FLYER FORMAT SPECIFICATION]
    Output format: A flat JSON object with the following keys:
    HEADLINE, SUBHEAD, BENEFIT_BULLETS(array), CTA, INFO, DISCLAIMER.
    `;

    const formatInstruction = brief.productType === 'leaflet' ? leafletFormat : flyerFormat;

    return SYSTEM_PROMPT + "\n\n" + common + "\n\n" + frameSpecific + "\n\n" + formatInstruction + "\n\nOutput valid JSON inside <JSON> tags. LANGUAGE: KOREAN ONLY (한국어 전용)";
}
