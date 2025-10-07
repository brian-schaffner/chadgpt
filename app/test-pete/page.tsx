"use client"

import { useState } from "react"

export default function TestPetePage() {
  const [currentVoice, setCurrentVoice] = useState<string>("")
  const [isPlaying, setIsPlaying] = useState(false)

  const peteVoices = {
    "Chad on Mars": "/pete_chad_sample.wav",
    "Pete Monologue": "/pete_monologue_sample.wav", 
    "Chad Ever": "/pete_chad_ever_sample.wav"
  }

  const playVoice = async (voiceName: string, voiceFile: string) => {
    try {
      setIsPlaying(true)
      setCurrentVoice(voiceName)
      
      const audio = new Audio(voiceFile)
      audio.volume = 0.8
      
      await audio.play()
      
      audio.onended = () => {
        setIsPlaying(false)
        setCurrentVoice("")
      }
      
    } catch (error) {
      console.error("Voice play failed:", error)
      setIsPlaying(false)
      setCurrentVoice("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🎤 Pete Davidson Voice TTS Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Pete Davidson's Actual Voice</h2>
          <p className="text-gray-600 mb-6">
            These are 5-second samples from Pete Davidson's actual voice files extracted from his videos.
            This is his real voice, not synthetic TTS!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(peteVoices).map(([name, file]) => (
              <button
                key={name}
                onClick={() => playVoice(name, file)}
                disabled={isPlaying}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentVoice === name
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : isPlaying
                    ? "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <div className="text-lg font-medium">{name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {isPlaying && currentVoice === name ? "🔊 Playing..." : "Click to play"}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Integration Status</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>Pete Davidson voice files extracted (244MB total)</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>Voice samples created for web use</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>ChadAvatar updated to use Pete's voice</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-green-500">✅</span>
              <span>Mood-based voice selection working</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">How It Works:</h3>
            <ul className="text-blue-700 space-y-1">
              <li>• Chad's responses trigger Pete Davidson's actual voice</li>
              <li>• Mood-based selection (excited = Chad clips, neutral = monologue)</li>
              <li>• Falls back to original WAV files for specific phrases</li>
              <li>• Uses TTS only when no Pete voice is available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
