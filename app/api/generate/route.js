import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // STEP 1: AI correction untuk istilah medis
    const correctionPrompt = `
You are a professional medical editor.
Correct any mistakes in medical terms or phrasing in the following transcript, without changing its meaning:

Transcript:
"${text}"

Only provide the corrected transcript.
`;

    console.log('text : ', text)
    const correctionResult = await model.generateContent(correctionPrompt);
    const correctionResponse = await correctionResult.response;
    const correctedText = (await correctionResponse.text()).trim();
    console.log('corrected text : ', correctedText)

    // STEP 2: Translation
    const translationPrompt = `
You are a professional medical translator.
Translate the following text from ${sourceLang} to ${targetLang} accurately:

Text:
"${correctedText}"

Only provide the translated text.
`;
    const translationResult = await model.generateContent(translationPrompt);
    const translationResponse = await translationResult.response;
    const translatedText = (await translationResponse.text()).trim();

    return NextResponse.json({ output: translatedText });

  } catch (error) {
    // Handle rate limit 429
    if (error.message && error.message.includes("429")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a few seconds and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to generate" },
      { status: 500 }
    );
  }
}
