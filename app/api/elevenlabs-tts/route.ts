import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, mood, voiceId } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API key not configured' }, { status: 503 })
    }

    console.log(`🎤 ElevenLabs TTS request: "${text}" (${mood})`)

    // ElevenLabs API endpoint
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || 'EXAVITQu4vr4xnSDxMaL'}`
    
    const headers = {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    }

    // Configure voice settings for Pete Davidson's style
    const voiceSettings = {
      stability: 0.7,        // Slightly more stable for consistent Pete voice
      similarity_boost: 0.8,  // High similarity to maintain Pete's characteristics
      style: 0.2,            // Slight style variation
      use_speaker_boost: true // Boost speaker characteristics
    }

    // Add mood-based adjustments
    switch (mood) {
      case 'excited':
        voiceSettings.stability = 0.6
        voiceSettings.similarity_boost = 0.9
        break
      case 'apathetic':
        voiceSettings.stability = 0.8
        voiceSettings.similarity_boost = 0.7
        break
      case 'grin':
        voiceSettings.stability = 0.7
        voiceSettings.similarity_boost = 0.85
        break
      case 'smirk':
        voiceSettings.stability = 0.75
        voiceSettings.similarity_boost = 0.8
        break
    }

    const body = JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: voiceSettings
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs API error:', response.status, errorText)
      return NextResponse.json({ error: `ElevenLabs API error: ${response.status}` }, { status: response.status })
    }

    const audioBuffer = await response.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    })

  } catch (error) {
    console.error('🎤 ElevenLabs TTS API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
