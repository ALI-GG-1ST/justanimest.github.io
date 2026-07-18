/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Eye, TrendingUp, BellRing, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { translations } from '../translations';
import DailyPoll from './DailyPoll';
import ReleaseSchedule from './ReleaseSchedule';

interface SidebarProps {
  trendingArticles: Article[];
  categories: { id: string; label: string; count: number }[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onSelectArticle: (id: string) => void;
  lang: 'ar' | 'en';
}

const getCategoryLabel = (cat: string, lang: 'ar' | 'en') => {
  const map: Record<string, { ar: string; en: string }> = {
    'الكل': { ar: 'الكل', en: 'All' },
    'أخبار': { ar: 'أخبار', en: 'News' },
    'أنمي': { ar: 'أنمي', en: 'Anime' },
    'مانجا': { ar: 'مانجا', en: 'Manga' },
    'مراجعات': { ar: 'مراجعات', en: 'Reviews' },
    'فعاليات': { ar: 'فعاليات', en: 'Events' },
  };
  return map[cat]?.[lang] || cat;
};

export default function Sidebar({
  trendingArticles,
  categories,
  activeCategory,
  setActiveCategory,
  onSelectArticle,
  lang,
}: SidebarProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = translations[lang];

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  // Local translations for sidebar components
  const sidebarT = {
    ar: {
      sponsored: 'إعلان ممول',
      adDesc: 'تم تجهيز الكود لتشغيل الإعلانات المباشرة فوراً. ما عليك سوى استبدال معرف الإعلانات الخاص بك في ملف الإعدادات.',
      newsTitle: 'النشرة الإخبارية لـ JUST ANIME',
      newsDesc: 'اشترك لتكون أول من يتلقى التسريبات الحصرية، عروض الأنمي القادمة، والتقارير الأسبوعية فور صدورها!',
      newsSuccess: '🎉 مبارك انضمامك لأقوى مجتمع أنمي! سنرسل لك التسريبات قريباً.',
      placeholder: 'بريدك الإلكتروني المفضل...',
      subscribeBtn: 'اشترك الآن مجاناً',
    },
    en: {
      sponsored: 'Sponsored Ad',
      adDesc: 'Ad code is ready for immediate live delivery. Simply replace your ad ID in the configuration settings.',
      newsTitle: 'JUST ANIME Newsletter',
      newsDesc: 'Subscribe to be the first to receive exclusive leaks, upcoming trailers, and weekly reports!',
      newsSuccess: '🎉 Welcome to the ultimate anime community! Leaks are heading your way soon.',
      placeholder: 'Your preferred email address...',
      subscribeBtn: 'Subscribe Now for Free',
    },
  }[lang];

  return (
    <aside className="space-y-8" id="blog-sidebar">
      
      {/* Category List */}
      <div className="bg-white border-2 border-black rounded-none p-6" id="sidebar-categories">
        <h3 className={`font-sans font-black text-lg text-black border-b-2 border-black pb-3 mb-4 flex items-center gap-2 uppercase tracking-wide ${
          lang === 'ar' ? 'flex-row' : 'flex-row'
        }`}>
          <Sparkles className="w-5 h-5 text-black" />
          <span>{t.browseCategories}</span>
        </h3>
        <div className="flex flex-col gap-1.5">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} px-4 py-2.5 rounded-none text-sm font-bold transition-all flex items-center justify-between border-b border-neutral-100 last:border-b-0 ${
                  isSelected
                    ? 'bg-black text-white border border-black'
                    : 'text-neutral-600 hover:text-black hover:line-through hover:bg-neutral-50'
                }`}
              >
                <span>{getCategoryLabel(cat.id, lang)}</span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-none font-mono font-black ${
                  isSelected ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-black border border-black'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Anime Poll */}
      <DailyPoll lang={lang} />

      {/* Weekly Broadcast Schedule */}
      <ReleaseSchedule lang={lang} />

      {/* Trending Articles Section */}
      <div className="bg-white border-2 border-black rounded-none p-6" id="sidebar-trending">
        <h3 className="font-sans font-black text-lg text-black border-b-2 border-black pb-3 mb-4 flex items-center gap-2 uppercase tracking-wide">
          <TrendingUp className="w-5 h-5 text-black" />
          <span>{t.trendingTitle}</span>
        </h3>
        <div className="divide-y divide-neutral-200">
          {trendingArticles.slice(0, 5).map((article, index) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article.id)}
              className="group py-3.5 flex items-start gap-4 cursor-pointer first:pt-0 last:pb-0"
              id={`trending-item-${article.id}`}
            >
              <div className="font-mono text-3xl font-black text-neutral-300 group-hover:text-black transition-colors w-8 flex-shrink-0 text-center italic">
                {(index + 1).toString().padStart(2, '0')}
              </div>
              <div className="flex-grow min-w-0">
                <span className="text-[9px] bg-black text-white font-black px-2 py-0.5 rounded-none mb-1.5 inline-block uppercase italic">
                  {getCategoryLabel(article.category, lang)}
                </span>
                <h4 className="font-sans font-black text-sm text-black group-hover:underline line-clamp-2 leading-snug transition-all">
                  {article.title}
                </h4>
                <div className={`flex items-center gap-2 text-[10px] text-neutral-400 mt-1 font-mono uppercase font-black ${
                  lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'
                }`}>
                  <Eye className="w-3.5 h-3.5 text-black" />
                  <span>{article.views.toLocaleString()} {t.viewsCount}</span>
                  <span>•</span>
                  <span>{article.publishDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adsterra Advertisement Slot Mockup */}
      <div className="bg-neutral-50 border-2 border-black rounded-none p-6 relative overflow-hidden" id="sidebar-ad-slot">
        <div className={`absolute top-0 ${lang === 'ar' ? 'left-0' : 'right-0'} bg-black text-[9px] font-black text-white px-3 py-1 uppercase tracking-widest font-mono`}>
          {sidebarT.sponsored}
        </div>
        <div className="mt-4 text-center">
          <div className="border border-dashed border-black rounded-none py-10 px-4 bg-white flex flex-col items-center justify-center">
            <span className="text-black font-mono text-xs font-black uppercase tracking-widest mb-1 italic">
              ADSTERRA BANNER
            </span>
            <span className="text-neutral-500 font-mono text-[10px] font-black">
              300 × 250 Banner Placeholder
            </span>
            <div className="mt-4 text-[11px] text-neutral-500 max-w-xs leading-relaxed font-serif">
              {sidebarT.adDesc}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Subscription Box */}
      <div className="bg-white text-black border-2 border-black rounded-none p-6 relative overflow-hidden shadow-xs" id="sidebar-newsletter">
        <div className="relative z-10">
          <h3 className="font-sans font-black text-lg mb-2 flex items-center gap-2 uppercase tracking-wide">
            <BellRing className="w-5 h-5 text-black" />
            <span>{sidebarT.newsTitle}</span>
          </h3>
          <p className="text-neutral-600 text-xs leading-relaxed mb-5 font-serif">
            {sidebarT.newsDesc}
          </p>

          {subscribed ? (
            <div className="bg-neutral-50 border-2 border-black p-4 rounded-none text-center text-black text-xs font-black animate-in fade-in duration-300">
              {sidebarT.newsSuccess}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                required
                placeholder={sidebarT.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-50 text-black placeholder-neutral-400 text-xs px-4 py-3 rounded-none border border-black focus:outline-none focus:bg-white transition-all font-mono"
              />
              <button
                type="submit"
                className="w-full bg-black text-white text-xs font-black py-3 rounded-none hover:bg-neutral-800 transition-all duration-350 uppercase tracking-widest flex items-center justify-center gap-2 border border-black cursor-pointer"
              >
                <span>{sidebarT.subscribeBtn}</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </aside>
  );
}
