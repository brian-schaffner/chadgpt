"use client"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class ElevenLabsVoiceClone {
  private apiKey: string | undefined
  private voiceId: string | undefined
  private isConfigured: boolean = false

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    this.voiceId = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID
    this.isConfigured = !!(this.apiKey && this.voiceId)
    
    if (this.isConfigured) {
      console.log("🎤 ElevenLabs voice cloning configured")
    } else {
      console.warn("🎤 ElevenLabs not configured - using fallback TTS")
    }
  }

  get isReady(): boolean {
    return this.isConfigured
  }

  async generatePeteDavidsonVoice(text: string, mood: MoodType): Promise<void> {
    if (!this.isConfigured) {
      console.warn("🎤 ElevenLabs not configured, using fallback")
      return this.fallbackTTS(text, mood)
    }

    try {
      console.log(`🎤 Generating Pete Davidson voice with ElevenLabs: "${text}" (${mood})`)
      
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          mood,
          voiceId: this.voiceId 
        })
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      await audio.play()
      
      // Clean up
      audio.onended = () => URL.revokeObjectURL(audioUrl)
      
    } catch (error) {
      console.error("🎤 ElevenLabs TTS failed, using fallback:", error)
      return this.fallbackTTS(text, mood)
    }
  }

  private async fallbackTTS(text: string, mood: MoodType): Promise<void> {
    // Fallback to browser TTS with Pete Davidson voice characteristics
    if (!('speechSynthesis' in window)) {
      console.warn("🎤 Speech synthesis not supported")
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Configure for Pete Davidson's voice style
    utterance.rate = 0.9  // Slightly slower for chill vibe
    utterance.pitch = 1.1 // Slightly higher for nasal quality
    utterance.volume = 0.9
    
    // Add mood-based variations
    switch (mood) {
      case 'excited':
        utterance.rate = 1.0
        utterance.pitch = 1.15
        break
      case 'apathetic':
        utterance.rate = 0.8
        utterance.pitch = 1.0
        break
      case 'grin':
        utterance.rate = 0.95
        utterance.pitch = 1.1
        break
      case 'smirk':
        utterance.rate = 0.85
        utterance.pitch = 1.05
        break
    }

    return new Promise((resolve, reject) => {
      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)
      speechSynthesis.speak(utterance)
    })
  }

  stop() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  }
}
