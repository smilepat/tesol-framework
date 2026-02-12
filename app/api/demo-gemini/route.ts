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
