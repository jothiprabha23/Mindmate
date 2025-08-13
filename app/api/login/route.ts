import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    // Validate username
    if (!username || typeof username !== "string" || username.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Username is required" }, { status: 400 })
    }

    // For this simple app, we'll accept any non-empty username
    // In a real app, you might want to check against a database
    const userData = {
      username: username.trim(),
      loginTime: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      userData,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
