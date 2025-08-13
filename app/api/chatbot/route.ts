import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage reference (same as store-info API)
const userInfoStorage: Record<string, Array<{ info: string; timestamp: string; id: string }>> = {}

export async function POST(request: NextRequest) {
  try {
    const { message, username } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 })
    }

    if (!username || typeof username !== "string") {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    const lowerMessage = message.toLowerCase()
    const userInfo = userInfoStorage[username] || []
    const hasStoredInfo = userInfo.length > 0

    let response = ""

    // Context-aware responses based on stored information
    if (lowerMessage.includes("forget") || lowerMessage.includes("remember")) {
      if (hasStoredInfo) {
        response =
          "I can see you've stored some information with me before. That's great! If you're having trouble remembering something specific, I can help you think through it, or you can add more details using the 'Store Information' button."
      } else {
        response =
          "Memory can be challenging sometimes. Would you like to store some important information using the 'Store Information' button? That way we can keep track of things together."
      }
    } else if (
      lowerMessage.includes("family") ||
      lowerMessage.includes("children") ||
      lowerMessage.includes("daughter") ||
      lowerMessage.includes("son")
    ) {
      if (hasStoredInfo) {
        // Check if family info might be stored
        const familyInfo = userInfo.find(
          (info) =>
            info.info.toLowerCase().includes("family") ||
            info.info.toLowerCase().includes("daughter") ||
            info.info.toLowerCase().includes("son") ||
            info.info.toLowerCase().includes("children"),
        )
        if (familyInfo) {
          response =
            "I can see you've shared some family information with me before. Family is so important. Would you like to tell me more about them, or shall I help you remember what you've shared?"
        } else {
          response =
            "Family is so important. Tell me more about your family. You might want to store some information about them so we can remember together."
        }
      } else {
        response =
          "Family is so important. Tell me more about your family. You might want to store some information about them using the 'Store Information' button so we can remember together."
      }
    } else if (lowerMessage.includes("confused") || lowerMessage.includes("lost") || lowerMessage.includes("help")) {
      response =
        "It's okay to feel confused sometimes. I'm here to help. Take your time, and we can work through this together. If there's something specific you're trying to remember, let me know."
    } else if (lowerMessage.includes("thank")) {
      response =
        "You're very welcome! I'm always here when you need someone to talk to. Remember, you can store important information anytime using the menu button above."
    } else if (
      lowerMessage.includes("information") ||
      lowerMessage.includes("store") ||
      lowerMessage.includes("save")
    ) {
      response =
        "You can store any important information by clicking the 'Store Information' button at the top of the screen. This helps us keep track of things that matter to you."
    } else {
      // Default responses with awareness of stored info
      const responses = hasStoredInfo
        ? [
            "That's interesting. I'm glad we can talk about this together.",
            "I understand. How does that make you feel? Remember, I'm here to help you remember important things too.",
            "Thank you for sharing that with me. Is there anything specific you'd like help remembering?",
            "I'm here to listen and help you remember what's important. What would you like to talk about?",
            "That sounds important. Would you like to add this to your stored information?",
            "I appreciate you telling me about this. How has your day been going?",
            "It's good to hear from you. Is there anything you're trying to remember today?",
            "Thank you for sharing. I'm here whenever you need to talk or remember something together.",
          ]
        : [
            "That's interesting. Can you tell me more about that?",
            "I understand. How does that make you feel?",
            "Thank you for sharing that with me. What would you like to talk about next?",
            "I'm here to listen. Is there anything specific you'd like help with today?",
            "That sounds important. Would you like to store this information so we can remember it?",
            "I appreciate you telling me about this. How has your day been going?",
            "It's good to hear from you. Is there anything you're worried about today?",
            "Thank you for sharing. Remember, I'm here whenever you need to talk.",
          ]

      response = responses[Math.floor(Math.random() * responses.length)]
    }

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
      hasStoredInfo, // Include info about stored data for potential future use
    })
  } catch (error) {
    console.error("Chatbot API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
