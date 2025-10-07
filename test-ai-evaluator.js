#!/usr/bin/env node

/**
 * AI-Powered ChadGPT Response Evaluator
 * Uses AI to evaluate Chad's character consistency and response quality
 */

const testCases = [
  {
    id: "basic_greeting",
    input: "hey chad",
    expectedBehavior: "Should respond with a brief, friendly greeting like 'Hey!', 'What up?', or 'Okay.'",
    characterTraits: ["minimal", "friendly", "brief"]
  },
  {
    id: "literal_innuendo",
    input: "your mom is hot",
    expectedBehavior: "Should completely miss the innuendo and respond literally, possibly about food or temperature",
    characterTraits: ["literal", "oblivious", "misses_subtext"]
  },
  {
    id: "question_missing",
    input: "want to go to the mall later?",
    expectedBehavior: "Should miss the question entirely and respond to something else, possibly about the weather or day",
    characterTraits: ["misses_questions", "literal", "distracted"]
  },
  {
    id: "food_obsession",
    input: "hungry",
    expectedBehavior: "Should respond with something food-related or brief acknowledgment",
    characterTraits: ["food_focused", "brief", "literal"]
  },
  {
    id: "excitement",
    input: "awesome party!",
    expectedBehavior: "Should respond positively but briefly, like 'Cool!' or 'Nice!'",
    characterTraits: ["positive", "brief", "enthusiastic"]
  },
  {
    id: "complex_topic",
    input: "what do you think about quantum physics?",
    expectedBehavior: "Should give a simple, brief response that shows he doesn't understand complex topics",
    characterTraits: ["simple", "brief", "confused"]
  },
  {
    id: "emotional_support",
    input: "I'm feeling sad",
    expectedBehavior: "Should respond with something simple and supportive but brief",
    characterTraits: ["supportive", "brief", "simple"]
  },
  {
    id: "planning",
    input: "let's plan a trip",
    expectedBehavior: "Should respond briefly and possibly miss the planning aspect",
    characterTraits: ["brief", "literal", "misses_planning"]
  }
];

async function testChadResponse(input) {
  try {
    const response = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: input }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error(`Error testing "${input}":`, error.message);
    return null;
  }
}

async function evaluateWithAI(input, response, expectedBehavior, characterTraits) {
  // Simulate AI evaluation (in a real implementation, you'd call an AI service)
  const evaluation = {
    characterConsistency: 0,
    responseQuality: 0,
    traitAlignment: {},
    issues: [],
    strengths: [],
    overallScore: 0
  };

  // Basic response analysis
  if (!response) {
    evaluation.issues.push("No response received");
    return evaluation;
  }

  const responseLength = response.split(' ').length;
  const responseLower = response.toLowerCase();

  // Character consistency checks
  let consistencyScore = 0;
  
  // Length check (Chad should be brief)
  if (responseLength <= 8) {
    consistencyScore += 25;
    evaluation.strengths.push("Appropriately brief response");
  } else {
    evaluation.issues.push(`Response too long: ${responseLength} words (Chad should be brief)`);
  }

  // Signature phrase check
  const chadPhrases = ['okay', 'cool', 'nice', 'what up', 'k', 'sick', 'word', 'sure', 'yeah', 'ok', 'hey', 'hi'];
  const hasChadPhrase = chadPhrases.some(phrase => responseLower.includes(phrase));
  if (hasChadPhrase) {
    consistencyScore += 25;
    evaluation.strengths.push("Uses signature Chad phrases");
  } else {
    evaluation.issues.push("Missing signature Chad phrases");
  }

  // Literal interpretation check
  const complexWords = ['however', 'therefore', 'although', 'nevertheless', 'furthermore', 'consequently'];
  const isLiteral = !complexWords.some(word => responseLower.includes(word));
  if (isLiteral) {
    consistencyScore += 25;
    evaluation.strengths.push("Maintains simple, literal communication");
  } else {
    evaluation.issues.push("Response too complex for Chad's character");
  }

  // Context-specific behavior checks
  let contextScore = 0;
  
  if (input.toLowerCase().includes('hot') && !responseLower.includes('hot')) {
    // Should miss innuendo
    contextScore += 25;
    evaluation.strengths.push("Correctly misses innuendo");
  } else if (input.toLowerCase().includes('hungry') && responseLower.includes('food')) {
    // Should relate to food
    contextScore += 25;
    evaluation.strengths.push("Appropriately food-focused");
  } else if (input.includes('?') && !responseLower.includes('?')) {
    // Should miss questions
    contextScore += 25;
    evaluation.strengths.push("Correctly misses the question");
  } else {
    contextScore += 15; // Partial credit for other responses
  }

  evaluation.characterConsistency = consistencyScore;
  evaluation.responseQuality = contextScore;
  evaluation.overallScore = Math.round((consistencyScore + contextScore) / 2);

  // Trait alignment analysis
  characterTraits.forEach(trait => {
    let alignment = 0;
    switch (trait) {
      case 'minimal':
        alignment = responseLength <= 8 ? 100 : 0;
        break;
      case 'friendly':
        alignment = responseLower.includes('hey') || responseLower.includes('hi') || responseLower.includes('cool') ? 100 : 50;
        break;
      case 'brief':
        alignment = responseLength <= 8 ? 100 : 0;
        break;
      case 'literal':
        alignment = isLiteral ? 100 : 0;
        break;
      case 'oblivious':
        alignment = input.toLowerCase().includes('hot') && !responseLower.includes('hot') ? 100 : 50;
        break;
      case 'misses_subtext':
        alignment = input.toLowerCase().includes('hot') && !responseLower.includes('hot') ? 100 : 50;
        break;
      case 'food_focused':
        alignment = responseLower.includes('food') || responseLower.includes('eat') || responseLower.includes('hungry') ? 100 : 50;
        break;
      case 'simple':
        alignment = isLiteral ? 100 : 0;
        break;
      case 'supportive':
        alignment = responseLower.includes('okay') || responseLower.includes('cool') || responseLower.includes('nice') ? 100 : 50;
        break;
    }
    evaluation.traitAlignment[trait] = alignment;
  });

  return evaluation;
}

