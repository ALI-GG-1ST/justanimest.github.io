/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, ChangeEvent } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  PlusCircle, 
  Compass, 
  Info, 
  Mail, 
  ShieldAlert, 
  Bookmark,
  LogIn,
  LogOut,
  User,
  ShieldAlert as ShieldIcon,
  Sparkles
} from 'lucide-react';
import { translations } from '../translations';
import { LoggedInUser } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  currentUser: LoggedInUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  lang,
  setLang,
  onOpenBookmarks,
  bookmarksCount,
  currentUser,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];
  const isAr = lang === 'ar';

  // Check if current user is admin or editor
  const isAdminOrEditor = currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor');

  const menuItems = [
    { id: 'home', label: t.home, icon: Compass },
    { id: 'categories', label: t.categories, icon: Compass },
    ...(isAdminOrEditor ? [{ id: 'publishing', label: t.publishing, icon: PlusCircle, highlight: true }] : []),
    { id: 'about', label: t.about, icon: Info },
    { id: 'contact', label: t.contact, icon: Mail },
    { id: 'privacy', label: t.privacy, icon: ShieldAlert },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentTab !== 'search' && currentTab !== 'home') {
      setCurrentTab('home');
    }
  };

  // Helper to get nice readable badge for role
  const getRoleBadge = (user: LoggedInUser) => {
    if (user.email.toLowerCase() === 'alawyabbas15@gmail.com') {
      return {
        label: isAr ? 'مؤسس الموقع ✨' : 'Site Founder ✨',
        classes: 'bg-red-500 text-white border-red-600 font-black'
      };
    }
    if (user.role === 'admin') {
      return {
        label: isAr ? 'المدير المسؤول' : 'Admin',
        classes: 'bg-black text-white border-black font-black'
      };
    }
    if (user.role === 'editor') {
      return {
        label: isAr ? 'محرر ومراجع' : 'Editor',
        classes: 'bg-amber-400 text-black border-black font-black'
      };
    }
    return {
      label: isAr ? 'عضو عادي' : 'Otaku Member',
      classes: 'bg-neutral-100 text-neutral-800 border-neutral-300'
    };
  };

  return (
    <div className="w-full flex flex-col" id="header-root-wrapper">
      {/* Top Banner Ad Space */}
      <div className="h-12 bg-neutral-100 flex items-center justify-center border-b border-black text-[10px] tracking-widest text-neutral-400 uppercase font-mono px-4 text-center">
        {t.topBannerAd}
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-black text-black" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo Section */}
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleNavClick('home')} id="logo-container">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic text-black">
                {t.siteName}
              </h1>
              <span className="hidden sm:inline-block w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6" id="desktop-nav">
              {menuItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-sm font-bold uppercase tracking-wide transition-all ${
                      item.highlight
                        ? 'bg-black text-white hover:bg-neutral-800 px-4 py-1 text-xs font-bold uppercase border border-black shadow-[2px_2px_0px_rgba(239,68,68,1)]'
                        : isActive
                        ? 'underline decoration-2 underline-offset-4 text-black font-black'
                        : 'text-neutral-600 hover:line-through hover:text-black'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Search, Auth & Language Toggle */}
            <div className="hidden lg:flex items-center gap-3" id="desktop-search-lang-container">
              {/* Search Bar */}
              <div className="relative w-40 xl:w-52" id="desktop-search">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full bg-neutral-50 text-sm text-black placeholder-neutral-400 py-1.5 rounded-none border border-black focus:outline-none focus:bg-white transition-all duration-200 ${
                    lang === 'ar' ? 'pl-4 pr-10' : 'pr-4 pl-10'
                  }`}
                  id="search-input-desktop"
                />
                <Search className={`absolute top-2.5 w-4 h-4 text-black ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
              </div>

              {/* Bookmarks Button */}
              <button
                onClick={onOpenBookmarks}
                className="flex items-center gap-1 bg-white text-black hover:bg-neutral-50 px-2.5 py-1.5 text-xs font-black uppercase border-2 border-black rounded-none cursor-pointer font-sans shrink-0"
                id="desktop-bookmarks-btn"
              >
                <Bookmark className="w-3.5 h-3.5 text-black fill-black shrink-0" />
                <span className="hidden xl:inline">{isAr ? 'المحفوظات' : 'Saved'}</span>
                <span className="bg-black text-white text-[10px] px-1.5 py-0.5 border border-black font-mono">
                  {bookmarksCount}
                </span>
              </button>

              {/* Secure Auth Module Trigger / Status */}
              {currentUser ? (
                <div className="flex items-center gap-2 border-2 border-black p-1 bg-neutral-50 shrink-0 font-sans" id="desktop-user-profile-widget">
                  {currentUser.avatarUrl ? (
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-8 h-8 border border-black rounded-none shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-amber-400 text-black border border-black rounded-none flex items-center justify-center font-black text-xs shrink-0">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col text-right leading-none px-1">
                    <span className="text-[11px] font-black text-black line-clamp-1 max-w-[90px]">{currentUser.name}</span>
                    <span className={`text-[8px] px-1 py-0.5 border border-black rounded-none mt-0.5 inline-block text-center ${getRoleBadge(currentUser).classes}`}>
                      {getRoleBadge(currentUser).label}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-black rounded-none cursor-pointer transition-colors"
                    title={isAr ? 'تسجيل الخروج الآمن' : 'Secure Log Out'}
                    id="desktop-logout-trigger"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="bg-amber-400 hover:bg-amber-500 text-black px-3.5 py-1.5 text-xs font-black uppercase border-2 border-black rounded-none flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] cursor-pointer shrink-0 font-sans"
                  id="desktop-login-trigger"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                </button>
              )}

              {/* Language Toggle Button */}
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="bg-black text-white px-2.5 py-1.5 text-xs font-black uppercase border border-black hover:bg-neutral-850 transition-all rounded-none italic cursor-pointer shrink-0"
                id="desktop-lang-toggle"
              >
                {lang === 'ar' ? 'EN' : 'عربي'}
              </button>
            </div>

            {/* Mobile Actions: Search, Lang, Auth, Burger */}
            <div className="flex items-center gap-1.5 lg:hidden" id="mobile-actions">
              {/* Mobile Bookmarks Button */}
              <button
                onClick={onOpenBookmarks}
                className="p-2 text-black hover:bg-neutral-100 rounded-none border border-transparent hover:border-black flex items-center relative shrink-0"
                aria-label="Bookmarks"
                id="mobile-bookmarks-btn"
              >
                <Bookmark className="w-4.5 h-4.5 text-black fill-black" />
                {bookmarksCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-mono font-black w-4.5 h-4.5 rounded-none flex items-center justify-center border border-black animate-pulse">
                    {bookmarksCount}
                  </span>
                )}
              </button>

              {/* Mobile Language Toggle */}
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase border border-black hover:bg-neutral-800 transition-all rounded-none italic cursor-pointer shrink-0"
                id="mobile-lang-toggle"
              >
                {lang === 'ar' ? 'EN' : 'AR'}
              </button>

              {/* Mobile Auth Button */}
              {currentUser ? (
                <button
                  onClick={onLogout}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-black rounded-none shrink-0"
                  title={isAr ? 'خروج' : 'Log Out'}
                  id="mobile-logout-trigger"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="bg-amber-400 text-black p-1.5 border border-black rounded-none shrink-0"
                  title={isAr ? 'دخول' : 'Log In'}
                  id="mobile-login-trigger"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => {
                  setCurrentTab('home');
                  const mobSearchInput = document.getElementById('search-input-mobile');
                  if (mobSearchInput) mobSearchInput.focus();
                }}
                className="p-2 text-black hover:bg-neutral-100 rounded-none border border-transparent hover:border-black shrink-0"
                aria-label="Search"
                id="mobile-search-toggle"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-black hover:bg-neutral-100 rounded-none border border-transparent hover:border-black shrink-0"
                aria-label="Menu"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-black animate-in fade-in slide-in-from-top-4 duration-200" id="mobile-menu-drawer">
            <div className="px-4 pt-4 pb-6 space-y-3">
              {/* Mobile Search input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  id="search-input-mobile"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full bg-neutral-50 text-sm text-black placeholder-neutral-400 py-2 rounded-none border border-black focus:outline-none focus:bg-white transition-all duration-200 ${
                    lang === 'ar' ? 'pl-4 pr-10' : 'pr-4 pl-10'
                  }`}
                />
                <Search className={`absolute top-3.5 w-4 h-4 text-black ${lang === 'ar' ? 'right-3' : 'left-3'}`} />
              </div>

              {/* User profile details in mobile drawer if logged in */}
              {currentUser && (
                <div className="border-2 border-black p-3 bg-neutral-50 flex items-center justify-between font-sans mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-400 text-black border border-black rounded-none flex items-center justify-center font-black">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <div className="font-black text-black">{currentUser.name}</div>
                      <div className="text-[10px] text-neutral-500 font-mono">{currentUser.email}</div>
                    </div>
                  </div>
                  <span className={`text-[8px] px-1.5 py-0.5 border border-black ${getRoleBadge(currentUser).classes}`}>
                    {getRoleBadge(currentUser).label}
                  </span>
                </div>
              )}

              {/* Menu Items */}
              {menuItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} px-4 py-3 text-sm font-bold uppercase transition-all flex items-center justify-between border-b border-neutral-100 ${
                      item.highlight
                        ? 'bg-black text-white hover:bg-neutral-850 px-4 py-2 border border-black'
                        : isActive
                        ? 'text-black font-black underline decoration-2'
                        : 'text-neutral-600 hover:line-through hover:text-black'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
