#!/usr/bin/env python3
import re
import json

# Read the scenarios.ts file
with open('src/data/scenarios.ts', 'r', encoding='utf-8') as f:
    content = f.read()

questions = {}

# Pattern to match question blocks
# This regex captures: id, question text, and the entire options block
question_pattern = r"id:\s*['\"](q\d+-\d+)['\"],\s*type:\s*['\"][^'\"]+['\"],\s*question:\s*['\"]([^'\"]+)['\"],"

# Find all questions
for match in re.finditer(question_pattern, content):
    question_id = match.group(1)
    question_text = match.group(2)
    
    # Find the options block for this question
    # Look for the options array that follows this question
    start_pos = match.end()
    # Find the next question or end of questions array
    next_question_match = re.search(r"id:\s*['\"]q\d+-\d+['\"]", content[start_pos:])
    if next_question_match:
        options_block_end = start_pos + next_question_match.start()
    else:
        # Last question, find the end of questions array
        options_block_end = content.find('],', start_pos)
        if options_block_end == -1:
            options_block_end = len(content)
    
    options_block = content[start_pos:options_block_end]
    
    # Extract options
    options = {}
    option_pattern = r"id:\s*['\"](a\d+-\d+)['\"],\s*text:\s*['\"]([^'\"]+)['\"],\s*isCorrect:\s*(true|false),\s*explanation:\s*['\"]([^'\"]+)['\"]"
    
    for opt_match in re.finditer(option_pattern, options_block):
        opt_id = opt_match.group(1)
        opt_text = opt_match.group(2)
        opt_explanation = opt_match.group(4)
        
        options[opt_id] = {
            "text": opt_text,
            "explanation": opt_explanation
        }
    
    questions[question_id] = {
        "question": question_text,
        "options": options
    }

# Output as JSON
output = {"questions": questions}
print(json.dumps(output, indent=2, ensure_ascii=False))
print(f"\nExtracted {len(questions)} questions", file=__import__('sys').stderr)

