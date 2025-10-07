"use client"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class PeteTTSSynthesizer {
  private synth: SpeechSynthesis | null = null
  private voices: SpeechSynthesisVoice[] = []
  private peteVoice: SpeechSynthesisVoice | null = null

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synth = window.speechSynthesis
      this.loadVoices()
    }
  }

  private loadVoices() {
    if (!this.synth) return

    this.voices = this.synth.getVoices()
    
    // Find the best voice that sounds like Pete Davidson
    this.peteVoice = this.selectPeteVoice()
    
    // Listen for voice changes
    this.synth.onvoiceschanged = () => {
      this.voices = this.synth!.getVoices()
      this.peteVoice = this.selectPeteVoice()
    }
  }

  private selectPeteVoice(): SpeechSynthesisVoice | null {
    // Pete Davidson characteristics: young, casual, slightly nasal, Brooklyn accent
    const peteVoices = [
      'Alex', 'Daniel', 'David', 'Mark', 'Tom', 'Fred', 'Ralph',
      'Google US English Male', 'Microsoft David - English (United States)',
      'Microsoft Mark - English (United States)', 'Microsoft Zira - English (United States)'
    ]

    // Try to find Pete-like voices
    for (const name of peteVoices) {
      const voice = this.voices.find(v => 
        v.name.toLowerCase().includes(name.toLowerCase()) && v.lang.startsWith('en')
      )
      if (voice) {
        console.log(`🎤 Selected Pete Davidson voice: ${voice.name}`)
        return voice
      }
    }

    // Fallback to any male voice
    const maleVoice = this.voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
    )
    if (maleVoice) {
      console.log(`🎤 Fallback Pete voice: ${maleVoice.name}`)
      return maleVoice
    }

    // Final fallback
    const englishVoice = this.voices.find(v => v.lang.startsWith('en'))
    if (englishVoice) {
      console.log(`🎤 Final fallback voice: ${englishVoice.name}`)
      return englishVoice
    }

    return null
  }

  private getPeteVoiceConfig(mood: MoodType) {
    // Pete Davidson voice characteristics: casual, slightly nasal, chill delivery
    const baseRate = 0.9    // Slightly slower for chill vibe
    const basePitch = 1.1   // Slightly higher for nasal quality
    const baseVolume = 0.9  // Slightly quieter

    const configs = {
      neutral: { rate: baseRate, pitch: basePitch, volume: baseVolume },
      excited: { rate: baseRate * 1.1, pitch: basePitch * 1.05, volume: baseVolume * 1.1 },
      apathetic: { rate: baseRate * 0.85, pitch: basePitch * 0.95, volume: baseVolume * 0.8 },
      grin: { rate: baseRate * 1.05, pitch: basePitch * 1.1, volume: baseVolume },
      smirk: { rate: baseRate * 0.9, pitch: basePitch * 1.05, volume: baseVolume * 0.95 }
    }

    return configs[mood] || configs.neutral
  }

  private addPeteSpeechPatterns(utterance: SpeechSynthesisUtterance, text: string) {
    // Pete Davidson's speech patterns: casual, slightly nasal, chill delivery
    
    // Short responses get more chill delivery (Pete's signature style)
    if (text.length <= 4) {
      utterance.rate *= 0.85  // Slower, more chill
      utterance.pitch *= 1.05 // Slightly higher pitch for nasal quality
    }
    
    // Exclamations get more energy but still casual
    if (text.includes('!')) {
      utterance.rate *= 1.05  // Slightly faster but not too much
      utterance.pitch *= 1.1  // Higher pitch for excitement
    }
    
    // Questions get that slightly confused Pete delivery
    if (text.includes('?')) {
      utterance.pitch *= 1.15 // Higher pitch for questions
      utterance.rate *= 0.9   // Slightly slower, more questioning
    }
    
    // Add Pete's characteristic slight nasal quality
    utterance.pitch *= 1.02 // Always slightly higher pitch for nasal quality
    
    // Add random variation for naturalness (less variation for consistency)
    const randomVariation = 0.03
    utterance.rate *= (1 + (Math.random() - 0.5) * randomVariation)
    utterance.pitch *= (1 + (Math.random() - 0.5) * randomVariation)
    utterance.volume *= (1 + (Math.random() - 0.5) * randomVariation)
  }

  async generatePeteDavidsonVoice(text: string, mood: MoodType): Promise<void> {
    if (!this.synth) {
      console.warn("SpeechSynthesis not supported in this browser.")
      return
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice
      if (this.peteVoice) {
        utterance.voice = this.peteVoice
      }
      
      // Configure for Pete Davidson's voice
      const config = this.getPeteVoiceConfig(mood)
      utterance.rate = config.rate
      utterance.pitch = config.pitch
      utterance.volume = config.volume
      
      // Add Pete's speech patterns
      this.addPeteSpeechPatterns(utterance, text)
      
      // Event handlers
      utterance.onend = () => {
        console.log("🎤 Pete Davidson TTS completed")
        resolve()
      }
      
      utterance.onerror = (error) => {
        console.error("Pete Davidson TTS error:", error)
        reject(error)
      }
      
      // Speak
      this.synth!.speak(utterance)
    })
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel()
    }
  }
}
