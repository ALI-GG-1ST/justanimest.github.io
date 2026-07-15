/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, Clock, Eye, Sparkles } from 'lucide-react';
import { Article } from '../types';
import { translations } from '../translations';

interface FeaturedArticleProps {
  article: Article;
  onSelect: (id: string) => void;
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

export default function FeaturedArticle({ article, onSelect, lang }: FeaturedArticleProps) {
  const t = translations[lang];

  const localT = {
    ar: {
      featuredBadge: 'خبر بارز ومثبّت',
      authorRole: 'رئيس لجنة التحرير',
    },
    en: {
      featuredBadge: 'Featured Story',
      authorRole: 'Editor-in-Chief',
    },
  }[lang];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-black rounded-none overflow-hidden border-2 border-black cursor-pointer shadow-xs group"
      onClick={() => onSelect(article.id)}
      id={`featured-article-hero-${article.id}`}
    >
      {/* Background Cover Image with Gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={article.coverImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full opacity-50 group-hover:scale-101 transform transition-transform duration-700"
          id={`featured-bg-img-${article.id}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-transparent hidden lg:block"></div>
      </div>

      {/* Floating Sparkles Badge */}
      <div className={`absolute top-4 ${lang === 'ar' ? 'right-4' : 'left-4'} z-10 flex items-center gap-1.5 bg-white text-black text-xs font-black px-3 py-1 uppercase rounded-none border-2 border-black tracking-wider italic`}>
        <Sparkles className="w-4 h-4 text-black animate-spin" />
        <span>{localT.featuredBadge}</span>
      </div>

      {/* Content Content Area */}
      <div className={`relative z-10 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-end min-h-[450px] md:min-h-[520px] lg:min-h-[580px] max-w-4xl ${
        lang === 'ar' ? 'text-right' : 'text-left'
      }`} id="featured-content-area">
        {/* Meta details */}
        <div className={`flex flex-wrap items-center gap-4 text-xs text-neutral-300 mb-4 font-mono ${
          lang === 'ar' ? 'flex-row' : 'flex-row'
        }`}>
          <span className="bg-white text-black font-black px-2.5 py-1 rounded-none border border-black">
            {getCategoryLabel(article.category, lang)}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{article.publishDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{article.readTime}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{article.views.toLocaleString()} {t.viewsCount}</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-white group-hover:text-neutral-200 leading-tight mb-4 transition-colors">
          {article.title}
        </h2>

        {/* Short Description */}
        <p className="text-neutral-300 text-sm sm:text-base md:text-lg line-clamp-3 leading-relaxed mb-6 font-serif">
          {article.shortDescription}
        </p>

        {/* Author badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-none bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white text-sm font-sans uppercase">
            {article.author.slice(0, 2)}
          </div>
          <div className="flex flex-col text-sm">
            <span className="text-white font-bold">{article.author}</span>
            <span className="text-neutral-400 text-xs font-mono">{localT.authorRole}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
