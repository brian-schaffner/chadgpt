"use client"

import { useState, useEffect, useRef } from "react"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

interface ChadAvatarProps {
  mood: MoodType
  isGenerating?: boolean
  response?: string
}

export function ChadAvatar({ mood, isGenerating = false, response }: ChadAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const AUDIO_SPEED = 1.6 // Fixed speed - 60% faster
  // No TTS - only audio files

  useEffect(() => {
    if (isGenerating) {
      setIsAnimating(true)
    } else {
      // Keep animation for a bit after response
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isGenerating])

  // Audio mapping for Chad's responses - ONLY play audio for exact matches
  const getAudioForResponse = (response: string): string | null => {
    if (!response || typeof response !== 'string') {
      return null
    }
    const lowerResponse = response.toLowerCase().trim()
    
    // Only play audio for exact matches - no fallback
    if (lowerResponse === "all good" || lowerResponse === "all good.") {
      return "/all good.mp3"
    } else if (lowerResponse === "okay" || lowerResponse === "okay.") {
      return "/okay.mp3"
    } else if (lowerResponse === "sure" || lowerResponse === "sure.") {
      return "/sure.mp3"
    } else if (lowerResponse === "word" || lowerResponse === "word.") {
      return "/word.mp3"
    } else if (lowerResponse === "haha" || lowerResponse === "haha.") {
      return "/haha.mp3"
    } else if (lowerResponse === "nah" || lowerResponse === "nah.") {
      return "/nah.mp3"
    } else {
      // No audio for unmatched responses
      return null
    }
  }

  // Audio playback with natural speed and pitch variation
  const playAudioWithVariation = (audioFile: string, baseSpeed: number) => {
    if (audioRef.current) {
      try {
        // Add slight speed variation (±0.1x)
        const speedVariation = baseSpeed + (Math.random() - 0.5) * 0.2
        const finalSpeed = Math.max(0.8, Math.min(2.0, speedVariation)) // Clamp between 0.8x and 2.0x
        
        // Add slight pitch variation using playbackRate (affects both speed and pitch)
        const pitchVariation = 1 + (Math.random() - 0.5) * 0.1 // ±5% pitch variation
        const finalPitch = Math.max(0.8, Math.min(1.2, pitchVariation)) // Clamp between 0.8x and 1.2x
        
        audioRef.current.src = audioFile
        audioRef.current.load()
        audioRef.current.playbackRate = finalSpeed * finalPitch
        audioRef.current.play().then(() => {
          console.log(`🎤 Playing audio at ${(finalSpeed * finalPitch).toFixed(2)}x speed with pitch variation:`, audioFile)
        }).catch(error => {
          console.log('🎤 Audio play failed:', error)
        })
      } catch (error) {
        console.log('🎤 Audio setup error:', error.message)
      }
    }
  }

  // Play audio when response matches - ONLY audio files, no TTS
  useEffect(() => {
    console.log('Audio useEffect triggered:', { response, isGenerating })
    if (response && !isGenerating) {
      const audioFile = getAudioForResponse(response)
      console.log('🎤 Using audio file for response:', response, '->', audioFile)
      
      if (audioFile) {
        // Play audio with natural speed and pitch variation
        playAudioWithVariation(audioFile, AUDIO_SPEED)
      } else {
        console.log('🎤 No audio file found for response:', response)
      }
    }
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [response, isGenerating, mood])

  return (
    <div className="relative">
      {/* Custom CSS for Chad's thinking animation */}
      <style jsx>{`
        @keyframes chad-thinking {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(1deg); }
          50% { transform: scale(1.1) rotate(0deg); }
          75% { transform: scale(1.05) rotate(-1deg); }
        }
        
        @keyframes chad-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.4); }
        }
        
        @keyframes chad-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        
        .chad-thinking {
          animation: chad-thinking 1.5s ease-in-out infinite;
        }
        
        .chad-glow {
          animation: chad-glow 2s ease-in-out infinite;
        }
        
        .chad-breathe {
          animation: chad-breathe 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* Base Image Container with Animations - iMessage style */}
      <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-black relative shadow-lg border-4 border-white transition-all duration-300 ${
        isAnimating ? 'chad-glow scale-105' : ''
      }`}>
        <img
          src="/chad.png"
          alt="Chad"
          className={`w-full h-full object-cover transition-all duration-500 ${
            isAnimating ? 'chad-thinking' : 'chad-breathe'
          }`}
        />
        
        {/* Animated overlay effects when generating */}
        {isAnimating && (
          <>
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 animate-pulse rounded-full"></div>
            
            {/* Thinking dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </>
        )}
      </div>

      {/* Status Indicator - iMessage style */}
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full"></div>
      </div>

              {/* Audio element for Chad's voice */}
              <audio ref={audioRef} preload="auto" />
              
              
            </div>
  )
}
