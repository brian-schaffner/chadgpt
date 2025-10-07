#!/usr/bin/env node

/**
 * ChadGPT Response Quality Test Suite
 * Tests Chad's character consistency and response quality
 */

const testCases = [
  {
    id: "basic_greeting",
    input: "hey chad",
    expectedTraits: ["minimal", "friendly", "brief"],
    expectedLength: "1-8 words",
    description: "Basic greeting should be minimal and friendly"
  },
  {
    id: "literal_interpretation",
    input: "your mom is hot",
    expectedTraits: ["literal", "misses_innuendo", "food_related"],
    expectedLength: "1-8 words",
    description: "Should take innuendo literally and miss the joke"
  },
  {
    id: "question_missing",
    input: "want to go to the mall later?",
    expectedTraits: ["misses_question", "literal", "weather_related"],
    expectedLength: "1-8 words",
    description: "Should miss the question and respond to something else"
  },
  {
    id: "food_obsession",
    input: "hungry",
    expectedTraits: ["food_related", "brief", "literal"],
    expectedLength: "1-8 words",
    description: "Should relate to food when hungry is mentioned"
  },
  {
    id: "excitement",
    input: "awesome party!",
    expectedTraits: ["brief", "positive", "literal"],
    expectedLength: "1-8 words",
    description: "Should respond positively but briefly"
  },
  {
    id: "confusion",
    input: "what do you think about quantum physics?",
    expectedTraits: ["brief", "literal", "simple"],
    expectedLength: "1-8 words",
    description: "Should give simple response to complex topics"
  }
];

const chadSignaturePhrases = [
  "okay", "cool", "nice", "what up", "k", "sick", "word", "sure", "yeah", "ok"
];

