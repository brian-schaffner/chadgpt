# 🎤 Pete Davidson Voice Setup Guide

## **Best Options for Pete Davidson Voice**

### **1. ElevenLabs (Recommended)**
- **Best quality** and most realistic
- **Celebrity voice cloning** available
- **API integration** for real-time TTS

**Setup:**
1. Sign up at [elevenlabs.io](https://elevenlabs.io/)
2. Get your API key
3. Create or find a Pete Davidson voice model
4. Add to `.env.local`:
   ```
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
   ```

### **2. Jammable AI (Pete Davidson Specific)**
- **Direct Pete Davidson voice models**
- **High accuracy** for celebrity voices
- **Easy integration**

**Setup:**
1. Sign up at [jammable.com](https://jammable.com/)
2. Get your API key
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_JAMMABLE_API_KEY=your_api_key_here
   ```

### **3. Browser TTS (Fallback)**
- **No setup required**
- **Lower quality** but works immediately
- **Uses current voice selection**

## **How It Works**

The app will automatically:
1. **Try ElevenLabs** first (if API key provided)
2. **Try Jammable** second (if API key provided)
3. **Fall back to browser TTS** if neither available

## **Cost Comparison**

- **ElevenLabs**: ~$0.18 per 1K characters
- **Jammable**: ~$0.10 per 1K characters
- **Browser TTS**: Free

## **Quality Comparison**

1. **ElevenLabs**: 9/10 (Most realistic)
2. **Jammable**: 8/10 (Very good, Pete-specific)
3. **Browser TTS**: 4/10 (Basic, but free)

## **Quick Start**

1. **For best results**: Get ElevenLabs API key
2. **For Pete-specific**: Get Jammable API key
3. **For testing**: Use browser TTS (no setup needed)

The app will automatically use the best available option!
