/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Flame, Zap } from 'lucide-react';
import { translations } from '../translations';

interface BreakingTickerProps {
  lang: 'ar' | 'en';
  onSelectLeak?: (text: string) => void;
}

export default function BreakingTicker({ lang }: BreakingTickerProps) {
  const t = translations[lang];
  const [newsItems, setNewsItems] = useState<string[]>([]);

  const defaultAr = [
    'تسريبات الفصل 1130 من مانجا One Piece تؤكد عودة أمير العمالقة لوكي!',
    'رسمياً: استوديو Wit يعلن عن بدء إنتاج ريميك أنمي One Piece الشهير باسم THE ONE PIECE.',
    'تسريبات حصرية: تحديد موعد عرض الجزء الثاني من الموسم الأخير لـ Bleach TYBW في أكتوبر 2026.',
    'صدمة الأسبوع: مانجاكا Jujutsu Kaisen يلمح لـ غلاف خاص وفصل إضافي قصير قريباً!',
    'مؤكد: أنمي Solo Leveling يحصل على فيلم سينمائي يغطي آرك الحديقة الحمراء.',
    'إعلان رسمي: مانجا هجوم العمالقة تحصل على نسخة ملونة بالكامل بقلم إيساياما.'
  ];

  const defaultEn = [
    'One Piece Chapter 1130 leaks confirm the return of Prince Loki of Elbaf!',
    'Official: Wit Studio announces production start for THE ONE PIECE anime remake.',
    'Exclusive Leak: Bleach TYBW Part 3 broadcast date set for October 2026.',
    'Weekly Shock: Jujutsu Kaisen creator hints at a special bonus epilogue chapter!',
    'Confirmed: Solo Leveling is getting a theatrical movie covering the Red Gate arc.',
    'Official Reveal: Attack on Titan manga to receive a fully colored edition by Isayama.'
  ];

  useEffect(() => {
    const handleUpdate = () => {
      const savedAr = localStorage.getItem('just_anime_ticker_ar');
      const savedEn = localStorage.getItem('just_anime_ticker_en');
      
      if (lang === 'ar') {
        setNewsItems(savedAr ? JSON.parse(savedAr) : defaultAr);
      } else {
        setNewsItems(savedEn ? JSON.parse(savedEn) : defaultEn);
      }
    };

    handleUpdate();

    // Listen for custom events when ticker changes
    window.addEventListener('just_anime_ticker_updated', handleUpdate);
    return () => {
      window.removeEventListener('just_anime_ticker_updated', handleUpdate);
    };
  }, [lang]);

  if (newsItems.length === 0) return null;

  return (
    <div 
      className="w-full bg-black text-white border-y-2 border-black h-10 flex items-center overflow-hidden relative select-none"
      id="breaking-news-ticker"
    >
      {/* Ticker Title Badge */}
      <div 
        className={`h-full px-4 bg-red-600 text-white font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-1.5 z-10 border-r-2 border-black shrink-0 italic ${
          lang === 'ar' ? 'border-l-2 border-r-0' : 'border-r-2 border-l-0'
        }`}
        id="ticker-badge"
      >
        <Flame className="w-4.5 h-4.5 text-white animate-bounce" />
        <span>{t.tickerLabel}</span>
      </div>

      {/* Ticker Content Sliding Marquee */}
      <div className="flex items-center w-full relative overflow-hidden" id="ticker-marquee-container">
        <div 
          className={`flex whitespace-nowrap items-center gap-12 font-sans font-bold text-xs sm:text-sm ${
            lang === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee-ltr'
          }`}
          style={{
            animationDuration: '30s',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear'
          }}
          id="ticker-marquee-flow"
        >
          {/* First loop of items */}
          {newsItems.map((item, idx) => (
            <div key={`item-1-${idx}`} className="flex items-center gap-2 hover:text-red-500 cursor-default transition-colors">
              <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
          {/* Second loop of items for seamless infinite scroll */}
          {newsItems.map((item, idx) => (
            <div key={`item-2-${idx}`} className="flex items-center gap-2 hover:text-red-500 cursor-default transition-colors">
              <Zap className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
