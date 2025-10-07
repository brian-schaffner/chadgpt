"use client"

import { PeteVoiceSynthesizer } from "./pete-voice-synthesizer"
import { PeteVoiceSelector } from "./pete-voice-selector"
import { AdvancedTTS } from "./advanced-tts"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class SmartTTS {
  private peteSynthesizer: PeteVoiceSynthesizer
  private peteVoice: PeteVoiceSelector
  private fallbackTTS: AdvancedTTS
  private preferredProvider: 'pete' | 'synthesizer' | 'fallback' = 'pete'

  constructor() {
    this.peteSynthesizer = new PeteVoiceSynthesizer()
    this.peteVoice = new PeteVoiceSelector()
    this.fallbackTTS = new AdvancedTTS()
    
    // Check which services are available
    this.checkAvailableServices()
  }

  private async checkAvailableServices() {
    // Check if Pete Davidson voice files are available (highest priority)
    if (this.peteVoice.isReady) {
      this.preferredProvider = 'pete'
      console.log('🎤 Using Pete Davidson actual voice files')
      return
    }

    // Use Pete voice synthesizer (second priority)
    this.preferredProvider = 'synthesizer'
    console.log('🎤 Using Pete Davidson voice synthesizer')
  }

  async generateChadVoice(text: string, mood: MoodType): Promise<void> {
    try {
      switch (this.preferredProvider) {
        case 'pete':
          await this.peteVoice.playPeteDavidsonVoice(text, mood)
          break
        case 'synthesizer':
          await this.peteSynthesizer.generatePeteDavidsonVoice(text, mood)
          break
        case 'fallback':
        default:
          await this.fallbackTTS.generateChadVoice(text, mood)
          break
      }
    } catch (error) {
      console.error('Primary TTS failed, trying fallback:', error)
      
      // Try fallback if primary fails
      if (this.preferredProvider !== 'fallback') {
        this.preferredProvider = 'fallback' // Switch to fallback
        await this.fallbackTTS.generateChadVoice(text, mood)
      } else {
        throw error // If fallback also fails, re-throw
      }
    }
  }

  stop() {
    this.peteSynthesizer.stop();
    this.peteVoice.stop();
    this.fallbackTTS.stop();
  }
}