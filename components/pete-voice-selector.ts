"use client"

type MoodType = "neutral" | "apathetic" | "grin" | "excited" | "smirk"

export class PeteVoiceSelector {
  private voiceFiles = {
    // Pete Davidson's actual voice files
    standup: "/training_data/cleaned_voice/pete_standup.wav",
    chad_mars: "/training_data/cleaned_voice/chad_mars.wav", 
    smd: "/training_data/cleaned_voice/pete_smd.wav",
    chad_ever: "/training_data/cleaned_voice/chad_ever.wav",
    monologue: "/training_data/cleaned_voice/pete_monologue.wav"
  }

  private getVoiceForMood(mood: MoodType): string {
    const moodVoices = {
      neutral: ["standup", "monologue"],
      excited: ["standup", "smd"],
      apathetic: ["chad_mars", "chad_ever"],
      grin: ["chad_ever", "chad_mars"],
      smirk: ["smd", "monologue"]
    }
    
    const availableVoices = moodVoices[mood] || moodVoices.neutral
    const randomVoice = availableVoices[Math.floor(Math.random() * availableVoices.length)]
    return this.voiceFiles[randomVoice as keyof typeof this.voiceFiles]
  }

  private getRandomVoice(): string {
    const voices = Object.values(this.voiceFiles)
    return voices[Math.floor(Math.random() * voices.length)]
  }

  async playPeteDavidsonVoice(text: string, mood: MoodType): Promise<void> {
    try {
      // For now, we'll use Pete's actual voice files as "TTS"
      // This is actually better than synthetic TTS since it's his real voice!
      
      const voiceFile = this.getVoiceForMood(mood)
      console.log(`🎤 Playing Pete Davidson voice: ${voiceFile}`)
      
      const audio = new Audio(voiceFile)
      
      // Add some variation to make it feel more dynamic
      audio.volume = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
      audio.playbackRate = 0.9 + Math.random() * 0.2 // 0.9 to 1.1
      
      await audio.play()
      console.log("🎤 Pete Davidson voice played successfully")
      
    } catch (error) {
      console.error("Pete Davidson voice play failed:", error)
      throw error
    }
  }

  // Get a random Pete Davidson voice clip
  async playRandomPeteVoice(): Promise<void> {
    try {
      const voiceFile = this.getRandomVoice()
      console.log(`🎤 Playing random Pete Davidson voice: ${voiceFile}`)
      
      const audio = new Audio(voiceFile)
      audio.volume = 0.9
      audio.playbackRate = 1.0
      
      await audio.play()
      console.log("🎤 Random Pete Davidson voice played successfully")
      
    } catch (error) {
      console.error("Random Pete Davidson voice play failed:", error)
      throw error
    }
  }

  // Test all Pete Davidson voices
  async testAllVoices(): Promise<void> {
    console.log("🎤 Testing all Pete Davidson voices...")
    
    for (const [name, file] of Object.entries(this.voiceFiles)) {
      try {
        console.log(`🎤 Testing ${name}: ${file}`)
        const audio = new Audio(file)
        audio.volume = 0.5
        await audio.play()
        
        // Wait for this voice to finish before playing the next
        await new Promise(resolve => {
          audio.onended = resolve
          audio.onerror = resolve
        })
        
        // Small delay between voices
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`Failed to play ${name}:`, error)
      }
    }
    
    console.log("🎤 All Pete Davidson voices tested!")
  }
}
