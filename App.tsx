/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronUp,
  Twitter,
  Instagram,
  Heart,
  Search,
  Sparkles,
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ArticleCard from './components/ArticleCard';
import FeaturedArticle from './components/FeaturedArticle';
import ArticleViewer from './components/ArticleViewer';
import PublishingDashboard from './components/PublishingDashboard';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import BreakingTicker from './components/BreakingTicker';
import BookmarksPanel from './components/BookmarksPanel';
import AuthModal from './components/AuthModal';
import DailyAnimeBrief from './components/DailyAnimeBrief';
import AdBlockNotice from './components/AdBlockNotice';
import SEOHead from './components/SEOHead';

// Interactive Home components for a long, content-rich feed
import AnimeSeasonTimeline from './components/home/AnimeSeasonTimeline';
import CharacterSpotlight from './components/home/CharacterSpotlight';
import MangaLeaksHub from './components/home/MangaLeaksHub';
import VersusArena from './components/home/VersusArena';

import { Article, LoggedInUser } from './types';
import { initialArticles } from './data/initialArticles';
import { translations } from './translations';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('home'); // 'home', 'categories', 'publishing', 'about', 'contact', 'privacy'
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  // Bookmarks State
  const [savedBookmarkIds, setSavedBookmarkIds] = useState<string[]>([]);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  const t = translations[lang];
  const categoriesList = ['الكل', 'أخبار', 'أنمي', 'مانجا', 'مراجعات', 'فعاليات'];

  const getCategoryLabel = (cat: string, targetLang: 'ar' | 'en') => {
    const map: Record<string, { ar: string; en: string }> = {
      'الكل': { ar: 'الكل', en: 'All' },
      'أخبار': { ar: 'أخبار', en: 'News' },
      'أنمي': { ar: 'أنمي', en: 'Anime' },
      'مانجا': { ar: 'مانجا', en: 'Manga' },
      'مراجعات': { ar: 'مراجعات', en: 'Reviews' },
      'فعاليات': { ar: 'فعاليات', en: 'Events' },
    };
    return map[cat]?.[targetLang] || cat;
  };

  // Toggle bookmark function
  const handleToggleBookmark = (id: string) => {
    setSavedBookmarkIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((bId) => bId !== id) : [...prev, id];
      localStorage.setItem('just_anime_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Initialize articles from Firestore or LocalStorage/Seeding
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesCol = collection(db, 'articles');
        const querySnapshot = await getDocs(articlesCol);
        if (!querySnapshot.empty) {
          const loadedArticles: Article[] = [];
          querySnapshot.forEach((docSnap) => {
            loadedArticles.push(docSnap.data() as Article);
          });
          // Sort by publishDate descending
          loadedArticles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
          setArticles(loadedArticles);
          localStorage.setItem('just_anime_articles', JSON.stringify(loadedArticles));
          return;
        }
        
        // If Firestore is empty but connected, we seed it with initialArticles
        console.log("Firestore articles empty, seeding initial articles...");
        for (const art of initialArticles) {
          await setDoc(doc(db, 'articles', art.id), art);
        }
        setArticles(initialArticles);
        localStorage.setItem('just_anime_articles', JSON.stringify(initialArticles));
      } catch (err) {
        console.warn("Firestore articles fetch failed (likely placeholder configuration). Falling back to localStorage/initialData.", err);
        // Fallback to local storage
        const savedArticles = localStorage.getItem('just_anime_articles');
        if (savedArticles) {
          const parsed = JSON.parse(savedArticles) as Article[];
          const hasEnglish = parsed.some((a) => a.lang === 'en');
          if (!hasEnglish) {
            localStorage.setItem('just_anime_articles', JSON.stringify(initialArticles));
            setArticles(initialArticles);
          } else {
            setArticles(parsed);
          }
        } else {
          localStorage.setItem('just_anime_articles', JSON.stringify(initialArticles));
          setArticles(initialArticles);
        }
      }
    };

    fetchArticles();

    // Load saved bookmarks
    const savedBookmarks = localStorage.getItem('just_anime_bookmarks');
    if (savedBookmarks) {
      setSavedBookmarkIds(JSON.parse(savedBookmarks));
    }

    // Load saved current user session
    const savedUser = localStorage.getItem('just_anime_current_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }

    // Scroll top listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Support deep-linking for search engines (Sitemap) and shared links
  useEffect(() => {
    if (articles.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const articleIdFromQuery = params.get('article');
    const hash = window.location.hash;
    const articleIdFromHash = hash.startsWith('#article-') ? hash.replace('#article-', '') : null;
    
    const targetId = articleIdFromQuery || articleIdFromHash;
    if (targetId) {
      const exists = articles.some((a) => a.id === targetId);
      if (exists) {
        setActiveArticleId(targetId);
      }
    }
  }, [articles]);

  // Update localStorage when articles change
  const handleLoginSuccess = (user: LoggedInUser) => {
    setCurrentUser(user);
    localStorage.setItem('just_anime_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('just_anime_current_user');
    if (currentTab === 'publishing') {
      setCurrentTab('home');
    }
  };

  const handlePublishNewArticle = async (newArticle: Article) => {
    // Add to Firestore if possible
    try {
      await setDoc(doc(db, 'articles', newArticle.id), newArticle);
    } catch (err) {
      console.warn("Failed to write new article to Firestore", err);
    }

    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem('just_anime_articles', JSON.stringify(updated));
    // Reset views and go back to home tab to show it
    setActiveArticleId(null);
    setCurrentTab('home');
    setActiveCategory('الكل');
  };

  const handleUpdateArticle = async (updatedArticle: Article) => {
    // Update in Firestore if possible
    try {
      await setDoc(doc(db, 'articles', updatedArticle.id), updatedArticle);
    } catch (err) {
      console.warn("Failed to update article in Firestore", err);
    }

    const updated = articles.map((art) => (art.id === updatedArticle.id ? updatedArticle : art));
    setArticles(updated);
    localStorage.setItem('just_anime_articles', JSON.stringify(updated));
  };

  const handleDeleteArticle = async (id: string) => {
    // Delete in Firestore if possible
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (err) {
      console.warn("Failed to delete article from Firestore", err);
    }

    const updated = articles.filter((art) => art.id !== id);
    setArticles(updated);
    localStorage.setItem('just_anime_articles', JSON.stringify(updated));
  };

  const handleSelectArticle = (id: string) => {
    setActiveArticleId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveArticleId(null);
    setSearchQuery('');
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and Search logic (filtering by language first)
  const filteredArticles = articles.filter((article) => {
    const matchesLang = (article.lang || 'ar') === lang;
    const matchesCategory = activeCategory === 'الكل' || article.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      article.keywords.some((key) => key.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesLang && matchesCategory && matchesSearch;
  });

  // Pick Featured Article (the one with isFeatured flag in active language, or first in active language)
  const featuredArticle =
    articles.find((a) => (a.lang || 'ar') === lang && a.isFeatured) ||
    articles.find((a) => (a.lang || 'ar') === lang) ||
    articles[0];

  // Pick Trending Articles (sorted by views count in active language)
  const trendingArticles = [...articles]
    .filter((a) => (a.lang || 'ar') === lang)
    .sort((a, b) => b.views - a.views);

  // Generate category aggregated metrics for Sidebar
  const sidebarCategoryCounts = categoriesList.map((cat) => ({
    id: cat,
    label: getCategoryLabel(cat, lang),
    count: cat === 'الكل'
      ? articles.filter((a) => (a.lang || 'ar') === lang).length
      : articles.filter((a) => (a.lang || 'ar') === lang && a.category === cat).length,
  }));

  const activeArticle = articles.find((a) => a.id === activeArticleId) || null;

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-neutral-50 font-sans antialiased text-black pb-12 select-text ${
        lang === 'ar' ? 'text-right' : 'text-left'
      }`}
      id="app-root-div"
    >
      {/* Dynamic Header Component */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setActiveArticleId(null); // Close viewer when switching pages
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        lang={lang}
        setLang={(newLang) => {
          setLang(newLang);
          setActiveCategory('الكل'); // Reset category filter on language change
          setActiveArticleId(null);
        }}
        onOpenBookmarks={() => setBookmarksOpen(true)}
        bookmarksCount={savedBookmarkIds.length}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Infinite Breaking News Ticker */}
      <BreakingTicker lang={lang} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content-layout">
        
        {/* Dynamic Inner Router Views */}
        <AnimatePresence mode="wait">
          {activeArticleId && activeArticle ? (
            <motion.div
              key="article-viewer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <ArticleViewer
                article={activeArticle}
                allArticles={articles}
                onBack={handleBackToHome}
                onSelectArticle={handleSelectArticle}
                lang={lang}
                isBookmarked={savedBookmarkIds.includes(activeArticle.id)}
                onToggleBookmark={() => handleToggleBookmark(activeArticle.id)}
              />
            </motion.div>
          ) : currentTab === 'publishing' ? (
            currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor') ? (
              <motion.div
                key="publishing-dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <PublishingDashboard
                  onPublish={handlePublishNewArticle}
                  categoriesList={categoriesList}
                  lang={lang}
                  articles={articles}
                  onUpdateArticle={handleUpdateArticle}
                  onDeleteArticle={handleDeleteArticle}
                />
              </motion.div>
            ) : (
              /* GORGEOUS RETRO ACCESS DENIED GUARD CARD */
              <motion.div
                key="publishing-access-denied"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto bg-white border-4 border-black p-8 text-center rounded-none shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1.5 bg-red-600" />
                <span className="text-[10px] bg-red-600 text-white font-mono font-black uppercase px-2.5 py-0.5 border border-black inline-block mb-4">
                  {lang === 'ar' ? 'خطأ في التصريح والمصادقة' : 'OAUTH ACCESS VIOLATION'}
                </span>
                <h3 className="font-sans font-black text-2xl text-black">
                  {lang === 'ar' ? 'عذراً! لا تملك صلاحية الوصول لهذه الصفحة' : 'Access Denied! Authorization Required'}
                </h3>
                <p className="text-xs text-neutral-500 font-sans mt-2 leading-relaxed">
                  {lang === 'ar'
                    ? 'هذه اللوحة مخصصة ومحمية بالكامل لصالح مدراء ومشرفي الموقع فقط لتحديث الأخبار والتسريبات.'
                    : 'This secure dashboard is strictly restricted to site administrators and designated staff.'}
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-500 text-black font-sans text-xs font-black uppercase px-6 py-3 border-2 border-black rounded-none transition-all cursor-pointer shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                  >
                    {lang === 'ar' ? 'تسجيل الدخول كمسؤول' : 'Login as Staff'}
                  </button>
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-black font-sans text-xs font-bold px-6 py-3 border border-black rounded-none cursor-pointer"
                  >
                    {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                  </button>
                </div>
              </motion.div>
            )
          ) : currentTab === 'about' ? (
            <motion.div
              key="about-us"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AboutUs lang={lang} />
            </motion.div>
          ) : currentTab === 'contact' ? (
            <motion.div
              key="contact-us"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ContactUs lang={lang} />
            </motion.div>
          ) : currentTab === 'privacy' ? (
            <motion.div
              key="privacy-policy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PrivacyPolicy lang={lang} />
            </motion.div>
          ) : (
            /* HOME & CATEGORIES DYNAMIC GRID LAYOUT WITH SIDEBAR */
            <motion.div
              key="homepage-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              id="homepage-main-grid"
            >
              
              {/* Primary Content Left/Center Column */}
              <div className="lg:col-span-2 space-y-8" id="primary-content-column">
                
                {/* Search / Filter Sub-header banner status */}
                {searchQuery && (
                  <div className="bg-white border-2 border-black p-4 rounded-none flex items-center justify-between" id="search-status-box">
                    <div className="flex items-center gap-2 text-sm text-neutral-800 font-bold">
                      <Search className="w-4.5 h-4.5 text-black animate-pulse" />
                      <span>{lang === 'ar' ? 'نتائج البحث عن:' : 'Search results for:'}</span>
                      <span className="text-black bg-neutral-100 px-2.5 py-0.5 rounded-none border border-black font-mono font-black">"{searchQuery}"</span>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-black text-black hover:line-through cursor-pointer"
                    >
                      {lang === 'ar' ? 'إلغاء البحث' : 'Clear search'}
                    </button>
                  </div>
                )}

                {/* Categories Badge Pill Triggers */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="categories-filter-pills">
                  {categoriesList.map((cat) => {
                    const isSelected = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setActiveArticleId(null);
                        }}
                        className={`text-xs font-black px-4 py-2.5 rounded-none border-2 transition-all whitespace-nowrap cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-xs italic'
                            : 'bg-white text-neutral-600 border-black hover:bg-neutral-50 hover:text-black'
                        }`}
                      >
                        {getCategoryLabel(cat, lang)}
                      </button>
                    );
                  })}
                </div>

                {/* Daily Anime Brief curating the top 5 trending stories of the day from Firestore */}
                {!searchQuery && activeCategory === 'الكل' && (
                  <DailyAnimeBrief 
                    lang={lang} 
                    onSelectArticle={handleSelectArticle} 
                    articlesCount={articles.length} 
                  />
                )}

                {/* Render Large HERO Featured Article if no active filters/searches */}
                {!searchQuery && activeCategory === 'الكل' && featuredArticle && (
                  <FeaturedArticle article={featuredArticle} onSelect={handleSelectArticle} lang={lang} />
                )}

                {/* Latest News Grid Header */}
                <div className="border-b-2 border-black pb-3 flex items-center justify-between" id="latest-news-section-title">
                  <h2 className="font-sans font-black text-xl text-black flex items-center gap-2">
                    <Sparkles className="w-5.5 h-5.5 text-black" />
                    <span>
                      {activeCategory === 'الكل'
                        ? (lang === 'ar' ? 'آخر الأخبار والتقارير' : 'Latest Stories & Reports')
                        : (lang === 'ar' ? `أخبار قسم ${getCategoryLabel(activeCategory, lang)}` : `${getCategoryLabel(activeCategory, lang)} Division`)}
                    </span>
                  </h2>
                  <span className="text-xs font-mono text-neutral-500 font-bold">
                    ({filteredArticles.length} {lang === 'ar' ? 'خبر متاح' : 'stories available'})
                  </span>
                </div>

                {/* News Grid */}
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="articles-grid-view">
                    {filteredArticles.map((article) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        onSelect={handleSelectArticle}
                        lang={lang}
                        isBookmarked={savedBookmarkIds.includes(article.id)}
                        onToggleBookmark={() => handleToggleBookmark(article.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border-2 border-black rounded-none p-12 text-center" id="empty-search-state">
                    <p className="text-black text-sm sm:text-base font-black mb-2">
                      {lang === 'ar'
                        ? 'عذراً، لم نجد أي أخبار تطابق خيارات التصفية الحالية.'
                        : 'No stories found matching the current filters.'}
                    </p>
                    <p className="text-neutral-500 text-xs font-serif">
                      {lang === 'ar'
                        ? 'حاول كتابة مصطلح آخر أو التحويل لقسم آخر.'
                        : 'Try searching for something else or switching categories.'}
                    </p>
                  </div>
                )}

                {/* Additional rich home sections to make page extremely long & highly detailed */}
                {!searchQuery && activeCategory === 'الكل' && currentTab === 'home' && (
                  <div className="space-y-10 pt-6" id="rich-homepage-extensions">
                    {/* 1. Hot Manga Spoilers & Leaks Hub */}
                    <MangaLeaksHub lang={lang} />

                    {/* 2. Versus Arena Power Scaling Comparison Duel */}
                    <VersusArena lang={lang} />

                    {/* 3. Anime Seasons annual Forecast Agenda */}
                    <AnimeSeasonTimeline lang={lang} />

                    {/* 4. Seasonal Characters Popularity Spotlight */}
                    <CharacterSpotlight lang={lang} />
                  </div>
                )}

              </div>

              {/* Sidebar Right Column */}
              <div className="lg:col-span-1" id="sidebar-column">
                <Sidebar
                  trendingArticles={trendingArticles}
                  categories={sidebarCategoryCounts}
                  activeCategory={activeCategory}
                  setActiveCategory={(cat) => {
                    setActiveCategory(cat);
                    setCurrentTab('home');
                    setActiveArticleId(null);
                  }}
                  onSelectArticle={handleSelectArticle}
                  lang={lang}
                />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Elegant Footer */}
      <footer className="bg-white text-black mt-24 border-t-4 border-black" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12" id="footer-grid">
            
            {/* Column 1: Info */}
            <div className="space-y-4 md:col-span-2">
              <div
                className="bg-black text-white px-4 py-1.5 font-sans font-black text-xl tracking-tighter uppercase rounded-none border-2 border-black w-max cursor-pointer italic"
                onClick={() => {
                  setCurrentTab('home');
                  setActiveArticleId(null);
                }}
              >
                {t.siteName}
              </div>
              <p className="text-neutral-600 text-xs leading-relaxed max-w-sm font-serif">
                {lang === 'ar'
                  ? 'المنبر الإعلامي الأول لجميع عشاق ومتابعي الأنمي والمانجا في العالم العربي. سرعة مطلقة، ومصداقية تامة في صياغة الأخبار والتسريبات.'
                  : 'The primary digital news platform for anime and manga enthusiasts worldwide. Extreme publishing speeds, fully verified leaks, and complete credibility.'}
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3 pt-2">
                <a href="https://twitter.com/justanime" target="_blank" rel="noreferrer" className="bg-white p-2.5 rounded-none hover:bg-neutral-50 transition-all text-black border-2 border-black shadow-xs">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://instagram.com/justanime" target="_blank" rel="noreferrer" className="bg-white p-2.5 rounded-none hover:bg-neutral-50 transition-all text-black border-2 border-black shadow-xs">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className={`font-sans font-black text-sm text-black uppercase tracking-wider mb-4 ${
                lang === 'ar' ? 'border-r-2 pr-2' : 'border-l-2 pl-2'
              } border-black`}>
                {lang === 'ar' ? 'أقسام الموقع' : 'Portal Divisions'}
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600 font-sans font-bold">
                <li>
                  <button onClick={() => { setCurrentTab('home'); setActiveCategory('أخبار'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors cursor-pointer">{getCategoryLabel('أخبار', lang)}</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('home'); setActiveCategory('مانجا'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors cursor-pointer">{getCategoryLabel('مانجا', lang)}</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('home'); setActiveCategory('مراجعات'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors cursor-pointer">{getCategoryLabel('مراجعات', lang)}</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('home'); setActiveCategory('فعاليات'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors cursor-pointer">{getCategoryLabel('فعاليات', lang)}</button>
                </li>
              </ul>
            </div>

            {/* Column 3: Corporate */}
            <div>
              <h4 className={`font-sans font-black text-sm text-black uppercase tracking-wider mb-4 ${
                lang === 'ar' ? 'border-r-2 pr-2' : 'border-l-2 pl-2'
              } border-black`}>
                {t.siteName}
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600 font-sans font-bold">
                <li>
                  <button onClick={() => { setCurrentTab('about'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors cursor-pointer">{t.about}</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('contact'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors cursor-pointer">{t.contact}</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('privacy'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors cursor-pointer">{t.privacy}</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentTab('publishing'); setActiveArticleId(null); }} className="hover:line-through hover:text-black transition-colors flex items-center gap-1 cursor-pointer">
                    <span>{t.publishing}</span>
                    <span className="bg-black text-[9px] text-white font-mono px-1 border border-black uppercase italic">FAST</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Area */}
          <div className="border-t border-neutral-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono" id="footer-bottom">
            <div>
              {lang === 'ar'
                ? `© ${new Date().getFullYear()} JUST ANIME Media Network. جميع الحقوق محفوظة لشبكة قنوات جاست أنمي.`
                : `© ${new Date().getFullYear()} JUST ANIME Media Network. All rights reserved.`}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-600 font-black uppercase">
              <span>{lang === 'ar' ? 'صنع بكل' : 'Crafted with'}</span>
              <Heart className="w-3.5 h-3.5 text-black animate-pulse fill-black" />
              <span>{lang === 'ar' ? 'لعشاق الأنمي في العالم العربي' : 'for anime enthusiasts worldwide'}</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className={`fixed bottom-6 ${
            lang === 'ar' ? 'left-6' : 'right-6'
          } z-50 bg-white hover:bg-neutral-50 text-black p-3 rounded-none border-2 border-black hover:-translate-y-0.5 transition-all shadow-xs animate-in fade-in zoom-in duration-300 cursor-pointer`}
          title={lang === 'ar' ? 'العودة لأعلى الصفحة' : 'Scroll to top'}
          id="scroll-to-top-btn"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Bookmarks sliding panel drawer */}
      <BookmarksPanel
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        savedIds={savedBookmarkIds}
        allArticles={articles}
        onSelectArticle={(id) => {
          handleSelectArticle(id);
          setCurrentTab('home');
        }}
        onRemoveBookmark={handleToggleBookmark}
        lang={lang}
      />

      {/* Secure AuthModal Overlay */}
      <AnimatePresence>
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            lang={lang}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </AnimatePresence>

      {/* Dynamic SEO metadata manager & JSON-LD schema builder */}
      <SEOHead article={activeArticle} lang={lang} />

      {/* AdBlock Notice detector */}
      <AdBlockNotice lang={lang} />

    </div>
  );
}
