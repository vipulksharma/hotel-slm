/**
 * Script to extract questions from scenarios.ts and generate translation templates
 * Run with: node scripts/extract-questions.js
 */

const fs = require('fs');
const path = require('path');

// Read scenarios file
const scenariosPath = path.join(__dirname, '../src/data/scenarios.ts');
const scenariosContent = fs.readFileSync(scenariosPath, 'utf-8');

// Extract questions using regex
const questionRegex = /id:\s*['"](q\d+-\d+)['"],\s*type:\s*['"]([^'"]+)['"],\s*question:\s*['"]([^'"]+)['"],[\s\S]*?options:\s*\[([\s\S]*?)\]\s*\},/g;

const questions = {};
let match;

while ((match = questionRegex.exec(scenariosContent)) !== null) {
  const questionId = match[1];
  const questionText = match[3];
  const optionsText = match[4];
  
  // Extract options
  const optionRegex = /id:\s*['"]([^'"]+)['"],\s*text:\s*['"]([^'"]+)['"],\s*isCorrect:\s*(true|false),[\s\S]*?explanation:\s*['"]([^'"]+)['"]/g;
  const options = {};
  let optionMatch;
  
  while ((optionMatch = optionRegex.exec(optionsText)) !== null) {
    const optionId = optionMatch[1];
    const optionText = optionMatch[2];
    const explanation = optionMatch[4];
    
    options[optionId] = {
      text: optionText,
      explanation: explanation
    };
  }
  
  questions[questionId] = {
    question: questionText,
    options: options
  };
}

// Generate JSON structure
const questionsJson = JSON.stringify(questions, null, 2);

// Write to file
const outputPath = path.join(__dirname, '../messages/questions-template.json');
fs.writeFileSync(outputPath, questionsJson, 'utf-8');

console.log(`Extracted ${Object.keys(questions).length} questions`);
console.log(`Template saved to: ${outputPath}`);
console.log('\nYou can now copy this structure to your language files and translate the content.');

