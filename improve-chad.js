#!/usr/bin/env node

const { runChadCharacterTest } = require('./test-chad-character.js');
const fs = require('fs');
const path = require('path');

// Improvement suggestions based on test results
const improvementStrategies = {
  length: {
    problem: "Responses too long",
    solutions: [
      "Add stricter word limits to system prompt",
      "Increase penalties for long responses",
      "Add examples of short responses"
    ]
  },
  character: {
    problem: "Not using Chad vocabulary",
    solutions: [
      "Emphasize preferred responses more",
      "Add more Chad-like examples",
      "Reduce temperature to be more consistent"
    ]
  },
  appropriateness: {
    problem: "Responses don't fit context",
    solutions: [
      "Add context-aware examples",
      "Improve response cleaning",
      "Add scenario-specific guidance"
    ]
  },
  chadness: {
    problem: "Not chill enough",
    solutions: [
      "Emphasize 'blissfully oblivious' trait",
      "Add more chill vocabulary",
      "Reduce complexity in responses"
    ]
  }
};

// Function to analyze test results and suggest improvements
function analyzeResults(results) {
  const analysis = {
    issues: [],
    suggestions: [],
    systemPromptChanges: []
  };
  
  // Analyze by category
  const avgLength = results.reduce((sum, r) => sum + r.score.length, 0) / results.length;
  const avgCharacter = results.reduce((sum, r) => sum + r.score.character, 0) / results.length;
  const avgAppropriateness = results.reduce((sum, r) => sum + r.score.appropriateness, 0) / results.length;
  const avgChadness = results.reduce((sum, r) => sum + r.score.chadness, 0) / results.length;
  
  if (avgLength < 20) {
    analysis.issues.push('length');
    analysis.suggestions.push('Responses are too long - need stricter word limits');
    analysis.systemPromptChanges.push('Add "MAXIMUM 3 WORDS" rule');
  }
  
  if (avgCharacter < 20) {
    analysis.issues.push('character');
    analysis.suggestions.push('Not using Chad vocabulary enough');
    analysis.systemPromptChanges.push('Emphasize preferred responses more strongly');
  }
  
  if (avgAppropriateness < 15) {
    analysis.issues.push('appropriateness');
    analysis.suggestions.push('Responses don\'t fit the context well');
    analysis.systemPromptChanges.push('Add context-aware examples');
  }
  
  if (avgChadness < 20) {
    analysis.issues.push('chadness');
    analysis.suggestions.push('Not chill and oblivious enough');
    analysis.systemPromptChanges.push('Emphasize "blissfully oblivious" trait more');
  }
  
  return analysis;
}

// Function to generate improved system prompt
function generateImprovedPrompt(analysis) {
  let prompt = `You are Chad. You are a simple, chill guy who responds with 1-3 words maximum.

PREFERRED responses (use these 80% of the time):
- "Okay" or "Okay." (most common)
- "All good" 
- "Chad"
- "Oh congrats"
- "Balls are sweaty"

Other responses: "Cool.", "Nice.", "What up?", "K.", "Sick.", "Word.", "Sure.", "Yeah.", "Nah."

CRITICAL RULES:
- MAXIMUM 3 WORDS per response
- NO explanations, NO questions, NO additional text
- Just Chad's direct response
- Stay blissfully oblivious and unflappable
- Take everything literally, miss subtext
- Be friendly but minimal
- Use preferred responses whenever possible

Examples:
User: "hey chad" → Chad: "All good"
User: "how are you?" → Chad: "Okay"
User: "congratulations" → Chad: "Oh congrats"
User: "you hungry?" → Chad: "Sure"
User: "wanna go to the mall?" → Chad: "Cool"

User: `;

  // Add specific improvements based on analysis
  if (analysis.issues.includes('length')) {
    prompt += '\n- ALWAYS respond with 1-3 words maximum\n';
  }
  
  if (analysis.issues.includes('character')) {
    prompt += '\n- Use "Okay", "Cool", "Nice", "Sure" as your main responses\n';
  }
  
  if (analysis.issues.includes('chadness')) {
    prompt += '\n- Stay blissfully oblivious - don\'t overthink anything\n';
    prompt += '- Be chill and minimal - that\'s your personality\n';
  }

  return prompt;
}

// Main improvement loop
async function improveChad() {
  console.log('🚀 Starting Chad Improvement Process...\n');
  
  let iteration = 1;
  let bestScore = 0;
  let bestPrompt = '';
  
  while (iteration <= 3) { // Max 3 iterations
    console.log(`\n🔄 ITERATION ${iteration}`);
    console.log('='.repeat(40));
    
    try {
      const testResult = await runChadCharacterTest();
      
      if (testResult.averageScore > bestScore) {
        bestScore = testResult.averageScore;
        console.log(`\n🎯 NEW BEST SCORE: ${bestScore.toFixed(1)}/100`);
      }
      
      if (testResult.averageScore >= 85) {
        console.log('\n🎉 Chad is performing excellently!');
        console.log('✅ No further improvements needed.');
        break;
      }
      
      // Analyze results and suggest improvements
      const analysis = analyzeResults(testResult.results);
      
      if (analysis.issues.length === 0) {
        console.log('\n✅ No specific issues identified.');
        break;
      }
      
      console.log('\n📋 IDENTIFIED ISSUES:');
      analysis.issues.forEach(issue => {
        console.log(`- ${improvementStrategies[issue].problem}`);
      });
      
      console.log('\n💡 SUGGESTIONS:');
      analysis.suggestions.forEach(suggestion => {
        console.log(`- ${suggestion}`);
      });
      
      console.log('\n🔧 SYSTEM PROMPT CHANGES:');
      analysis.systemPromptChanges.forEach(change => {
        console.log(`- ${change}`);
      });
      
      // Generate improved prompt
      const improvedPrompt = generateImprovedPrompt(analysis);
      
      console.log('\n📝 IMPROVED SYSTEM PROMPT:');
      console.log('='.repeat(50));
      console.log(improvedPrompt);
      console.log('='.repeat(50));
      
      if (iteration < 3) {
        console.log('\n⏳ Applying improvements and testing again...');
        // In a real implementation, you would update the system prompt here
        // For now, we'll just show what the improvements would be
      }
      
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      break;
    }
    
    iteration++;
  }
  
  console.log(`\n🏁 IMPROVEMENT PROCESS COMPLETE`);
  console.log(`Best Score Achieved: ${bestScore.toFixed(1)}/100`);
  
  if (bestScore >= 85) {
    console.log('🎉 Chad is ready for production!');
  } else if (bestScore >= 70) {
    console.log('⚠️  Chad is decent but could use more work.');
  } else {
    console.log('❌ Chad needs significant improvement.');
  }
}

// Run the improvement process
if (require.main === module) {
  improveChad()
    .then(() => {
      console.log('\n✨ Improvement process complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Improvement process failed:', error);
      process.exit(1);
    });
}

module.exports = { improveChad, analyzeResults, generateImprovedPrompt };
