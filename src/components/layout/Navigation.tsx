'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { BookOpen, Trophy, BarChart3, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('common');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: `/${locale}/game`, label: t('game'), icon: BookOpen },
    { href: `/${locale}/results`, label: t('results'), icon: Trophy },
    { href: `/${locale}/stats`, label: t('stats'), icon: BarChart3 },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
                <a href={`/${locale}`} className="hover:scale-105 transition-transform inline-block">
                  {t('appName')}
                </a>
              </h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-2 sm:px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-300 rounded-t-lg',
                      isActive
                        ? 'border-primary-500 text-primary-600 bg-primary-50/50'
                        : 'border-transparent text-gray-600 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/30'
                    )}
                  >
                    <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center px-4 py-3 text-base font-medium rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-primary-100 text-primary-700 shadow-soft'
                        : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600 hover:scale-105'
                    )}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

