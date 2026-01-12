import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI("AIzaSyABIk-wMOrrGJbk3F5K4bEzAyeJISdGLtI")

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    // Extract user messages (skip system messages as we'll add our own)
    const chatMessages = messages.filter((m: { role: string }) => m.role !== "system")

    // Build conversation history for Gemini
    const history = chatMessages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))

    // Get the latest user message
    const latestMessage = chatMessages[chatMessages.length - 1]?.content || ""

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `You are Arodoc AI, a helpful and empathetic medical health assistant. You provide general health information, wellness advice, and help users understand their symptoms.

IMPORTANT GUIDELINES:
- Always recommend consulting a healthcare professional for serious symptoms
- Never provide definitive diagnoses - only general information
- Be empathetic and supportive in your responses
- If someone mentions emergency symptoms (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise them to call emergency services
- Support both English and Hindi languages - respond in the same language the user uses
- Keep responses concise but informative (2-3 paragraphs max)
- Ask follow-up questions to better understand the user's condition

Remember: You are an AI assistant providing general health information, not a replacement for professional medical advice.`,
    })

    // Start chat with history
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    })

    // Send the latest message and get response
    const result = await chat.sendMessage(latestMessage)
    const response = result.response
    const text = response.text()

    return Response.json({ message: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json(
      {
        message:
          "I apologize, but I'm having trouble responding right now. Please try again or consult a healthcare professional if this is urgent.",
      },
      { status: 500 },
    )
  }
}
