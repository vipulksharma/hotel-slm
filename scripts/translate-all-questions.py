#!/usr/bin/env python3
"""
Script to translate all questions from English to all supported languages.
Uses googletrans library for translation.
"""

import json
import os
from typing import Dict, Any
import time

# Language codes mapping (ISO 639-1 codes for googletrans)
LANG_CODES = {
    'hi': 'hi',  # Hindi
    'ta': 'ta',  # Tamil
    'te': 'te',  # Telugu
    'bn': 'bn',  # Bengali
    'mr': 'mr',  # Marathi
    'gu': 'gu',  # Gujarati
    'kn': 'kn',  # Kannada
    'ml': 'ml',  # Malayalam
    'ur': 'ur',  # Urdu
    'pa': 'pa',  # Punjabi
    'or': 'or',  # Odia
}

def translate_text(text: str, target_lang: str, translator, retries: int = 3) -> str:
    """Translate a single text string with retry logic."""
    if not text or not text.strip():
        return text
    
    for attempt in range(retries):
        try:
            result = translator.translate(text, dest=target_lang)
            return result.text
        except Exception as e:
            if attempt < retries - 1:
                print(f"    Retry {attempt + 1}/{retries} for: '{text[:50]}...'")
                time.sleep(2)  # Wait before retry
            else:
                print(f"    Warning: Translation failed for '{text[:50]}...': {e}")
                return text  # Return original if translation fails
    return text

def translate_questions(questions: Dict[str, Any], target_lang: str, translator) -> Dict[str, Any]:
    """Translate all questions, options, and explanations."""
    translated = {}
    total = len(questions)
    
    for idx, (q_id, q_data) in enumerate(questions.items(), 1):
        print(f"  [{idx}/{total}] Translating {q_id}...")
        
        # Translate question text
        translated_question = translate_text(q_data['question'], target_lang, translator)
        time.sleep(0.5)  # Rate limiting
        
        # Translate options
        translated_options = {}
        for opt_id, opt_data in q_data['options'].items():
            translated_text = translate_text(opt_data['text'], target_lang, translator)
            time.sleep(0.5)
            
            translated_explanation = translate_text(opt_data['explanation'], target_lang, translator)
            time.sleep(0.5)
            
            translated_options[opt_id] = {
                'text': translated_text,
                'explanation': translated_explanation
            }
        
        translated[q_id] = {
            'question': translated_question,
            'options': translated_options
        }
        
        # Small delay between questions
        if idx % 10 == 0:
            print(f"    Progress: {idx}/{total} questions translated. Taking a short break...")
            time.sleep(2)
    
    return translated

def ensure_language_file_exists(lang_code: str) -> Dict[str, Any]:
    """Ensure language file exists, create from English template if not."""
    lang_file = f'messages/{lang_code}.json'
    
    if os.path.exists(lang_file):
        with open(lang_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        # Create from English template
        print(f"  Creating new language file for {lang_code}...")
        with open('messages/en.json', 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        
        # Initialize with English structure but empty questions (will be translated)
        lang_data = {
            'common': en_data.get('common', {}),
            'game': en_data.get('game', {}),
            'scenarios': en_data.get('scenarios', {}),
            'questions': {},  # Will be filled with translations
            'results': en_data.get('results', {}),
            'stats': en_data.get('stats', {}),
        }
        
        # Save the file
        with open(lang_file, 'w', encoding='utf-8') as f:
            json.dump(lang_data, f, indent=2, ensure_ascii=False)
        
        return lang_data

def main():
    print("="*70)
    print("Question Translation Script")
    print("="*70)
    
    # Try to import googletrans
    try:
        from googletrans import Translator
        translator = Translator()
        print("✓ Using googletrans library\n")
    except ImportError:
        print("googletrans not found. Installing...")
        os.system("pip3 install googletrans==4.0.0rc1 --quiet")
        from googletrans import Translator
        translator = Translator()
        print("✓ googletrans installed and ready\n")
    
    # Read English questions
    print("Reading English questions...")
    with open('messages/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    questions = en_data.get('questions', {})
    print(f"Found {len(questions)} questions to translate\n")
    
    if not questions:
        print("ERROR: No questions found in English file!")
        return
    
    # Translate for each language
    for lang_code, lang_name in LANG_CODES.items():
        print(f"\n{'='*70}")
        print(f"Translating to {lang_code.upper()}...")
        print(f"{'='*70}")
        
        # Ensure language file exists
        lang_data = ensure_language_file_exists(lang_code)
        
        # Check if questions are already translated
        existing_questions = lang_data.get('questions', {})
        if existing_questions and len(existing_questions) == len(questions):
            # Check if they're actually translated (not just English)
            sample_q = list(existing_questions.values())[0] if existing_questions else None
            if sample_q and sample_q.get('question') and sample_q['question'] != questions[list(questions.keys())[0]]['question']:
                print(f"  Questions already translated for {lang_code}. Skipping...")
                continue
        
        # Translate questions
        try:
            translated_questions = translate_questions(questions, lang_code, translator)
            lang_data['questions'] = translated_questions
            
            # Write back
            lang_file = f'messages/{lang_code}.json'
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, indent=2, ensure_ascii=False)
            
            print(f"\n✓ Successfully translated {len(translated_questions)} questions to {lang_code}")
            
        except Exception as e:
            print(f"\n✗ Error translating to {lang_code}: {e}")
            print(f"  Continuing with next language...")
            import traceback
            traceback.print_exc()
            continue
        
        # Longer delay between languages to avoid rate limiting
        print(f"  Waiting before next language...")
        time.sleep(5)
    
    print(f"\n{'='*70}")
    print("Translation process complete!")
    print(f"{'='*70}")

if __name__ == '__main__':
    main()

