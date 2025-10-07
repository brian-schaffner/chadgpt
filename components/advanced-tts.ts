// Advanced TTS with better Chad voice simulation
export class AdvancedTTS {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.isInitialized = true;
  }

  // Generate Chad's voice with personality
  async generateChadVoice(text: string, mood: string) {
    await this.initialize();
    
    // Wait for voices to load
    await this.waitForVoices();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure Chad's voice based on mood
    this.configureChadVoice(utterance, mood);
    
    // Add Chad-specific speech patterns
    this.addChadSpeechPatterns(utterance, text);
    
    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      
      speechSynthesis.speak(utterance);
    });
  }

  private async waitForVoices() {
    return new Promise<void>((resolve) => {
      if (speechSynthesis.getVoices().length > 0) {
        resolve();
      } else {
        speechSynthesis.onvoiceschanged = () => resolve();
      }
    });
  }

  private configureChadVoice(utterance: SpeechSynthesisUtterance, mood: string) {
    const voices = speechSynthesis.getVoices();
    
    // Try to find the best voice for Chad
    const chadVoice = this.selectBestChadVoice(voices, mood);
    if (chadVoice) {
      utterance.voice = chadVoice;
    }
    
    // Configure based on Chad's personality and mood
    const config = this.getChadVoiceConfig(mood);
    utterance.rate = config.rate;
    utterance.pitch = config.pitch;
    utterance.volume = config.volume;
  }

  private selectBestChadVoice(voices: SpeechSynthesisVoice[], mood: string) {
    console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })))
    
    // Pete Davidson voice characteristics: young, casual, slightly nasal, Brooklyn accent
    const peteVoices = voices.filter(voice => {
      const name = voice.name.toLowerCase();
      return name.includes('alex') || 
             name.includes('daniel') || 
             name.includes('david') ||
             name.includes('mark') ||
             name.includes('tom') ||
             name.includes('fred') ||
             name.includes('ralph') ||
             name.includes('male') ||
             name.includes('young') ||
             name.includes('teen') ||
             name.includes('boy') ||
             name.includes('guy') ||
             name.includes('casual') ||
             name.includes('google') ||
             name.includes('microsoft');
    });
    
    if (peteVoices.length === 0) {
      console.log('No Pete Davidson voices found, using fallback')
      return voices[0]; // Fallback to any voice
    }
    
    console.log('Selected Pete Davidson voice:', peteVoices[0].name)
    return peteVoices[0];
  }

  private getChadVoiceConfig(mood: string) {
    // Pete Davidson voice characteristics: slightly higher pitch, casual delivery, slight nasal quality
    const configs = {
      neutral: { rate: 0.95, pitch: 1.15, volume: 0.9 }, // Slightly slower, higher pitch, quieter
      excited: { rate: 1.05, pitch: 1.25, volume: 1.0 }, // Faster, higher pitch
      apathetic: { rate: 0.85, pitch: 1.05, volume: 0.8 }, // Slower, lower pitch, quieter
      grin: { rate: 1.0, pitch: 1.2, volume: 0.95 }, // Slightly higher pitch
      smirk: { rate: 0.9, pitch: 1.1, volume: 0.85 } // Slower, slightly higher pitch
    };
    
    return configs[mood as keyof typeof configs] || configs.neutral;
  }

  private addChadSpeechPatterns(utterance: SpeechSynthesisUtterance, text: string) {
    // Pete Davidson's speech patterns: casual, slightly nasal, chill delivery
    
    // Short responses get more chill delivery (Pete's signature style)
    if (text.length <= 4) {
      utterance.rate *= 0.85; // Slower, more chill
      utterance.pitch *= 1.05; // Slightly higher pitch for that nasal quality
    }
    
    // Exclamations get more energy but still casual
    if (text.includes('!')) {
      utterance.rate *= 1.05; // Slightly faster but not too much
      utterance.pitch *= 1.1; // Higher pitch for excitement
    }
    
    // Questions get that slightly confused Pete delivery
    if (text.includes('?')) {
      utterance.pitch *= 1.15; // Higher pitch for questions
      utterance.rate *= 0.9; // Slightly slower, more questioning
    }
    
    // Add Pete's characteristic slight nasal quality
    utterance.pitch *= 1.02; // Always slightly higher pitch for nasal quality
    
    // Add random variation for naturalness (less variation for consistency)
    const randomVariation = 0.03;
    utterance.rate *= (1 + (Math.random() - 0.5) * randomVariation);
    utterance.pitch *= (1 + (Math.random() - 0.5) * randomVariation);
    utterance.volume *= (1 + (Math.random() - 0.5) * randomVariation);
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
