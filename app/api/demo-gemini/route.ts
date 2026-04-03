import { GeminiService } from "@/lib/services/gemini.service";
import { simulateGeminiCall, getSimulatedMetadata } from "@/lib/mock-gemini";

export async function POST(request: Request) {
  try {
    const { prompt, temperature } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return Response.json(
        { success: false, error: "프롬프트를 입력해주세요." },
        { status: 400 }
      );
    }

    // Try real Gemini API first
    if (GeminiService.isConfigured()) {
      try {
        const result = await GeminiService.generateResponse(prompt, temperature);
        return Response.json({ success: true, ...result });
      } catch (err) {
        console.error("Gemini API failed, falling back to mock:", err);
      }
    }

    // Mock fallback
    const response = await simulateGeminiCall(prompt, { temperature });
    const metadata = getSimulatedMetadata();

    return Response.json({
      success: true,
      response,
      metadata,
    });
  } catch {
    return Response.json(
      { success: false, error: "API 호출 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
