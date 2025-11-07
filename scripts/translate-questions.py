#!/usr/bin/env python3
"""
Script to translate all questions from English to all supported languages.
Uses googletrans library for translation.
"""

import json
import os
from typing import Dict, Any

# Language codes mapping
LANG_CODES = {
    'hi': 'hindi',
    'ta': 'tamil',
    'te': 'telugu',
    'bn': 'bengali',
    'mr': 'marathi',
    'gu': 'gujarati'
}

def translate_text(text: str, target_lang: str, translator) -> str:
    """Translate a single text string."""
    if not text or not text.strip():
        return text
    
    try:
        result = translator.translate(text, dest=target_lang)
        return result.text
    except Exception as e:
        print(f"  Warning: Translation failed for '{text[:50]}...': {e}")
        return text  # Return original if translation fails

def translate_questions(questions: Dict[str, Any], target_lang: str, translator) -> Dict[str, Any]:
    """Translate all questions, options, and explanations."""
    translated = {}
    
    for q_id, q_data in questions.items():
        print(f"  Translating {q_id}...")
        
        # Translate question text
        translated_question = translate_text(q_data['question'], target_lang, translator)
        
        # Translate options
        translated_options = {}
        for opt_id, opt_data in q_data['options'].items():
            translated_text = translate_text(opt_data['text'], target_lang, translator)
            translated_explanation = translate_text(opt_data['explanation'], target_lang, translator)
            
            translated_options[opt_id] = {
                'text': translated_text,
                'explanation': translated_explanation
            }
        
        translated[q_id] = {
            'question': translated_question,
            'options': translated_options
        }
    
    return translated

def main():
    print("Starting translation process...")
    
    # Try to import googletrans
    try:
        from googletrans import Translator
        translator = Translator()
        print("✓ Using googletrans library")
    except ImportError:
        print("googletrans not found. Installing...")
        os.system("pip3 install googletrans==4.0.0rc1")
        from googletrans import Translator
        translator = Translator()
        print("✓ googletrans installed and ready")
    
    # Read English questions
    print("\nReading English questions...")
    with open('messages/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    questions = en_data.get('questions', {})
    print(f"Found {len(questions)} questions to translate")
    
    # Translate for each language
    for lang_code, lang_name in LANG_CODES.items():
        print(f"\n{'='*60}")
        print(f"Translating to {lang_name.upper()} ({lang_code})...")
        print(f"{'='*60}")
        
        lang_file = f'messages/{lang_code}.json'
        
        # Read existing language file
        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)
        
        # Translate questions
        try:
            translated_questions = translate_questions(questions, lang_code, translator)
            lang_data['questions'] = translated_questions
            
            # Write back
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, indent=2, ensure_ascii=False)
            
            print(f"✓ Successfully translated {len(translated_questions)} questions to {lang_name}")
            
        except Exception as e:
            print(f"✗ Error translating to {lang_name}: {e}")
            print(f"  Continuing with next language...")
            continue
        
        # Small delay to avoid rate limiting
        import time
        time.sleep(1)
    
    print(f"\n{'='*60}")
    print("Translation complete!")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()

