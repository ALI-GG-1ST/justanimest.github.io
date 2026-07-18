/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MouseEvent } from 'react';
import { motion } from 'motion/react';
import { Clock, Eye, Calendar, Bookmark } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  key?: string;
  article: Article;
  onSelect: (id: string) => void;
  lang: 'ar' | 'en';
  isBookmarked?: boolean;
  onToggleBookmark?: (e: MouseEvent) => void;
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

export default function ArticleCard({
  article,
  onSelect,
  lang,
  isBookmarked,
  onToggleBookmark,
}: ArticleCardProps) {
  // Category color map for elegant badges
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'أخبار':
        return 'bg-black text-white border border-black';
      case 'مانجا':
        return 'bg-white text-black border border-black';
      case 'مراجعات':
        return 'bg-neutral-100 text-black border border-black';
      case 'فعاليات':
        return 'bg-neutral-800 text-white border border-black';
      default:
        return 'bg-neutral-200 text-black border border-black';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col bg-white border border-black rounded-none overflow-hidden hover:bg-neutral-50 transition-all duration-200 h-full cursor-pointer"
      onClick={() => onSelect(article.id)}
      id={`article-card-${article.id}`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 border-b border-black" id={`card-image-box-${article.id}`}>
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full transform group-hover:scale-101 transition-transform duration-500"
          id={`card-img-${article.id}`}
        />
        {/* Category Badge */}
        <div className={`absolute top-3 ${lang === 'ar' ? 'right-3' : 'left-3'} z-10`}>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-none uppercase tracking-widest italic ${getCategoryColor(article.category)}`}>
            {getCategoryLabel(article.category, lang)}
          </span>
        </div>

        {/* Bookmark Overlay Button */}
        {onToggleBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card navigation trigger
              onToggleBookmark(e);
            }}
            className={`absolute top-3 ${lang === 'ar' ? 'left-3' : 'right-3'} z-20 p-2 bg-white hover:bg-neutral-100 border-2 border-black rounded-none transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer`}
            title="Bookmark"
            id={`bookmark-card-btn-${article.id}`}
          >
            <Bookmark className={`w-3.5 h-3.5 text-black ${isBookmarked ? 'fill-black' : ''}`} />
          </button>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-5" id={`card-content-box-${article.id}`}>
        {/* Article Meta Row */}
        <div className={`flex flex-wrap items-center gap-4 text-[10px] font-black text-neutral-400 uppercase mb-3 font-mono ${
          lang === 'ar' ? 'flex-row' : 'flex-row'
        }`}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-black" />
            <span>{article.publishDate}</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-black" />
            <span>{article.readTime}</span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-black" />
            <span>{article.views.toLocaleString()}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sans font-black text-lg text-black group-hover:underline leading-snug mb-3 transition-all">
          {article.title}
        </h3>

        {/* Short Description */}
        <p className="text-neutral-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 font-serif">
          {article.shortDescription}
        </p>

        {/* Tags footer */}
        <div className="mt-auto pt-4 border-t border-dashed border-neutral-200 flex items-center gap-2 overflow-hidden" id={`card-tags-box-${article.id}`}>
          <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap text-[11px] font-black text-neutral-500 font-mono italic">
            {article.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="hover:line-through transition-all">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
