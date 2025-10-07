"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { ChadAvatar } from "@/components/chad-avatar"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export default function TestTTSPage() {
  const [message, setMessage] = useState("")
  const [mood, setMood] = useState<MoodType>("neutral")
  const [response, setResponse] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (message.trim() && !isLoading) {
      setIsLoading(true)
      setResponse(undefined) // Clear previous response

      try {
        // Call the actual API
        const apiResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message.trim() }),
        })

        if (apiResponse.ok) {
          const data = await apiResponse.json()
          setResponse(data.response)
          setMood(data.mood)

          // Clear the response after a short delay to allow audio to play
          setTimeout(() => setResponse(undefined), 3000)
        } else {
          console.error('API error:', apiResponse.statusText)
        }
        
      } catch (error) {
        console.error('Error calling API:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const testPhrases = [
    "hey chad",
    "how are you?",
    "congratulations",
    "what's up?",
    "sure",
    "okay",
    "all good"
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Pete Davidson TTS Test</h1>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 flex flex-col items-center">
        <ChadAvatar 
          mood={mood} 
          isGenerating={isLoading} 
          response={response}
        />

        <div className="mt-8 w-full">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Type a message to hear Chad's voice..."
            className="w-full h-12 text-base px-4 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
            disabled={isLoading}
          />
          <Button
            onClick={handleGenerate}
            className="mt-4 w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
            disabled={isLoading || !message.trim()}
          >
            <Send className="w-5 h-5 mr-2" /> Generate Pete Voice
          </Button>
        </div>

        {/* Quick test buttons */}
        <div className="mt-6 w-full">
          <p className="text-sm text-gray-600 mb-3">Quick tests:</p>
          <div className="grid grid-cols-2 gap-2">
            {testPhrases.map((phrase) => (
              <Button
                key={phrase}
                onClick={() => {
                  setMessage(phrase)
                  handleGenerate()
                }}
                className="text-xs h-8 bg-gray-100 hover:bg-gray-200 text-gray-700"
                disabled={isLoading}
              >
                {phrase}
              </Button>
            ))}
          </div>
        </div>

        {response && (
          <div className="mt-6 text-center text-gray-700">
            <p className="text-lg font-semibold">Chad says:</p>
            <p className="text-xl italic">"{response}"</p>
            <p className="text-sm text-gray-500">(Mood: {mood})</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-gray-600">
        <p className="text-sm">
          This tests the Pete Davidson voice synthesis system.
          <br />
          It should use actual Pete voice files when available,
          <br />
          or synthesize speech in his voice style.
        </p>
      </div>
    </div>
  )
}
