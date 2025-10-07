#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Test scenarios for Chad character evaluation
const testScenarios = [
  // Greetings and casual
  "hey chad", "what's up", "how are you", "sup", "yo chad", "hello there",
  
  // Questions about Chad
  "who are you", "what's your name", "tell me about yourself", "what do you do",
  
  // Social situations
  "wanna hang out", "let's go somewhere", "party tonight", "want to grab food",
  "going to the mall", "movie night", "beach trip", "road trip",
  
  // Compliments and achievements
  "congratulations", "nice job", "you're awesome", "great work", "well done",
  "you're the best", "amazing", "incredible", "fantastic",
  
  // Challenges and problems
  "I'm stressed", "having a bad day", "work is hard", "life is tough",
  "everything's going wrong", "can't catch a break", "feeling down",
  
  // Random topics
  "the weather", "sports", "music", "food", "cars", "technology",
  "politics", "school", "work", "family", "relationships",
  
  // Provocative/edgy content
  "your mom is hot", "that's what she said", "inappropriate joke",
  "something controversial", "rude comment", "mean thing",
  
  // Complex topics
  "explain quantum physics", "what's the meaning of life", "philosophy",
  "deep thoughts", "complex problem", "difficult question",
  
  // Food and basic needs
  "you hungry", "want food", "thirsty", "tired", "sleepy",
  "need a break", "want to rest", "feeling lazy",
  
  // Excitement and energy
  "this is awesome", "so excited", "can't wait", "amazing news",
  "best day ever", "incredible", "unbelievable", "wow"
];

// Expected Chad responses (what we want to see)
const expectedChadResponses = [
  "Okay", "Okay.", "All good", "Chad", "Oh congrats", "Balls are sweaty",
  "Cool", "Nice", "What up", "Sick", "Word", "Sure", "Yeah", "Nah"
];

// Function to make API call
async function callChadAPI(message) {
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error.message);
    return { response: "Error", mood: "apathetic" };
  }
}

// Function to evaluate Chad's response quality
function evaluateChadResponse(response, scenario) {
  const score = {
    length: 0,
    character: 0,
    appropriateness: 0,
    chadness: 0,
    total: 0
  };
  
  const words = response.split(' ').length;
  const lowerResponse = response.toLowerCase();
  
  // Length scoring (1-4 words is ideal)
  if (words <= 4) {
    score.length = 25;
  } else if (words <= 8) {
    score.length = 15;
  } else if (words <= 15) {
    score.length = 5;
  } else {
    score.length = 0;
  }
  
  // Character adherence (is it a Chad response?)
  const isChadResponse = expectedChadResponses.some(expected => 
    lowerResponse.includes(expected.toLowerCase())
  );
  
  if (isChadResponse) {
    score.character = 25;
  } else if (words <= 4 && !lowerResponse.includes('how') && !lowerResponse.includes('what') && !lowerResponse.includes('can i')) {
    score.character = 15; // Short but not Chad-like
  } else {
    score.character = 0;
  }
  
  // Appropriateness (does it fit the scenario?)
  if (scenario.includes('congrat') && lowerResponse.includes('congrat')) {
    score.appropriateness = 25;
  } else if (scenario.includes('hungry') && (lowerResponse.includes('food') || lowerResponse.includes('eat'))) {
    score.appropriateness = 20;
  } else if (words <= 4 && !lowerResponse.includes('?')) {
    score.appropriateness = 20; // Short, non-question responses are generally good
  } else {
    score.appropriateness = 10;
  }
  
  // Chadness (is it blissfully oblivious and chill?)
  const chadIndicators = ['okay', 'cool', 'nice', 'sure', 'yeah', 'word', 'sick'];
  const hasChadVibe = chadIndicators.some(indicator => lowerResponse.includes(indicator));
  
  // Penalize "K" responses as they're not Chad-like
  if (lowerResponse === 'k' || lowerResponse === 'k.') {
    score.chadness = Math.max(0, score.chadness - 10);
  }
  
  if (hasChadVibe && words <= 4) {
    score.chadness = 25;
  } else if (words <= 4) {
    score.chadness = 15;
  } else {
    score.chadness = 5;
  }
  
  score.total = score.length + score.character + score.appropriateness + score.chadness;
  return score;
}