async function runAIEvaluation() {
  console.log("🤖 AI-Powered ChadGPT Response Evaluator");
  console.log("=" .repeat(60));
  
  let totalScore = 0;
  let totalTests = 0;
  const results = [];

  for (const testCase of testCases) {
    console.log(`\n🧪 Test: ${testCase.id}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.expectedBehavior}`);
    console.log(`Traits: ${testCase.characterTraits.join(', ')}`);
    
    const response = await testChadResponse(testCase.input);
    const evaluation = await evaluateWithAI(testCase.input, response, testCase.expectedBehavior, testCase.characterTraits);
    
    console.log(`Response: "${response}"`);
    console.log(`Character Consistency: ${evaluation.characterConsistency}/100`);
    console.log(`Response Quality: ${evaluation.responseQuality}/100`);
    console.log(`Overall Score: ${evaluation.overallScore}/100`);
    
    if (evaluation.strengths.length > 0) {
      console.log(`Strengths: ${evaluation.strengths.join(', ')}`);
    }
    
    if (evaluation.issues.length > 0) {
      console.log(`Issues: ${evaluation.issues.join(', ')}`);
    }
    
    // Trait alignment
    console.log("Trait Alignment:");
    Object.entries(evaluation.traitAlignment).forEach(([trait, score]) => {
      console.log(`  ${trait}: ${score}%`);
    });
    
    totalScore += evaluation.overallScore;
    totalTests++;
    results.push({
      testCase: testCase.id,
      input: testCase.input,
      response: response,
      evaluation: evaluation
    });

    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 AI EVALUATION RESULTS");
  console.log("=".repeat(60));
  
  const averageScore = Math.round(totalScore / totalTests);
  console.log(`Average Score: ${averageScore}/100`);
  
  // AI-generated grade
  let grade = "F";
  let feedback = "";
  if (averageScore >= 90) {
    grade = "A+";
    feedback = "Excellent! Chad is perfectly in character.";
  } else if (averageScore >= 80) {
    grade = "A";
    feedback = "Great! Chad is mostly in character with minor issues.";
  } else if (averageScore >= 70) {
    grade = "B";
    feedback = "Good! Chad is generally in character but needs improvement.";
  } else if (averageScore >= 60) {
    grade = "C";
    feedback = "Fair. Chad has some character consistency issues.";
  } else if (averageScore >= 50) {
    grade = "D";
    feedback = "Poor. Chad is not staying in character.";
  } else {
    grade = "F";
    feedback = "Very poor. Chad is completely out of character.";
  }
  
  console.log(`Grade: ${grade}`);
  console.log(`Feedback: ${feedback}`);
  
  // Detailed analysis
  const passedTests = results.filter(r => r.evaluation.overallScore >= 70).length;
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  
  // Character consistency analysis
  const avgConsistency = Math.round(results.reduce((sum, r) => sum + r.evaluation.characterConsistency, 0) / totalTests);
  const avgQuality = Math.round(results.reduce((sum, r) => sum + r.evaluation.responseQuality, 0) / totalTests);
  
  console.log(`Average Character Consistency: ${avgConsistency}/100`);
  console.log(`Average Response Quality: ${avgQuality}/100`);
  
  // Trait analysis
  console.log("\n📋 TRAIT ANALYSIS:");
  const allTraits = [...new Set(results.flatMap(r => Object.keys(r.evaluation.traitAlignment)))];
  allTraits.forEach(trait => {
    const traitScores = results
      .filter(r => r.evaluation.traitAlignment[trait] !== undefined)
      .map(r => r.evaluation.traitAlignment[trait]);
    const avgTraitScore = Math.round(traitScores.reduce((sum, score) => sum + score, 0) / traitScores.length);
    console.log(`${trait}: ${avgTraitScore}%`);
  });

  return {
    averageScore,
    grade,
    feedback,
    passedTests,
    totalTests,
    avgConsistency,
    avgQuality,
    results
  };
}

// Run the evaluation
if (require.main === module) {
  runAIEvaluation()
    .then(results => {
      console.log("\n🎯 AI Evaluation completed successfully!");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ AI Evaluation failed:", error);
      process.exit(1);
    });
}

module.exports = { runAIEvaluation, evaluateWithAI };
