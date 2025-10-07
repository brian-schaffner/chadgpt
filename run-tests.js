#!/usr/bin/env node

/**
 * Test Runner for ChadGPT Response Quality
 * Runs both basic and AI-powered evaluations
 */

const { runTestSuite } = require('./test-chad-responses');
const { runAIEvaluation } = require('./test-ai-evaluator');

async function runAllTests() {
  console.log("🚀 Starting ChadGPT Response Quality Tests");
  console.log("=" .repeat(60));
  
  try {
    // Run basic test suite
    console.log("\n📊 Running Basic Test Suite...");
    const basicResults = await runTestSuite();
    
    console.log("\n" + "=".repeat(60));
    
    // Run AI evaluation
    console.log("\n🤖 Running AI-Powered Evaluation...");
    const aiResults = await runAIEvaluation();
    
    // Combined results
    console.log("\n" + "=".repeat(60));
    console.log("🎯 COMBINED RESULTS");
    console.log("=".repeat(60));
    
    console.log(`Basic Test Average: ${basicResults.averageScore}/100 (${basicResults.grade})`);
    console.log(`AI Evaluation Average: ${aiResults.averageScore}/100 (${aiResults.grade})`);
    
    const combinedScore = Math.round((basicResults.averageScore + aiResults.averageScore) / 2);
    let combinedGrade = "F";
    if (combinedScore >= 90) combinedGrade = "A+";
    else if (combinedScore >= 80) combinedGrade = "A";
    else if (combinedScore >= 70) combinedGrade = "B";
    else if (combinedScore >= 60) combinedGrade = "C";
    else if (combinedScore >= 50) combinedGrade = "D";
    
    console.log(`Combined Score: ${combinedScore}/100 (${combinedGrade})`);
    
    // Recommendations
    console.log("\n💡 RECOMMENDATIONS:");
    if (combinedScore >= 80) {
      console.log("✅ Chad is performing excellently! No major changes needed.");
    } else if (combinedScore >= 70) {
      console.log("⚠️  Chad is mostly in character but could use some fine-tuning.");
    } else if (combinedScore >= 60) {
      console.log("🔧 Chad needs significant improvements to stay in character.");
    } else {
      console.log("🚨 Chad is not staying in character. Major prompt engineering needed.");
    }
    
    // Specific recommendations based on results
    if (aiResults.avgConsistency < 70) {
      console.log("- Focus on making responses more consistent with Chad's character");
    }
    if (aiResults.avgQuality < 70) {
      console.log("- Improve response quality and context awareness");
    }
    if (basicResults.passedTests < basicResults.totalTests * 0.8) {
      console.log("- Review test cases that are failing");
    }
    
    console.log("\n🎉 All tests completed successfully!");
    
  } catch (error) {
    console.error("❌ Test execution failed:", error);
    process.exit(1);
  }
}

// Run all tests
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
