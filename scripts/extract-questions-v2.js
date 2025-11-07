const fs = require('fs');
const path = require('path');

// Read scenarios.ts file
const scenariosPath = path.join(__dirname, '../src/data/scenarios.ts');
const content = fs.readFileSync(scenariosPath, 'utf-8');

const questions = {};

// Extract questions using a more robust approach
// Pattern: id: 'qX-Y', ... question: '...', ... options: [...]
let currentQuestionId = null;
let currentQuestion = null;
let currentOptions = {};
let currentOptionId = null;
let inQuestion = false;
let inOptions = false;
let inOption = false;
let questionText = '';
let optionText = '';
let explanationText = '';
let collectingQuestion = false;
let collectingOptionText = false;
let collectingExplanation = false;

const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Detect question start
  if (line.match(/id:\s*['"]q\d+-\d+['"]/)) {
    const match = line.match(/id:\s*['"](q\d+-\d+)['"]/);
    if (match) {
      currentQuestionId = match[1];
      currentQuestion = '';
      currentOptions = {};
      inQuestion = true;
      collectingQuestion = false;
    }
  }
  
  // Detect question text
  if (inQuestion && line.match(/question:\s*['"]/)) {
    const match = line.match(/question:\s*['"]([^'"]+)['"]/);
    if (match) {
      currentQuestion = match[1];
    } else if (line.includes("question: '") || line.includes('question: "')) {
      // Multi-line question
      const startMatch = line.match(/question:\s*['"](.*)/);
      if (startMatch) {
        currentQuestion = startMatch[1].replace(/['"]$/, '');
        collectingQuestion = true;
      }
    }
  } else if (collectingQuestion) {
    if (line.includes("'") || line.includes('"')) {
      currentQuestion += ' ' + line.replace(/['"],?\s*$/, '');
      collectingQuestion = false;
    } else {
      currentQuestion += ' ' + line;
    }
  }
  
  // Detect options start
  if (inQuestion && line.includes('options: [')) {
    inOptions = true;
    inQuestion = false;
  }
  
  // Detect option start
  if (inOptions && line.match(/id:\s*['"]a\d+-\d+['"]/)) {
    const match = line.match(/id:\s*['"](a\d+-\d+)['"]/);
    if (match) {
      currentOptionId = match[1];
      optionText = '';
      explanationText = '';
      inOption = true;
    }
  }
  
  // Detect option text
  if (inOption && line.match(/text:\s*['"]/)) {
    const match = line.match(/text:\s*['"]([^'"]+)['"]/);
    if (match) {
      optionText = match[1];
    } else if (line.includes("text: '") || line.includes('text: "')) {
      const startMatch = line.match(/text:\s*['"](.*)/);
      if (startMatch) {
        optionText = startMatch[1].replace(/['"]$/, '');
        collectingOptionText = true;
      }
    }
  } else if (collectingOptionText) {
    if (line.includes("'") || line.includes('"')) {
      optionText += ' ' + line.replace(/['"],?\s*$/, '');
      collectingOptionText = false;
    } else {
      optionText += ' ' + line;
    }
  }
  
  // Detect explanation
  if (inOption && line.match(/explanation:\s*['"]/)) {
    const match = line.match(/explanation:\s*['"]([^'"]+)['"]/);
    if (match) {
      explanationText = match[1];
    } else if (line.includes("explanation: '") || line.includes('explanation: "')) {
      const startMatch = line.match(/explanation:\s*['"](.*)/);
      if (startMatch) {
        explanationText = startMatch[1].replace(/['"]$/, '');
        collectingExplanation = true;
      }
    }
  } else if (collectingExplanation) {
    if (line.includes("'") || line.includes('"')) {
      explanationText += ' ' + line.replace(/['"],?\s*$/, '');
      collectingExplanation = false;
    } else {
      explanationText += ' ' + line;
    }
  }
  
  // Detect option end
  if (inOption && (line.includes('},') || line.includes('}')) && optionText && explanationText) {
    currentOptions[currentOptionId] = {
      text: optionText.trim(),
      explanation: explanationText.trim()
    };
    inOption = false;
    currentOptionId = null;
  }
  
  // Detect options end and save question
  if (inOptions && line.includes('],') && Object.keys(currentOptions).length > 0) {
    if (currentQuestionId && currentQuestion) {
      questions[currentQuestionId] = {
        question: currentQuestion.trim(),
        options: { ...currentOptions }
      };
    }
    inOptions = false;
    currentQuestionId = null;
    currentOptions = {};
  }
}

console.log(JSON.stringify({ questions }, null, 2));
console.error(`\nExtracted ${Object.keys(questions).length} questions`);

