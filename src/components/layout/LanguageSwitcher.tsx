'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, defaultLocale, type Locale } from '@/i18n/config';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get locale with fallback
  let locale: Locale = defaultLocale;
  try {
    const currentLocale = useLocale();
    locale = (locales.includes(currentLocale as Locale) ? currentLocale : defaultLocale) as Locale;
  } catch (error) {
    // If useLocale fails, try to extract from pathname
    const pathLocale = pathname.split('/')[1];
    locale = (locales.includes(pathLocale as Locale) ? pathLocale : defaultLocale) as Locale;
  }

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    // Add new locale
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
    router.refresh();
    setIsOpen(false);
  };

  const currentLocaleName = localeNames[locale] || localeNames[defaultLocale];

  return (
    <div className="relative z-[100]" style={{ minWidth: '120px', visibility: 'visible', display: 'block' }}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors border border-gray-200 bg-white shadow-sm relative z-[100]"
        aria-label="Change language"
        type="button"
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          visibility: 'visible',
          opacity: 1,
          cursor: 'pointer',
          position: 'relative',
          zIndex: 100
        }}
      >
        <Globe className="w-4 h-4 flex-shrink-0" style={{ display: 'block' }} />
        <span className="hidden sm:inline whitespace-nowrap" style={{ display: 'inline' }}>{currentLocaleName}</span>
        <span className="sm:hidden" style={{ display: 'inline' }}>{locale.toUpperCase()}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] py-1 max-h-96 overflow-y-auto" style={{ zIndex: 100 }}>
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                  locale === loc ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
                }`}
                type="button"
              >
                {localeNames[loc]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

