// Simple audio processor for adding variability to Chad's voice
export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private pitchShiftNode: AudioWorkletNode | null = null;

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
    }
  }

  // Simple pitch variation using playback rate
  async playWithVariation(audioElement: HTMLAudioElement, options: {
    pitchVariation?: number; // -0.5 to 0.5 (lower to higher pitch)
    speedVariation?: number; // 0.8 to 1.2 (slower to faster)
    volumeVariation?: number; // 0.5 to 1.5 (quieter to louder)
  } = {}) {
    console.log('playWithVariation called with:', options)
    
    // Apply variations directly to the audio element
    const speedVariation = options.speedVariation || 0.95 + Math.random() * 0.1; // 0.95x to 1.05x speed
    const volumeVariation = options.volumeVariation || 0.9 + Math.random() * 0.2; // 0.9x to 1.1x volume

    // Set playback rate and volume
    audioElement.playbackRate = speedVariation;
    audioElement.volume = volumeVariation;

    console.log('Audio settings:', { speedVariation, volumeVariation })

    // Play with slight delay for more natural feel
    setTimeout(() => {
      console.log('Attempting to play audio...')
      audioElement.play().then(() => {
        console.log('Audio played successfully')
      }).catch(error => {
        console.log('Audio play failed:', error)
      });
    }, Math.random() * 100); // 0-100ms delay
  }

  // Generate random variations for Chad's personality
  getChadVariations() {
    return {
      pitchVariation: (Math.random() - 0.5) * 0.2, // Slight pitch variation
      speedVariation: 0.95 + Math.random() * 0.1, // Slight speed variation
      volumeVariation: 0.9 + Math.random() * 0.2, // Slight volume variation
    };
  }

  // Clean up
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
