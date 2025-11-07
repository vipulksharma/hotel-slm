#!/usr/bin/env python3
"""
Translate questions in batches to avoid rate limiting
"""

import json
import os
import time
from typing import Dict, Any

LANG_CODES = {
    'hi': 'hi', 'ta': 'ta', 'te': 'te', 'bn': 'bn', 'mr': 'mr', 'gu': 'gu',
    'kn': 'kn', 'ml': 'ml', 'ur': 'ur', 'pa': 'pa', 'or': 'or'
}

def translate_batch(texts: list, target_lang: str, translator) -> list:
    """Translate a batch of texts."""
    results = []
    for text in texts:
        if not text or not text.strip():
            results.append(text)
            continue
        try:
            result = translator.translate(text, dest=target_lang)
            results.append(result.text)
            time.sleep(0.3)  # Rate limiting
        except Exception as e:
            print(f"    Error: {e}")
            results.append(text)  # Fallback to original
    return results

def translate_questions_for_lang(lang_code: str, questions: Dict[str, Any], translator) -> Dict[str, Any]:
    """Translate all questions for a language."""
    print(f"\nTranslating to {lang_code.upper()}...")
    translated = {}
    total = len(questions)
    
    for idx, (q_id, q_data) in enumerate(questions.items(), 1):
        if idx % 10 == 0:
            print(f"  Progress: {idx}/{total} ({idx*100//total}%)")
        
        try:
            # Translate question
            q_trans = translator.translate(q_data['question'], dest=lang_code)
            time.sleep(0.5)
            
            # Translate all options
            translated_options = {}
            for opt_id, opt_data in q_data['options'].items():
                opt_text = translator.translate(opt_data['text'], dest=lang_code)
                time.sleep(0.5)
                
                opt_exp = translator.translate(opt_data['explanation'], dest=lang_code)
                time.sleep(0.5)
                
                translated_options[opt_id] = {
                    'text': opt_text.text,
                    'explanation': opt_exp.text
                }
            
            translated[q_id] = {
                'question': q_trans.text,
                'options': translated_options
            }
            
        except Exception as e:
            print(f"  Error translating {q_id}: {e}")
            # Use English as fallback
            translated[q_id] = q_data
            continue
        
        # Longer pause every 5 questions
        if idx % 5 == 0:
            time.sleep(2)
    
    return translated

def main():
    print("="*70)
    print("Batch Question Translation Script")
    print("="*70)
    
    try:
        from googletrans import Translator
        translator = Translator()
        print("✓ googletrans ready\n")
    except ImportError:
        print("Installing googletrans...")
        os.system("pip3 install googletrans==4.0.0rc1 --quiet")
        from googletrans import Translator
        translator = Translator()
        print("✓ googletrans installed\n")
    
    # Read English questions
    with open('messages/en.json', 'r', encoding='utf-8') as f:
        en_data = json.load(f)
    
    questions = en_data.get('questions', {})
    print(f"Found {len(questions)} questions\n")
    
    # Process each language
    for lang_code in LANG_CODES.keys():
        lang_file = f'messages/{lang_code}.json'
        
        if not os.path.exists(lang_file):
            print(f"Skipping {lang_code} - file not found")
            continue
        
        # Check if already translated
        with open(lang_file, 'r', encoding='utf-8') as f:
            lang_data = json.load(f)
        
        existing_q = lang_data.get('questions', {})
        if len(existing_q) == len(questions):
            # Check if actually translated (not English)
            sample_en_q = list(questions.values())[0]['question']
            sample_lang_q = list(existing_q.values())[0].get('question', '')
            if sample_lang_q and sample_lang_q != sample_en_q:
                print(f"{lang_code}: Already translated ({len(existing_q)} questions)")
                continue
        
        # Translate
        try:
            translated = translate_questions_for_lang(lang_code, questions, translator)
            lang_data['questions'] = translated
            
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(lang_data, f, indent=2, ensure_ascii=False)
            
            print(f"✓ {lang_code}: Translated {len(translated)} questions")
            
        except Exception as e:
            print(f"✗ {lang_code}: Error - {e}")
            continue
        
        # Long pause between languages
        print(f"  Waiting 10 seconds before next language...\n")
        time.sleep(10)
    
    print("\n" + "="*70)
    print("Translation complete!")
    print("="*70)

if __name__ == '__main__':
    main()

