const fs = require('fs');
const path = require('path');

// Read scenarios.ts file
const scenariosPath = path.join(__dirname, '../src/data/scenarios.ts');
const scenariosContent = fs.readFileSync(scenariosPath, 'utf-8');

// Extract all questions using regex
const questionRegex = /id:\s*['"](q\d+-\d+)['"],\s*type:\s*['"]([^'"]+)['"],\s*question:\s*['"]([^'"]+)['"],[\s\S]*?options:\s*\[([\s\S]*?)\]\s*\},/g;

const questions = {};
let match;

// Extract questions
while ((match = questionRegex.exec(scenariosContent)) !== null) {
  const questionId = match[1];
  const questionType = match[2];
  const questionText = match[3];
  const optionsText = match[4];
  
  // Extract options
  const optionRegex = /id:\s*['"](a\d+-\d+)['"],\s*text:\s*['"]([^'"]+)['"],\s*isCorrect:\s*(true|false),[\s\S]*?explanation:\s*['"]([^'"]+)['"],/g;
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

// Output JSON structure
const output = {
  questions: questions
};

console.log(JSON.stringify(output, null, 2));
console.error(`\nExtracted ${Object.keys(questions).length} questions`);

