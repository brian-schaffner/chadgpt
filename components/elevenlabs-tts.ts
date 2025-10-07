"use client"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class ElevenLabsTTS {
  private apiKey: string
  private baseUrl: string = "https://api.elevenlabs.io/v1"

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || ""
  }

  // Pete Davidson voice ID (you'll need to get this from ElevenLabs)
  private getPeteDavidsonVoiceId(): string {
    // This would be the actual voice ID from ElevenLabs
    // For now, using a placeholder - you'd need to:
    // 1. Sign up for ElevenLabs
    // 2. Find or create a Pete Davidson voice model
    // 3. Get the voice ID
    return "pete_davidson_voice_id_here"
  }

  private getMoodSettings(mood: MoodType) {
    const settings = {
      neutral: { stability: 0.5, similarity_boost: 0.8, style: 0.2 },
      excited: { stability: 0.3, similarity_boost: 0.9, style: 0.8 },
      apathetic: { stability: 0.8, similarity_boost: 0.7, style: 0.1 },
      grin: { stability: 0.4, similarity_boost: 0.85, style: 0.6 },
      smirk: { stability: 0.6, similarity_boost: 0.75, style: 0.4 }
    }
    return settings[mood] || settings.neutral
  }

  async generatePeteDavidsonVoice(text: string, mood: MoodType): Promise<Blob> {
    if (!this.apiKey) {
      throw new Error("ElevenLabs API key not provided")
    }

    const voiceId = this.getPeteDavidsonVoiceId()
    const moodSettings = this.getMoodSettings(mood)

    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: moodSettings.stability,
          similarity_boost: moodSettings.similarity_boost,
          style: moodSettings.style,
          use_speaker_boost: true
        }
      })
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    return await response.blob()
  }

  async playPeteDavidsonVoice(text: string, mood: MoodType): Promise<void> {
    try {
      const audioBlob = await this.generatePeteDavidsonVoice(text, mood)
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audio.play().then(() => {
        console.log('Pete Davidson voice played successfully')
        // Clean up the URL after playing
        audio.onended = () => URL.revokeObjectURL(audioUrl)
      }).catch(error => {
        console.error('Pete Davidson voice play failed:', error)
        URL.revokeObjectURL(audioUrl)
      })
    } catch (error) {
      console.error('Pete Davidson voice generation failed:', error)
      throw error
    }
  }
}
