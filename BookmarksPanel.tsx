/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, X, ArrowLeft, Trash2 } from 'lucide-react';
import { Article } from '../types';
import { translations } from '../translations';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  savedIds: string[];
  allArticles: Article[];
  onSelectArticle: (id: string) => void;
  onRemoveBookmark: (id: string) => void;
  lang: 'ar' | 'en';
}

export default function BookmarksPanel({
  isOpen,
  onClose,
  savedIds,
  allArticles,
  onSelectArticle,
  onRemoveBookmark,
  lang,
}: BookmarksPanelProps) {
  const t = translations[lang];

  // Retrieve bookmarked articles in order
  const bookmarkedArticles = allArticles.filter((a) => savedIds.includes(a.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
            id="bookmarks-panel-backdrop"
          />

          {/* Drawer Body Container */}
          <motion.div
            initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={`fixed inset-y-0 ${
              lang === 'ar' ? 'left-0 border-r-4' : 'right-0 border-l-4'
            } w-full max-w-md bg-white border-black z-50 flex flex-col p-6 shadow-[8px_0px_0px_rgba(0,0,0,1)] text-black`}
            id="bookmarks-drawer-body"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-6" id="bookmarks-drawer-header">
              <h3 className="font-sans font-black text-xl flex items-center gap-2 italic uppercase">
                <Bookmark className="w-6 h-6 text-black fill-black" />
                <span>{t.bookmarksTitle}</span>
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-none font-mono font-black italic border border-black">
                  {bookmarkedArticles.length}
                </span>
              </h3>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-neutral-100 border-2 border-black rounded-none cursor-pointer"
                aria-label="Close Bookmarks"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* List Content */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1 pl-1" id="bookmarks-items-list">
              {bookmarkedArticles.length > 0 ? (
                bookmarkedArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-3 bg-neutral-50 hover:bg-neutral-100 border-2 border-black p-3 rounded-none relative group"
                    id={`bookmark-item-card-${article.id}`}
                  >
                    {/* Tiny thumbnail preview */}
                    <div 
                      className="w-16 h-16 bg-neutral-100 border border-black overflow-hidden rounded-none flex-shrink-0 cursor-pointer"
                      onClick={() => {
                        onSelectArticle(article.id);
                        onClose();
                      }}
                    >
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-101 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Metadata summary */}
                    <div className="flex-grow min-w-0 flex flex-col justify-between">
                      <h4 
                        className="font-sans font-black text-xs sm:text-sm text-black group-hover:underline cursor-pointer leading-tight line-clamp-2"
                        onClick={() => {
                          onSelectArticle(article.id);
                          onClose();
                        }}
                      >
                        {article.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400 font-mono font-bold uppercase">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>{article.publishDate}</span>
                      </div>
                    </div>

                    {/* Quick remove button */}
                    <button
                      onClick={() => onRemoveBookmark(article.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-none border border-transparent hover:border-black cursor-pointer shrink-0"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 px-4" id="bookmarks-empty-state">
                  <Bookmark className="w-12 h-12 text-neutral-300 mx-auto mb-4 stroke-[1.5px]" />
                  <p className="text-sm font-black text-black mb-2">{t.noBookmarks}</p>
                </div>
              )}
            </div>

            {/* Back footer navigation */}
            <div className="border-t-2 border-black pt-4 mt-6" id="bookmarks-drawer-footer">
              <button
                onClick={onClose}
                className="w-full bg-black text-white py-3 font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 rounded-none border border-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
                <span>{lang === 'ar' ? 'الرجوع للقراءة والمتابعة' : 'Return to Reading'}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
