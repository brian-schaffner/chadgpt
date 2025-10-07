// Real-time TTS processor for Chad's voice
export class TTSProcessor {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.isInitialized = true;
  }

  // Generate TTS for Chad's responses
  async generateChadTTS(text: string, options: {
    mood?: 'neutral' | 'excited' | 'apathetic' | 'grin' | 'smirk';
    pitch?: number;
    speed?: number;
    volume?: number;
  } = {}) {
    await this.initialize();
    
    if (!this.audioContext) return null;

    const { mood = 'neutral', pitch = 0, speed = 1.0, volume = 1.0 } = options;
    
    try {
      // Use Web Speech API for TTS
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure Chad's voice characteristics
      this.configureChadVoice(utterance, mood, pitch, speed, volume);
      
      // Play the TTS
      return new Promise<void>((resolve, reject) => {
        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);
        
        speechSynthesis.speak(utterance);
      });
      
    } catch (error) {
      console.log('TTS generation failed:', error);
      return null;
    }
  }

  private configureChadVoice(utterance: SpeechSynthesisUtterance, mood: string, pitch: number, speed: number, volume: number) {
    // Set voice characteristics based on Chad's personality
    utterance.rate = speed;
    utterance.pitch = Math.max(0.1, Math.min(2, 1 + pitch)); // Clamp between 0.1 and 2
    utterance.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
    
    // Try to find a suitable voice for Chad
    const voices = speechSynthesis.getVoices();
    const chadVoice = this.selectChadVoice(voices, mood);
    
    if (chadVoice) {
      utterance.voice = chadVoice;
    }
  }

  private selectChadVoice(voices: SpeechSynthesisVoice[], mood: string) {
    // Prefer male voices for Chad
    const maleVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('male') ||
      voice.name.toLowerCase().includes('man') ||
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('alex') ||
      voice.name.toLowerCase().includes('daniel')
    );
    
    if (maleVoices.length > 0) {
      // Select based on mood
      switch (mood) {
        case 'excited':
          return maleVoices.find(v => v.name.toLowerCase().includes('young')) || maleVoices[0];
        case 'apathetic':
          return maleVoices.find(v => v.name.toLowerCase().includes('deep')) || maleVoices[0];
        default:
          return maleVoices[0];
      }
    }
    
    // Fallback to any available voice
    return voices[0];
  }

  // Generate TTS with Chad's personality variations
  async generateWithChadPersonality(text: string, mood: string) {
    const variations = this.getChadMoodVariations(mood);
    
    return this.generateChadTTS(text, {
      mood,
      pitch: variations.pitch,
      speed: variations.speed,
      volume: variations.volume
    });
  }

  private getChadMoodVariations(mood: string) {
    const variations = {
      neutral: { pitch: 0, speed: 1.0, volume: 1.0 },
      excited: { pitch: 0.1, speed: 1.1, volume: 1.1 },
      apathetic: { pitch: -0.1, speed: 0.9, volume: 0.9 },
      grin: { pitch: 0.05, speed: 1.05, volume: 1.0 },
      smirk: { pitch: -0.05, speed: 0.95, volume: 0.95 }
    };
    
    return variations[mood as keyof typeof variations] || variations.neutral;
  }

  // Stop any current TTS
  stop() {
    speechSynthesis.cancel();
  }

  dispose() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.isInitialized = false;
  }
}
