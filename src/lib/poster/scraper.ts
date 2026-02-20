import puppeteer from 'puppeteer';
import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// Configure the AI provider (same as provider.ts but locally scoped if needed, or import)
// We'll interpret the env vars here manually to avoid circular deps or complex config
const AI_GATEWAY_BASE_URL = process.env.AI_GATEWAY_BASE_URL || "https://gateway.ai.cloudflare.com/v1/ACCOUNT/TAG";
const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY || "";

// Re-create provider instance for VLM specifically
const openai = createOpenAICompatible({
    name: 'openai-compatible',
    baseURL: AI_GATEWAY_BASE_URL,
    headers: {
        'x-portkey-provider': 'openai',
        'Authorization': `Bearer ${AI_GATEWAY_API_KEY}`,
        'Content-Type': 'application/json'
    }
});

export type ScrapedContent = {
    url: string;
    screenshotBase64?: string;
    extractedText: string; // From VLM or DOM
    visualVibe: string;   // Analysis of colors/mood
};

export async function scrapeUrl(url: string): Promise<ScrapedContent> {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Emulate a desktop viewport but tall to capture detail page intro
        await page.setViewport({ width: 1280, height: 2000 });

        // Timeout 15s to be safe
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 }).catch(e => console.error("Nav timeout (continuing):", e));

        // 1. Capture Screenshot (Base64)
        // We capture the viewable area (which is tall due to viewport)
        const screenshotBuffer = await page.screenshot({ encoding: "base64", fullPage: false });
        const screenshotBase64 = `data:image/png;base64,${screenshotBuffer}`;

        // 2. DOM Text Extraction (Backup/Complementary)
        // const domText = await page.evaluate(() => document.body.innerText.slice(0, 5000));

        // 3. VLM Analysis (GPT-4o)
        // We ask GPT-4o to "Read everything" and "Analyze vibe".
        const vlmResponse = await generateText({
            model: openai('gpt-4o'),
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "You are a Vision Scraper. 1) Transcribe ALL visible text in this image, especially Product Specs, CEO Message, Brand Story. 2) Describe the visual vibe (Colors, Mood, Photography Style). Output format: [TEXT] ... [VIBE] ..." },
                        { type: "image", image: screenshotBase64 }
                    ]
                }
            ]
        });

        const vlmOutput = vlmResponse.text;
        const [extractedText, visualVibe] = parseVlmOutput(vlmOutput);

        return {
            url,
            screenshotBase64: screenshotBase64.slice(0, 100) + "...", // Truncate for log, but we might want to keep it if we display it. Actually for now let's don't store huge string in memory if not needed.
            extractedText: extractedText.trim(),
            visualVibe: visualVibe.trim()
        };

    } catch (error) {
        console.error("Scraping failed:", error);
        return {
            url,
            extractedText: "",
            visualVibe: "Failed to scrape."
        };
    } finally {
        if (browser) await browser.close();
    }
}

function parseVlmOutput(text: string): [string, string] {
    // Simple parsing based on the prompt markers
    const textPart = text.split("[VIBE]")[0]?.replace("[TEXT]", "").trim() || "";
    const vibePart = text.split("[VIBE]")[1]?.trim() || "";
    return [textPart, vibePart];
}
