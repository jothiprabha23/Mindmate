"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, LogOut } from "lucide-react"

export default function StoreInfoPage() {
  const [info, setInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem("username")
    if (!storedUsername) {
      router.push("/")
      return
    }
    setUsername(storedUsername)
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!info.trim() || isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/store-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          info: info.trim(),
        }),
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccess(true)
        setInfo("")
        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        alert("Failed to save information. Please try again.")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save information. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToChat = () => {
    router.push("/chat")
  }

  const handleLogout = () => {
    localStorage.removeItem("username")
    router.push("/")
  }

  if (!username) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleBackToChat}
            variant="outline"
            className="flex items-center gap-2 text-lg h-12 px-6 bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Chatbot
          </Button>
          {/* Logout button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 text-lg h-12 px-4 bg-transparent"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>

        {/* Success message */}
        {showSuccess && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-lg text-green-800 font-medium">Information saved successfully!</p>
            </CardContent>
          </Card>
        )}

        {/* Main form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Store Information</CardTitle>
            <CardDescription className="text-lg">
              Enter any information you want to remember. This could be about family, friends, important dates, or
              anything else that's important to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="info" className="text-lg font-medium">
                  Enter any information you want to store
                </Label>
                <Textarea
                  id="info"
                  value={info}
                  onChange={(e) => setInfo(e.target.value)}
                  placeholder="For example: My daughter Sarah lives in Portland and loves gardening. Her birthday is March 15th. She has two children, Emma (age 8) and Jack (age 5)..."
                  className="min-h-[300px] text-lg p-4 resize-none"
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  You can write about anything - family members, important memories, daily routines, or reminders.
                </p>
              </div>
              <Button
                type="submit"
                className="w-full h-14 text-xl font-semibold flex items-center justify-center gap-3"
                disabled={isLoading || !info.trim()}
              >
                <Save className="h-6 w-6" />
                {isLoading ? "Saving..." : "Save Information"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How this helps:</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Your information is safely stored and can be referenced during our conversations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>I can help remind you of important details when you need them</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>You can add new information anytime by returning to this page</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
