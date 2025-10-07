"use client"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class JammableTTS {
  private apiKey: string
  private baseUrl: string = "https://api.jammable.com/v1"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_JAMMABLE_API_KEY || ""
  }

  // Pete Davidson voice ID from Jammable
  private getPeteDavidsonVoiceId(): string {
    // Jammable has specific Pete Davidson voice models
    // You'd need to get the actual voice ID from their platform
    return "pete_davidson_jammable_id"
  }

  private getMoodSettings(mood: MoodType) {
    const settings = {
      neutral: { speed: 1.0, pitch: 1.0, emotion: "neutral" },
      excited: { speed: 1.1, pitch: 1.1, emotion: "excited" },
      apathetic: { speed: 0.9, pitch: 0.9, emotion: "bored" },
      grin: { speed: 1.05, pitch: 1.05, emotion: "amused" },
      smirk: { speed: 0.95, pitch: 0.95, emotion: "sly" }
    }
    return settings[mood] || settings.neutral
  }

  async generatePeteDavidsonVoice(text: string, mood: MoodType): Promise<Blob> {
    if (!this.apiKey) {
      throw new Error("Jammable API key not provided")
    }

    const voiceId = this.getPeteDavidsonVoiceId()
    const moodSettings = this.getMoodSettings(mood)

    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        text: text,
        voice_id: voiceId,
        speed: moodSettings.speed,
        pitch: moodSettings.pitch,
        emotion: moodSettings.emotion,
        quality: "high"
      })
    })

    if (!response.ok) {
      throw new Error(`Jammable API error: ${response.statusText}`)
    }

    return await response.blob()
  }

  async playPeteDavidsonVoice(text: string, mood: MoodType): Promise<void> {
    try {
      const audioBlob = await this.generatePeteDavidsonVoice(text, mood)
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audio.play().then(() => {
        console.log('Jammable Pete Davidson voice played successfully')
        audio.onended = () => URL.revokeObjectURL(audioUrl)
      }).catch(error => {
        console.error('Jammable Pete Davidson voice play failed:', error)
        URL.revokeObjectURL(audioUrl)
      })
    } catch (error) {
      console.error('Jammable Pete Davidson voice generation failed:', error)
      throw error
    }
  }
}
