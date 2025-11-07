#!/usr/bin/env python3
"""
Create missing language files from English template
"""

import json
import os

# All languages from config
ALL_LANGS = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'ur', 'pa', 'or']

# Read English file
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Create missing language files
for lang in ALL_LANGS:
    if lang == 'en':
        continue
    
    lang_file = f'messages/{lang}.json'
    
    if not os.path.exists(lang_file):
        print(f"Creating {lang_file}...")
        # Copy structure from English
        lang_data = {
            'common': en_data.get('common', {}),
            'game': en_data.get('game', {}),
            'scenarios': en_data.get('scenarios', {}),
            'questions': {},  # Will be filled with translations
            'results': en_data.get('results', {}),
            'stats': en_data.get('stats', {}),
        }
        
        with open(lang_file, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, indent=2, ensure_ascii=False)
        
        print(f"  ✓ Created {lang_file}")
    else:
        # Ensure it has questions structure
        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)
        
        if 'questions' not in lang_data:
            lang_data['questions'] = {}
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, indent=2, ensure_ascii=False)
            print(f"  ✓ Added questions structure to {lang_file}")

print("\nAll language files ready!")

