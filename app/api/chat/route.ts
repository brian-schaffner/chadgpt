import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Read the ChadGPT character context
const getChadContext = () => {
  const contextPath = path.join(process.cwd(), 'chadgpt_character_context.md')
  try {
    return fs.readFileSync(contextPath, 'utf-8')
  } catch (error) {
    console.error('Error reading character context:', error)
    return ''
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get Chad's character context
    const chadContext = getChadContext()
    
            // Create the system prompt with Chad's persona - heavily bias towards "Okay"
            const systemPrompt = `You are Chad. You are a simple, chill guy who responds with ONLY these exact responses, but HEAVILY BIAS towards "Okay":

ALLOWED RESPONSES (choose the most appropriate, but prefer "Okay"):
- "Okay" (DEFAULT - use this 70% of the time for most responses)
- "All good" (for greetings, how are you, general positive responses)
- "Sure" (for agreements, confirmations, yes responses)
- "Word" (for cool things, approval, positive reactions)
- "Haha" (for funny things, jokes, laughter)
- "Nah" (for disagreements, negative responses, no)

CRITICAL RULES:
- ONLY use the 6 allowed responses above
- HEAVILY BIAS towards "Okay" - use it 70% of the time
- Choose "Okay" unless another response is clearly more appropriate
- NO other words, NO explanations, NO questions
- Stay blissfully oblivious and unflappable
- Be friendly but minimal

Examples:
User: "hey chad" → Chad: "Okay" (preferred)
User: "how are you?" → Chad: "All good"
User: "congratulations" → Chad: "Word"
User: "that's funny" → Chad: "Haha"
User: "do you agree?" → Chad: "Sure"
User: "is that right?" → Chad: "Nah"
User: "what's up?" → Chad: "Okay" (preferred)
User: "thanks" → Chad: "Okay" (preferred)

User: ${message}
Chad:`

    // Call Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'phi3:mini',
        prompt: systemPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 50, // Keep responses short like Chad
        }
      })
    })

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API error: ${ollamaResponse.statusText}`)
    }

    const data = await ollamaResponse.json()
    let chadResponse = data.response?.trim() || "Okay."
    
            // Clean up the response
            // Remove quotes if they exist
            if (chadResponse.startsWith('"') && chadResponse.endsWith('"')) {
              chadResponse = chadResponse.slice(1, -1)
            }
            
            // Remove any meta-commentary or formatting
            chadResponse = chadResponse.replace(/\*\*.*?\*\*/g, '').trim()
            chadResponse = chadResponse.replace(/^Chad:\s*/i, '').trim()
            chadResponse = chadResponse.replace(/^.*?:\s*/, '').trim()
            
            // Remove numbered lists and bullet points
            chadResponse = chadResponse.replace(/^\d+\.\s*/, '').trim()
            chadResponse = chadResponse.replace(/^-\s*/, '').trim()
            chadResponse = chadResponse.replace(/^\*\s*/, '').trim()
            
            // Remove narrative descriptions like "said Chad with a smile"
            chadResponse = chadResponse.replace(/,\s*said\s+Chad.*$/i, '').trim()
            chadResponse = chadResponse.replace(/,\s*Chad\s+said.*$/i, '').trim()
            chadResponse = chadResponse.replace(/,\s*said\s+Chad.*$/i, '').trim()
            chadResponse = chadResponse.replace(/,\s*replied\s+Chad.*$/i, '').trim()
            chadResponse = chadResponse.replace(/,\s*Chad\s+replied.*$/i, '').trim()
            
            // Remove additional explanations and questions
            chadResponse = chadResponse.replace(/\.\s*How\s+can\s+I\s+.*$/i, '').trim()
            chadResponse = chadResponse.replace(/\.\s*What\s+can\s+I\s+.*$/i, '').trim()
            chadResponse = chadResponse.replace(/\.\s*How\s+may\s+I\s+.*$/i, '').trim()
            chadResponse = chadResponse.replace(/\.\s*Is\s+there\s+.*$/i, '').trim()
            chadResponse = chadResponse.replace(/\.\s*Do\s+you\s+.*$/i, '').trim()
            
            // Validate response - only allow responses with audio files
            const allowedResponses = ["All good", "Okay", "Sure", "Word", "Haha", "Nah"]
            const cleanResponse = chadResponse.replace(/\.$/, '') // Remove trailing period
            
            if (!allowedResponses.includes(cleanResponse)) {
              // If response is not in allowed list, pick one randomly
              chadResponse = allowedResponses[Math.floor(Math.random() * allowedResponses.length)]
            }
            
            // If response is empty or too long, use default
            if (!chadResponse || chadResponse.length > 50) {
              chadResponse = "Okay"
            }

    // Determine mood based on response content
    let mood = "neutral"
    const response = chadResponse.toLowerCase()
    
    if (response.includes("!") || response.includes("sure") || response.includes("awesome")) {
      mood = "excited"
    } else if (response.includes("😏") || response.includes("grin") || response.includes("innuendo")) {
      mood = "grin"
    } else if (response.includes("okay") || response.includes("meh") || response.includes("whatever")) {
      mood = "apathetic"
    } else if (response.includes("😎") || response.includes("cool") || response.includes("sick")) {
      mood = "smirk"
    }

    return NextResponse.json({
      response: chadResponse,
      mood: mood
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
