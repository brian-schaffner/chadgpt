"use client"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class BarkTTS {
  private isModelLoaded: boolean = false
  private modelPath: string = '/models/pete_davidson_bark/'

  constructor() {
    this.checkModelAvailability()
  }

  private async checkModelAvailability() {
    try {
      const response = await fetch(`${this.modelPath}config.json`)
      if (response.ok) {
        this.isModelLoaded = true
        console.log("🎤 Bark Pete Davidson voice model loaded")
      } else {
        console.warn("🎤 Bark Pete Davidson voice model not found")
      }
    } catch (error) {
      console.warn("🎤 Error checking Bark model:", error)
    }
  }

  get isReady(): boolean {
    return this.isModelLoaded
  }

  async generatePeteDavidsonVoice(text: string, mood: MoodType): Promise<void> {
    if (!this.isModelLoaded) {
      console.warn("🎤 Bark model not loaded, falling back to browser TTS")
      return this.fallbackTTS(text, mood)
    }

    try {
      console.log(`🎤 Generating Pete Davidson voice: "${text}" (${mood})`)
      
      // Call the Bark TTS API endpoint
      const response = await fetch('/api/bark-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mood })
      })

      if (!response.ok) {
        throw new Error(`Bark TTS API error: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      
      await audio.play()
      
      // Clean up
      audio.onended = () => URL.revokeObjectURL(audioUrl)
      
    } catch (error) {
      console.error("🎤 Bark TTS failed, using fallback:", error)
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
