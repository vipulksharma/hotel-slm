#!/usr/bin/env python3
import json

# Read English translation file
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Read complete questions from the Python extraction
# We'll generate it inline since we know the structure
with open('/tmp/all-questions-complete.json', 'r', encoding='utf-8') as f:
    content = f.read()
    # The file might have stderr output, extract just the JSON
    if content.startswith('Total questions'):
        # Find the JSON part
        json_start = content.find('{')
        if json_start != -1:
            questions_data = json.loads(content[json_start:])
        else:
            raise ValueError("Could not find JSON in output")
    else:
        questions_data = json.loads(content)

# Update questions section
en_data['questions'] = questions_data['questions']

# Write back
with open('messages/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

print(f"Updated English file with {len(en_data['questions'])} questions")

