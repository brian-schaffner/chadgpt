# ElevenLabs Voice Cloning Setup

## 🎤 Get Pete Davidson's Actual Voice

To get Chad to sound like Pete Davidson, you need to set up ElevenLabs voice cloning:

### 1. Get ElevenLabs API Key

1. Go to [ElevenLabs.io](https://elevenlabs.io/)
2. Sign up for a free account (10,000 characters/month free)
3. Go to your profile → API Keys
4. Copy your API key

### 2. Create Pete Davidson Voice Clone

1. Go to **Voice Library** → **Add Voice** → **Voice Cloning**
2. Upload the voice sample: `voice_samples/pete_sample.wav`
3. Name it "Pete Davidson" or "Chad"
4. Wait for processing (usually 1-2 minutes)
5. Copy the Voice ID from the voice settings

### 3. Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
NEXT_PUBLIC_ELEVENLABS_VOICE_ID=your_voice_id_here
```

### 4. Test the Voice

Visit `http://localhost:3001/test-tts` and try different messages. You should now hear Pete Davidson's actual voice!

## 🎯 How It Works

- **ElevenLabs Voice Cloning**: Uses AI to clone Pete Davidson's voice from audio samples
- **Mood-Based Variations**: Adjusts voice characteristics based on Chad's mood
- **Real-Time Generation**: Generates speech in Pete's voice for any text
- **Fallback System**: Uses audio files if voice cloning fails

## 🎉 Result

You'll get **Pete Davidson's actual voice** saying any text, not just pre-recorded clips!

## 💡 Tips

- The free tier gives you 10,000 characters per month
- Voice cloning quality depends on the audio sample quality
- You can fine-tune the voice settings in the API call
- The system automatically falls back to audio files if needed