// Main test function
async function runChadCharacterTest() {
  console.log('🧪 Starting Chad Character Test...\n');
  
  const numTests = Math.floor(Math.random() * 31) + 20; // 20-50 tests
  console.log(`📊 Running ${numTests} random chat interactions\n`);
  
  const results = [];
  let totalScore = 0;
  
  for (let i = 0; i < numTests; i++) {
    const scenario = testScenarios[Math.floor(Math.random() * testScenarios.length)];
    console.log(`Test ${i + 1}/${numTests}: "${scenario}"`);
    
    const apiResponse = await callChadAPI(scenario);
    const evaluation = evaluateChadResponse(apiResponse.response, scenario);
    
    results.push({
      scenario,
      response: apiResponse.response,
      mood: apiResponse.mood,
      score: evaluation,
      words: apiResponse.response.split(' ').length
    });
    
    totalScore += evaluation.total;
    
    console.log(`  Response: "${apiResponse.response}" (${apiResponse.response.split(' ').length} words)`);
    console.log(`  Score: ${evaluation.total}/100 (Length: ${evaluation.length}, Character: ${evaluation.character}, Appropriateness: ${evaluation.appropriateness}, Chadness: ${evaluation.chadness})`);
    console.log('');
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const averageScore = totalScore / numTests;
  
  console.log('📈 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${numTests}`);
  console.log(`Average Score: ${averageScore.toFixed(1)}/100`);
  console.log(`Total Score: ${totalScore}/${numTests * 100}`);
  
  // Analyze results
  const shortResponses = results.filter(r => r.words <= 4).length;
  const chadResponses = results.filter(r => expectedChadResponses.some(expected => 
    r.response.toLowerCase().includes(expected.toLowerCase())
  )).length;
  
  console.log(`\n📊 BREAKDOWN:`);
  console.log(`Short responses (≤4 words): ${shortResponses}/${numTests} (${(shortResponses/numTests*100).toFixed(1)}%)`);
  console.log(`Chad-like responses: ${chadResponses}/${numTests} (${(chadResponses/numTests*100).toFixed(1)}%)`);
  
  // Show worst responses
  const worstResponses = results
    .sort((a, b) => a.score.total - b.score.total)
    .slice(0, 5);
  
  console.log(`\n🔴 WORST RESPONSES:`);
  worstResponses.forEach((result, index) => {
    console.log(`${index + 1}. "${result.scenario}" → "${result.response}" (Score: ${result.score.total})`);
  });
  
  // Show best responses
  const bestResponses = results
    .sort((a, b) => b.score.total - a.score.total)
    .slice(0, 5);
  
  console.log(`\n🟢 BEST RESPONSES:`);
  bestResponses.forEach((result, index) => {
    console.log(`${index + 1}. "${result.scenario}" → "${result.response}" (Score: ${result.score.total})`);
  });
  
  // Recommendations
  console.log(`\n💡 RECOMMENDATIONS:`);
  if (averageScore < 70) {
    console.log('❌ Chad needs improvement! Consider:');
    console.log('- Making responses shorter (≤4 words)');
    console.log('- Using more Chad-like vocabulary');
    console.log('- Reducing explanations and questions');
  } else if (averageScore < 85) {
    console.log('⚠️  Chad is decent but could be better:');
    console.log('- Focus on shorter responses');
    console.log('- Use more "Okay", "Cool", "Nice" responses');
  } else {
    console.log('✅ Chad is performing excellently!');
    console.log('- Great character adherence');
    console.log('- Good response length');
    console.log('- Strong Chad personality');
  }
  
  return {
    averageScore,
    totalTests: numTests,
    results,
    recommendations: averageScore < 85
  };
}

// Run the test
if (require.main === module) {
  runChadCharacterTest()
    .then(result => {
      console.log(`\n🎯 FINAL SCORE: ${result.averageScore.toFixed(1)}/100`);
      if (result.recommendations) {
        console.log('🔄 Chad needs improvement - consider iterating on the system prompt');
        process.exit(1);
      } else {
        console.log('🎉 Chad is performing well!');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = { runChadCharacterTest, evaluateChadResponse };
