#!/usr/bin/env python3
"""
Comprehensive script to translate all questions to all languages.
Handles rate limiting and errors gracefully.
"""

import json
import os
import time
import sys

LANG_CODES = {
    'hi': 'hi', 'ta': 'ta', 'te': 'te', 'bn': 'bn', 'mr': 'mr', 'gu': 'gu',
    'kn': 'kn', 'ml': 'ml', 'ur': 'ur', 'pa': 'pa', 'or': 'or'
}

def check_if_translated(lang_code: str, en_questions: dict) -> bool:
    """Check if language already has real translations."""
    lang_file = f'messages/{lang_code}.json'
    if not os.path.exists(lang_file):
        return False
    
    try:
        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)
        
        lang_questions = lang_data.get('questions', {})
        if len(lang_questions) != len(en_questions):
            return False
        
        # Check if first question is actually translated
        if 'q1-1' in lang_questions and 'q1-1' in en_questions:
            en_q = en_questions['q1-1']['question']
            lang_q = lang_questions['q1-1']['question']
            return lang_q != en_q
        
        return False
    except:
        return False

def translate_question(translator, q_data: dict, lang_code: str) -> dict:
    """Translate a single question with all options."""
    try:
        # Translate question text
        q_result = translator.translate(q_data['question'], dest=lang_code)
        translated_q = q_result.text
        time.sleep(0.4)
        
        # Translate options
        translated_options = {}
        for opt_id, opt_data in q_data['options'].items():
            try:
                opt_text_result = translator.translate(opt_data['text'], dest=lang_code)
                time.sleep(0.4)
                
                opt_exp_result = translator.translate(opt_data['explanation'], dest=lang_code)
                time.sleep(0.4)
                
                translated_options[opt_id] = {
                    'text': opt_text_result.text,
                    'explanation': opt_exp_result.text
                }
            except Exception as e:
                print(f"      Warning: Option {opt_id} translation failed: {e}")
                # Use English as fallback
                translated_options[opt_id] = opt_data
        
        return {
            'question': translated_q,
            'options': translated_options
        }
    except Exception as e:
        print(f"    Error translating question: {e}")
        return q_data  # Return English as fallback

def translate_language(lang_code: str, questions: dict, translator) -> dict:
    """Translate all questions for a language."""
    print(f"\n{'='*60}")
    print(f"Translating to {lang_code.upper()}")
    print(f"{'='*60}")
    
    translated = {}
    total = len(questions)
    
    for idx, (q_id, q_data) in enumerate(questions.items(), 1):
        print(f"  [{idx:3d}/{total}] {q_id}...", end=' ', flush=True)
        
        result = translate_question(translator, q_data, lang_code)
        translated[q_id] = result
        
        print("✓")
        
        # Longer pause every 10 questions
        if idx % 10 == 0:
            print(f"    Pausing 5 seconds... (translated {idx}/{total})")
            time.sleep(5)
    
    return translated

def main():
    print("="*70)
    print("Complete Question Translation for All Languages")
    print("="*70)
    
    # Setup translator
    try:
        from googletrans import Translator
        translator = Translator()
        print("✓ Translator ready\n")
    except ImportError:
        print("Installing googletrans...")
        os.system("pip3 install googletrans==4.0.0rc1 --quiet")
        from googletrans import Translator
        translator = Translator()
        print("✓ Translator installed\n")
    
    # Read English questions
    print("Loading English questions...")
    with open('messages/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    questions = en_data.get('questions', {})
    print(f"✓ Found {len(questions)} questions\n")
    
    if not questions:
        print("ERROR: No questions found!")
        return
    
    # Process each language
    languages_to_translate = []
    for lang_code in LANG_CODES.keys():
        if check_if_translated(lang_code, questions):
            print(f"{lang_code}: Already translated ✓")
        else:
            languages_to_translate.append(lang_code)
    
    if not languages_to_translate:
        print("\nAll languages already translated!")
        return
    
    print(f"\nLanguages to translate: {len(languages_to_translate)}")
    print(f"  {', '.join(languages_to_translate)}\n")
    
    # Translate each language
    for lang_code in languages_to_translate:
        lang_file = f'messages/{lang_code}.json'
        
        if not os.path.exists(lang_file):
            print(f"ERROR: {lang_file} not found. Skipping...")
            continue
        
        try:
            # Load language file
            with open(lang_file, 'r', encoding='utf-8') as f:
                lang_data = json.load(f)
            
            # Translate questions
            translated_questions = translate_language(lang_code, questions, translator)
            
            # Update and save
            lang_data['questions'] = translated_questions
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, indent=2, ensure_ascii=False)
            
            print(f"\n✓ {lang_code.upper()}: Successfully translated {len(translated_questions)} questions")
            
        except KeyboardInterrupt:
            print(f"\n\nInterrupted by user. Progress saved for {lang_code}.")
            sys.exit(0)
        except Exception as e:
            print(f"\n✗ {lang_code.upper()}: Error - {e}")
            import traceback
            traceback.print_exc()
            continue
        
        # Long pause between languages
        if lang_code != languages_to_translate[-1]:  # Not the last one
            print(f"\n  Waiting 15 seconds before next language...\n")
            time.sleep(15)
    
    print(f"\n{'='*70}")
    print("Translation Complete!")
    print(f"{'='*70}")

if __name__ == '__main__':
    main()

