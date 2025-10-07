"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { ChadAvatar } from "@/components/chad-avatar"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChadGPTPage() {
  const [message, setMessage] = useState("")
  const [mood, setMood] = useState<MoodType>("neutral")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastChadResponse, setLastChadResponse] = useState<string | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const messageText = message.trim()
      
      const userMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        isUser: true,
        timestamp: new Date()
      }

              setMessages(prev => [...prev, userMessage])
              setMessage("")
              setLastChadResponse(undefined) // Clear previous response
              setIsLoading(true)

      try {
        // Call the chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageText }),
        })

        if (response.ok) {
          const data = await response.json()
          setMood(data.mood)
          
                  const chadMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.response,
                    isUser: false,
                    timestamp: new Date()
                  }

                  setMessages(prev => [...prev, chadMessage])
                  setLastChadResponse(data.response)
                  
                  // Clear the response after a longer delay to allow audio to play
                  setTimeout(() => setLastChadResponse(undefined), 2000)
          
          // Reset mood after animation
          setTimeout(() => setMood("neutral"), 3000)
        } else {
          console.error('Chat API error')
          setMood("apathetic")
          setTimeout(() => setMood("neutral"), 3000)
        }
      } catch (error) {
        console.error('Error calling chat API:', error)
        setMood("apathetic")
        setTimeout(() => setMood("neutral"), 3000)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
              {/* Chad Avatar - Fixed Position */}
              <div className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col items-center justify-center p-6 bg-white relative z-10">
                <ChadAvatar 
                  mood={mood} 
                  isGenerating={isLoading} 
                  response={lastChadResponse}
                />
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-semibold text-gray-800">ChadGPT</h2>
                  <p className="text-sm text-gray-500">Your chill AI assistant</p>
                </div>
              </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-white relative z-20">
        {/* Header - iMessage style */}
        <header className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">ChadGPT</h1>
              <p className="text-sm text-gray-500">Always available</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </header>

        {/* Messages - iMessage style */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-3 relative">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <p className="text-lg">Start a conversation with Chad!</p>
              <p className="text-sm mt-2">He's always ready to chat.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                  msg.isUser
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.isUser ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - iMessage style */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3 items-center max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message"
                className="w-full h-12 text-base px-4 pr-12 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors"
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSend}
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
              disabled={isLoading || !message.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
