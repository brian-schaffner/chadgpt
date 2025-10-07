import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

export async function POST(request: NextRequest) {
  try {
    const { text, mood } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    console.log(`🎤 Bark TTS request: "${text}" (${mood})`)

    // Check if Bark model exists
    const modelPath = path.join(process.cwd(), 'models/pete_davidson_bark')
    const configPath = path.join(modelPath, 'config.json')
    
    if (!fs.existsSync(configPath)) {
      console.warn("🎤 Bark model not found, using fallback")
      return NextResponse.json({ error: 'Bark model not available' }, { status: 503 })
    }

    // Generate audio using Bark TTS
    const outputPath = path.join(modelPath, `generated_${Date.now()}.wav`)
    
    try {
      // Use Python to generate audio with Bark
      const pythonScript = `
import sys
import os
sys.path.append('${process.cwd()}')

from bark import SAMPLE_RATE, generate_audio
import soundfile as sf
import json

# Load model config
with open('${configPath}', 'r') as f:
    config = json.load(f)

# Generate audio
audio_array = generate_audio(
    "${text}",
    history_prompt="v2/en_speaker_9",  # Use a good base voice
    text_temp=0.7,
    waveform_temp=0.7,
)

# Save audio
sf.write('${outputPath}', audio_array, SAMPLE_RATE)
print("Audio generated successfully")
`

      // Write Python script to temp file
      const scriptPath = path.join(process.cwd(), 'temp_bark_script.py')
      fs.writeFileSync(scriptPath, pythonScript)

      // Run Python script
      const pythonProcess = spawn('python3', [scriptPath], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      })

      let stdout = ''
      let stderr = ''

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      await new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(stdout)
          } else {
            reject(new Error(`Python script failed: ${stderr}`))
          }
        })
      })

      // Clean up temp script
      fs.unlinkSync(scriptPath)

      // Check if audio file was generated
      if (!fs.existsSync(outputPath)) {
        throw new Error('Audio generation failed')
      }

      // Read and return audio file
      const audioBuffer = fs.readFileSync(outputPath)
      
      // Clean up generated audio file
      fs.unlinkSync(outputPath)

      return new NextResponse(audioBuffer, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': audioBuffer.length.toString(),
        },
      })

    } catch (error) {
      console.error('🎤 Bark TTS generation failed:', error)
      return NextResponse.json({ error: 'Audio generation failed' }, { status: 500 })
    }

  } catch (error) {
    console.error('🎤 Bark TTS API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