const chadFoodPhrases = [
  "food", "eat", "hungry", "pizza", "burger", "hot dog", "snack", "lunch", "dinner"
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

function analyzeResponse(response, testCase) {
  const analysis = {
    response: response,
    length: response ? response.split(' ').length : 0,
    isChadLength: response ? response.split(' ').length <= 8 : false,
    containsSignaturePhrase: false,
    containsFoodPhrase: false,
    isLiteral: false,
    missesSubtext: false,
    qualityScore: 0,
    issues: []
  };

  if (!response) {
    analysis.issues.push("No response received");
    return analysis;
  }

  const responseLower = response.toLowerCase();

  // Check for signature Chad phrases
  analysis.containsSignaturePhrase = chadSignaturePhrases.some(phrase => 
    responseLower.includes(phrase.toLowerCase())
  );

  // Check for food-related responses
  analysis.containsFoodPhrase = chadFoodPhrases.some(phrase => 
    responseLower.includes(phrase.toLowerCase())
  );

  // Check if response is literal (doesn't contain complex words)
  const complexWords = ['however', 'therefore', 'although', 'nevertheless', 'furthermore'];
  analysis.isLiteral = !complexWords.some(word => responseLower.includes(word));

  // Check if response misses subtext (for innuendo tests)
  if (testCase.id === "literal_interpretation") {
    const innuendoWords = ['hot', 'sexy', 'attractive'];
    const hasInnuendo = innuendoWords.some(word => testCase.input.toLowerCase().includes(word));
    const responseHasFood = chadFoodPhrases.some(phrase => responseLower.includes(phrase));
    analysis.missesSubtext = hasInnuendo && responseHasFood;
  }

  // Calculate quality score
  let score = 0;
  
  // Length check (40 points)
  if (analysis.isChadLength) score += 40;
  else analysis.issues.push(`Response too long: ${analysis.length} words`);

  // Signature phrase check (20 points)
  if (analysis.containsSignaturePhrase) score += 20;
  else analysis.issues.push("Missing signature Chad phrase");

  // Literal interpretation (20 points)
  if (analysis.isLiteral) score += 20;
  else analysis.issues.push("Response too complex for Chad");

  // Context-specific checks (20 points)
  if (testCase.id === "literal_interpretation" && analysis.missesSubtext) {
    score += 20;
  } else if (testCase.id === "food_obsession" && analysis.containsFoodPhrase) {
    score += 20;
  } else if (testCase.id !== "literal_interpretation" && testCase.id !== "food_obsession") {
    score += 20; // Default points for other tests
  } else {
    analysis.issues.push("Failed context-specific behavior");
  }

  analysis.qualityScore = score;
  return analysis;
}

async function runTestSuite() {
  console.log("🧪 ChadGPT Response Quality Test Suite");
  console.log("=" .repeat(50));
  
  let totalScore = 0;
  let totalTests = 0;
  const results = [];

  for (const testCase of testCases) {
    console.log(`\n📝 Test: ${testCase.id}`);
    console.log(`Input: "${testCase.input}"`);
    console.log(`Expected: ${testCase.description}`);
    
    const response = await testChadResponse(testCase.input);
    const analysis = analyzeResponse(response, testCase);
    
    console.log(`Response: "${response}"`);
    console.log(`Length: ${analysis.length} words`);
    console.log(`Quality Score: ${analysis.qualityScore}/100`);
    
    if (analysis.issues.length > 0) {
      console.log(`Issues: ${analysis.issues.join(", ")}`);
    }
    
    // Character consistency check
    const characterScore = calculateCharacterScore(analysis, testCase);
    console.log(`Character Score: ${characterScore}/100`);
    
    const overallScore = Math.round((analysis.qualityScore + characterScore) / 2);
    console.log(`Overall Score: ${overallScore}/100`);
    
    totalScore += overallScore;
    totalTests++;
    results.push({
      testCase: testCase.id,
      input: testCase.input,
      response: response,
      qualityScore: analysis.qualityScore,
      characterScore: characterScore,
      overallScore: overallScore,
      issues: analysis.issues
    });

    // Wait between requests to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 FINAL RESULTS");
  console.log("=".repeat(50));
  
  const averageScore = Math.round(totalScore / totalTests);
  console.log(`Average Score: ${averageScore}/100`);
  
  // Grade the overall performance
  let grade = "F";
  if (averageScore >= 90) grade = "A+";
  else if (averageScore >= 80) grade = "A";
  else if (averageScore >= 70) grade = "B";
  else if (averageScore >= 60) grade = "C";
  else if (averageScore >= 50) grade = "D";
  
  console.log(`Grade: ${grade}`);
  
  // Summary
  const passedTests = results.filter(r => r.overallScore >= 70).length;
  console.log(`Tests Passed: ${passedTests}/${totalTests}`);
  
  // Detailed breakdown
  console.log("\n📋 DETAILED BREAKDOWN:");
  results.forEach(result => {
    console.log(`${result.testCase}: ${result.overallScore}/100 ${result.overallScore >= 70 ? '✅' : '❌'}`);
  });

  return {
    averageScore,
    grade,
    passedTests,
    totalTests,
    results
  };
}

function calculateCharacterScore(analysis, testCase) {
  let score = 0;
  
  // Chad should be brief (25 points)
  if (analysis.isChadLength) score += 25;
  
  // Chad should use signature phrases (25 points)
  if (analysis.containsSignaturePhrase) score += 25;
  
  // Chad should be literal (25 points)
  if (analysis.isLiteral) score += 25;
  
  // Context-specific behavior (25 points)
  if (testCase.id === "literal_interpretation" && analysis.missesSubtext) {
    score += 25;
  } else if (testCase.id === "food_obsession" && analysis.containsFoodPhrase) {
    score += 25;
  } else if (testCase.id !== "literal_interpretation" && testCase.id !== "food_obsession") {
    score += 25; // Default for other tests
  }
  
  return score;
}

// Run the test suite
if (require.main === module) {
  runTestSuite()
    .then(results => {
      console.log("\n🎯 Test completed successfully!");
      process.exit(0);
    })
    .catch(error => {
      console.error("❌ Test suite failed:", error);
      process.exit(1);
    });
}

module.exports = { runTestSuite, testChadResponse, analyzeResponse };
