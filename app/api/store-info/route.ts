import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for demo purposes
// In a real app, this would use ChromaDB or another vector database
const userInfoStorage: Record<string, Array<{ info: string; timestamp: string; id: string }>> = {}

export async function POST(request: NextRequest) {
  try {
    const { username, info } = await request.json()

    // Validate input
    if (!username || typeof username !== "string" || username.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    if (!info || typeof info !== "string" || info.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Information is required" }, { status: 400 })
    }

    const cleanUsername = username.trim()
    const cleanInfo = info.trim()

    // Initialize user storage if it doesn't exist
    if (!userInfoStorage[cleanUsername]) {
      userInfoStorage[cleanUsername] = []
    }

    // Create new info entry
    const newEntry = {
      id: Date.now().toString(),
      info: cleanInfo,
      timestamp: new Date().toISOString(),
    }

    // Store the information
    userInfoStorage[cleanUsername].push(newEntry)

    console.log(`Stored information for ${cleanUsername}:`, cleanInfo.substring(0, 100) + "...")

    // In a real implementation, this would:
    // 1. Connect to ChromaDB
    // 2. Create embeddings for the text
    // 3. Store with metadata (username, timestamp, etc.)
    // 4. Enable semantic search capabilities

    return NextResponse.json({
      success: true,
      message: "Information stored successfully",
      entryId: newEntry.id,
      timestamp: newEntry.timestamp,
    })
  } catch (error) {
    console.error("Store info API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to retrieve stored information (for future use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (!username) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    const userInfo = userInfoStorage[username] || []

    return NextResponse.json({
      success: true,
      data: userInfo,
      count: userInfo.length,
    })
  } catch (error) {
    console.error("Get info API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
