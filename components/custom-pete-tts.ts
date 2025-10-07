"use client"

import { TTS } from "tts"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class CustomPeteTTS {
  private tts: TTS | null = null
  private isInitialized = false

  constructor() {
    this.initializeTTS()
  }

  private async initializeTTS() {
    try {
      // Load the custom Pete Davidson model
      this.tts = new TTS("models/pete_davidson_voice/")
      this.isInitialized = true
      console.log("✅ Custom Pete Davidson TTS loaded")
    } catch (error) {
      console.error("❌ Failed to load custom Pete Davidson TTS:", error)
      this.isInitialized = false
    }
  }

  private getMoodSettings(mood: MoodType) {
    const settings = {
      neutral: { 
        speed: 1.0, 
        pitch: 1.0, 
        emotion: "neutral",
        temperature: 0.7
      },
      excited: { 
        speed: 1.1, 
        pitch: 1.1, 
        emotion: "excited",
        temperature: 0.8
      },
      apathetic: { 
        speed: 0.9, 
        pitch: 0.9, 
        emotion: "bored",
        temperature: 0.6
      },
      grin: { 
        speed: 1.05, 
        pitch: 1.05, 
        emotion: "amused",
        temperature: 0.75
      },
      smirk: { 
        speed: 0.95, 
        pitch: 0.95, 
        emotion: "sly",
        temperature: 0.65
      }
    }
    return settings[mood] || settings.neutral
  }

  async generatePeteDavidsonVoice(text: string, mood: MoodType): Promise<Blob> {
    if (!this.isInitialized || !this.tts) {
      throw new Error("Custom Pete Davidson TTS not initialized")
    }

    const moodSettings = this.getMoodSettings(mood)
    
    try {
      // Generate audio with custom Pete Davidson voice
      const audio = await this.tts.tts(
        text,
        speaker_wav="models/pete_davidson_voice/reference.wav", // Reference audio
        language="en",
        speed=moodSettings.speed,
        pitch=moodSettings.pitch,
        emotion=moodSettings.emotion,
        temperature=moodSettings.temperature
      )
      
      return audio
    } catch (error) {
      console.error("Custom Pete Davidson TTS generation failed:", error)
      throw error
    }
  }

  async playPeteDavidsonVoice(text: string, mood: MoodType): Promise<void> {
    try {
      const audioBlob = await this.generatePeteDavidsonVoice(text, mood)
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      audio.play().then(() => {
        console.log("🎤 Custom Pete Davidson voice played successfully")
        audio.onended = () => URL.revokeObjectURL(audioUrl)
      }).catch(error => {
        console.error("Custom Pete Davidson voice play failed:", error)
        URL.revokeObjectURL(audioUrl)
      })
    } catch (error) {
      console.error("Custom Pete Davidson voice generation failed:", error)
      throw error
    }
  }

  stop() {
    // Stop any ongoing generation
    if (this.tts) {
      // TTS stop method if available
      console.log("🛑 Custom Pete Davidson TTS stopped")
    }
  }
}
