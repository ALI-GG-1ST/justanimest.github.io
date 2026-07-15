/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Eye, Sparkles, Clock, BookOpen, Award, Check } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, increment } from 'firebase/firestore';
import { Article } from '../types';

interface DailyAnimeBriefProps {
  lang: 'ar' | 'en';
  onSelectArticle: (id: string) => void;
  articlesCount?: number; // to trigger updates if articles list changes
}

export default function DailyAnimeBrief({
  lang,
  onSelectArticle,
  articlesCount = 0,
}: DailyAnimeBriefProps) {
  const [briefs, setBriefs] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [hypedIds, setHypedIds] = useState<string[]>([]);
  const [localHypes, setLocalHypes] = useState<Record<string, number>>({});

  const isAr = lang === 'ar';

  // Load hyped IDs from LocalStorage to prevent spamming
  useEffect(() => {
    const savedHyped = localStorage.getItem('just_anime_hyped_briefs');
    if (savedHyped) {
      try {
        setHypedIds(JSON.parse(savedHyped));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch briefs from Firestore
  useEffect(() => {
    const fetchBriefs = async () => {
      setLoading(true);
      try {
        const articlesCol = collection(db, 'articles');
        const querySnapshot = await getDocs(articlesCol);
        let list: Article[] = [];

        if (!querySnapshot.empty) {
          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data() as Article;
            list.push({ ...data, id: docSnap.id });
          });
        } else {
          // Fallback to local storage if Firestore is empty/unseeded
          const savedArticles = localStorage.getItem('just_anime_articles');
          if (savedArticles) {
            list = JSON.parse(savedArticles);
          }
        }

        // Filter by lang and sort by views / status
        const filteredList = list
          .filter((a) => (a.lang || 'ar') === lang)
          // Sort prioritising isTrending, then views descending
          .sort((a, b) => {
            if (a.isTrending && !b.isTrending) return -1;
            if (!a.isTrending && b.isTrending) return 1;
            return (b.views || 0) - (a.views || 0);
          })
          .slice(0, 5);

        setBriefs(filteredList);
        if (filteredList.length > 0 && !activeBriefId) {
          setActiveBriefId(filteredList[0].id);
        }
      } catch (err) {
        console.warn("Firestore briefs load failed. Falling back to LocalStorage.", err);
        const savedArticles = localStorage.getItem('just_anime_articles');
        if (savedArticles) {
          try {
            const list = (JSON.parse(savedArticles) as Article[])
              .filter((a) => (a.lang || 'ar') === lang)
              .sort((a, b) => (b.views || 0) - (a.views || 0))
              .slice(0, 5);
            setBriefs(list);
            if (list.length > 0 && !activeBriefId) {
              setActiveBriefId(list[0].id);
            }
          } catch (e) {
            console.error(e);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBriefs();
  }, [lang, articlesCount]);

  // Handle Hype upvote
  const handleHype = async (storyId: string, e: MouseEvent) => {
    e.stopPropagation(); // Avoid triggering accordion toggle
    if (hypedIds.includes(storyId)) return;

    // Optimistically update UI
    setLocalHypes((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + 1,
    }));

    const nextHyped = [...hypedIds, storyId];
    setHypedIds(nextHyped);
    localStorage.setItem('just_anime_hyped_briefs', JSON.stringify(nextHyped));

    try {
      // Increment views or hypeCount directly in Firestore
      const articleDocRef = doc(db, 'articles', storyId);
      await setDoc(articleDocRef, {
        views: increment(15), // Increments views nicely as hype on Firestore
      }, { merge: true });
    } catch (err) {
      console.warn("Failed to record hype to Firestore", err);
    }
  };

  const briefsLabels = {
    ar: {
      title: 'ملخص الأنمي اليومي المكثف',
      subtitle: 'أهم 5 تسريبات وقصص رائجة على الساحة الآن - مباشرة من الخادم الرئيسي',
      readReport: 'قراءة التقرير الكامل بالتفصيل',
      views: 'مشاهدة',
      hypeBtn: 'ادعم هذا الخبر بـ طاقة اللهب',
      hyped: 'تم شحن الحماس!',
      loading: 'جاري استيراد موجز الأخبار من قاعدة البيانات الموزعة...',
      empty: 'لا يوجد موجز متاح حالياً للغة المحددة.',
      minuteRead: 'دقائق قراءة',
    },
    en: {
      title: 'Daily Anime Brief',
      subtitle: 'Top 5 trending stories & exclusive leaks on the scene – synced live from Firestore',
      readReport: 'Read Full Detailed Report',
      views: 'views',
      hypeBtn: 'Hype this story!',
      hyped: 'Hype Fuelled!',
      loading: 'Loading real-time briefings from Firestore servers...',
      empty: 'No daily briefs available at this time.',
      minuteRead: 'min read',
    }
  }[lang];

  if (loading) {
    return (
      <div 
        className="w-full bg-white border-4 border-black p-8 text-center rounded-none shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden"
        id="daily-brief-loading"
      >
        <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-400 animate-pulse" />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 border-4 border-black border-t-amber-400 rounded-full animate-spin" />
          <p className="text-sm font-mono font-black text-black uppercase tracking-wider">
            {briefsLabels.loading}
          </p>
        </div>
      </div>
    );
  }

  if (briefs.length === 0) {
    return null;
  }

  return (
    <div 
      className="bg-amber-100 border-4 border-black p-6 rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden mb-8"
      id="daily-anime-briefs-section"
    >
      {/* Decorative background grid and badge */}
      <div className="absolute top-0 right-0 p-3 select-none pointer-events-none opacity-20">
        <Sparkles className="w-24 h-24 text-amber-500" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-red-600 text-white font-mono font-black uppercase px-2.5 py-0.5 border-2 border-black inline-block transform -rotate-1">
              {isAr ? 'عاجل ورائج' : 'TRENDING DAILY'}
            </span>
            <span className="text-[9px] bg-black text-white font-mono font-bold px-2 py-0.5 border border-black inline-block">
              FIRESTORE LIVE
            </span>
          </div>
          <h2 className="font-sans font-black text-2xl md:text-3xl text-black mt-2 tracking-tight flex items-center gap-2">
            <Flame className="w-7 h-7 text-red-600 fill-red-600 animate-bounce" />
            <span>{briefsLabels.title}</span>
          </h2>
          <p className="text-xs text-neutral-700 font-sans mt-1 max-w-2xl font-bold">
            {briefsLabels.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-start md:self-center font-mono text-[10px] font-black bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
          <Clock className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '6s' }} />
          <span>{isAr ? 'تحديث تلقائي' : 'REALTIME SYNCED'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="briefs-layout-grid">
        {/* Left/Right List of Rankings (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3" id="briefs-ranks-selector">
          {briefs.map((story, index) => {
            const isActive = activeBriefId === story.id;
            const rankLabel = `#0${index + 1}`;
            const displayViews = (story.views || 0) + (localHypes[story.id] || 0) * 15;

            return (
              <button
                key={story.id}
                onClick={() => setActiveBriefId(story.id)}
                className={`w-full text-right flex items-center justify-between gap-3 p-3.5 border-2 border-black rounded-none transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]' 
                    : 'bg-white text-black hover:bg-neutral-50 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_rgba(0,0,0,1)]'
                }`}
                id={`brief-selector-btn-${story.id}`}
              >
                <div className={`flex items-center gap-3 min-w-0 ${isAr ? 'text-right' : 'text-left'}`}>
                  {/* Big Rank number */}
                  <span className={`font-mono text-lg font-black italic tracking-tighter shrink-0 ${
                    isActive ? 'text-amber-300' : 'text-neutral-400'
                  }`}>
                    {rankLabel}
                  </span>

                  <div className="min-w-0">
                    <span className={`text-[8px] font-mono font-black uppercase px-1.5 py-0.5 border shrink-0 ${
                      isActive ? 'bg-amber-400 text-black border-amber-400' : 'bg-black text-white border-black'
                    }`}>
                      {story.category}
                    </span>
                    <h4 className="font-sans font-black text-xs sm:text-sm mt-1.5 truncate leading-tight">
                      {story.title}
                    </h4>
                  </div>
                </div>

                {/* Micro indicators */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 font-mono text-[9px] font-black">
                    <Eye className="w-3 h-3 text-red-600" />
                    <span>{displayViews}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Area for Selected Brief (7 cols) */}
        <div className="lg:col-span-7" id="briefs-display-pannel">
          <AnimatePresence mode="wait">
            {briefs.map((story, index) => {
              if (story.id !== activeBriefId) return null;
              const hasHyped = hypedIds.includes(story.id);
              const displayViews = (story.views || 0) + (localHypes[story.id] || 0) * 15;

              return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: isAr ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isAr ? 15 : -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_rgba(0,0,0,1)] h-full flex flex-col justify-between relative"
                  id={`brief-details-card-${story.id}`}
                >
                  <div>
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-black text-white font-mono font-black uppercase px-2 py-0.5 rounded-none italic">
                          {story.category}
                        </span>
                        <span className="text-[9px] text-neutral-500 font-mono font-bold">
                          {story.publishDate} • {story.readTime || '3'} {briefsLabels.minuteRead}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-[10px] font-mono font-black text-black">
                        <Award className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '10s' }} />
                        <span>TRENDING #{index + 1}</span>
                      </div>
                    </div>

                    {/* Headline and Image thumbnail wrapper */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start mb-4">
                      {story.coverImage && (
                        <img 
                          src={story.coverImage} 
                          alt={story.title} 
                          className="w-full sm:w-28 h-20 object-cover border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-sans font-black text-lg md:text-xl text-black leading-tight hover:underline cursor-pointer" onClick={() => onSelectArticle(story.id)}>
                          {story.title}
                        </h3>
                        <p className="text-xs text-neutral-400 font-mono mt-1 font-bold">
                          {isAr ? 'الكاتب الرئيسي:' : 'Lead Writer:'} <span className="text-black">{story.author}</span>
                        </p>
                      </div>
                    </div>

                    {/* Brief Synopsis Text */}
                    <p className="text-xs sm:text-sm text-neutral-700 font-serif leading-relaxed mb-6 border-l-4 border-black pl-3 bg-neutral-50 p-3 italic">
                      {story.shortDescription}
                    </p>
                  </div>

                  {/* Buttons Action bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t-2 border-black pt-4 mt-auto">
                    {/* Hype Upvote Interactive Trigger */}
                    <button
                      onClick={(e) => handleHype(story.id, e)}
                      disabled={hasHyped}
                      className={`px-4 py-2 border-2 border-black text-xs font-mono font-black uppercase transition-all flex items-center justify-center gap-1.5 rounded-none cursor-pointer ${
                        hasHyped 
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-300' 
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
                      }`}
                      id={`brief-hype-btn-${story.id}`}
                    >
                      {hasHyped ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                          <span>{briefsLabels.hyped}</span>
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4 text-red-600 fill-red-500 animate-pulse" />
                          <span>{briefsLabels.hypeBtn}</span>
                        </>
                      )}
                    </button>

                    {/* Read Full detailed Report */}
                    <button
                      onClick={() => onSelectArticle(story.id)}
                      className="bg-black text-white hover:bg-neutral-800 px-5 py-2 text-xs font-sans font-black uppercase flex items-center justify-center gap-1.5 rounded-none shadow-[3px_3px_0px_rgba(251,191,36,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(251,191,36,1)] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
                      id={`brief-read-full-${story.id}`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{briefsLabels.readReport}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
