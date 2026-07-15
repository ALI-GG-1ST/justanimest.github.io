/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  MessageSquare,
  Users,
  Settings,
  TrendingUp,
  Shield,
  ExternalLink,
  BarChart3,
  Flame,
  CalendarRange,
} from 'lucide-react';

import { Article } from '../types';
import DashboardOverview from './dashboard/DashboardOverview';
import ArticleManager from './dashboard/ArticleManager';
import AnimeManager from './dashboard/AnimeManager';
import CommentManager from './dashboard/CommentManager';
import UserManager from './dashboard/UserManager';
import SettingsManager from './dashboard/SettingsManager';
import ReportsManager from './dashboard/ReportsManager';
import PollManager from './dashboard/PollManager';
import TickerManager from './dashboard/TickerManager';
import ScheduleManager from './dashboard/ScheduleManager';

interface PublishingDashboardProps {
  onPublish: (newArticle: Article) => void;
  categoriesList: string[];
  lang: 'ar' | 'en';
  articles: Article[];
  onUpdateArticle: (updatedArticle: Article) => void;
  onDeleteArticle: (id: string) => void;
}

type AdminSubTab = 'overview' | 'articles' | 'anime' | 'comments' | 'users' | 'poll' | 'ticker' | 'schedule' | 'settings' | 'reports';

export default function PublishingDashboard({
  onPublish,
  categoriesList,
  lang,
  articles,
  onUpdateArticle,
  onDeleteArticle,
}: PublishingDashboardProps) {
  const isAr = lang === 'ar';
  const [activeAdminTab, setActiveAdminTab] = useState<AdminSubTab>('overview');

  // Multi-lingual tab labels and headers
  const menuItems = [
    { id: 'overview', labelAr: 'لوحة التحكم الرئيسي', labelEn: 'Overview', icon: LayoutDashboard },
    { id: 'articles', labelAr: 'إدارة المقالات والمحتوى', labelEn: 'Articles & Content', icon: FileText },
    { id: 'anime', labelAr: 'قاموس أعمال الأنمي', labelEn: 'Anime Encyclopedia', icon: BookOpen },
    { id: 'comments', labelAr: 'رقابة وتعديل التعليقات', labelEn: 'Comments Moderator', icon: MessageSquare },
    { id: 'users', labelAr: 'أدوار المستخدمين والصلاحيات', labelEn: 'Users & Permissions', icon: Users },
    { id: 'poll', labelAr: 'إدارة الاستطلاع اليومي', labelEn: 'Daily Poll Manager', icon: BarChart3 },
    { id: 'ticker', labelAr: 'شريط الأخبار العاجلة', labelEn: 'Breaking Ticker Manager', icon: Flame },
    { id: 'schedule', labelAr: 'جدول مواعيد البث', labelEn: 'Broadcast Schedule', icon: CalendarRange },
    { id: 'settings', labelAr: 'إعدادات وتخصيص الموقع', labelEn: 'Branding & Settings', icon: Settings },
    { id: 'reports', labelAr: 'التقارير والإحصائيات العامة', labelEn: 'Traffic & Reports', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6" id="publishing-admin-dashboard-root">
      
      {/* Upper Brand/Welcome Section */}
      <div 
        className="bg-black text-white p-6 rounded-none border-4 border-black shadow-[4px_4px_0px_rgba(245,158,11,1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        id="admin-brand-header"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-400 border-2 border-white rounded-none shrink-0">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-[10px] bg-amber-400 text-black font-black uppercase px-2 py-0.5 rounded-none font-mono">
              {isAr ? 'لوحة الإشراف المتكاملة v2.5' : 'SECURE CENTRAL WORKSPACE v2.5'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-sans mt-1.5 tracking-tight">
              {isAr ? 'غرفة عمليات إدارة شبكة أنمي اليوم' : 'Anime Network Operation Control Center'}
            </h2>
          </div>
        </div>

        {/* Live link to client page */}
        <a
          href="#main-content-layout"
          onClick={(e) => {
            e.preventDefault();
            // Scroll to any section or simulate preview
            window.scrollTo({ top: 400, behavior: 'smooth' });
          }}
          className="bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white font-mono text-[10px] font-black uppercase px-4 py-2.5 rounded-none shrink-0 flex items-center gap-1.5 transition-all active:translate-y-[1px]"
        >
          <span>{isAr ? 'معاينة الواجهة العامة' : 'Launch Live Blog Feed'}</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
        </a>
      </div>

      {/* Main Grid: Responsive Tab controls + Active Tab panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="admin-workspace-grid">
        
        {/* SIDEBAR NAVIGATION LIST (1 col) */}
        <div className="lg:col-span-1 space-y-2" id="admin-sidebar-nav">
          <div className="bg-white border-2 border-black rounded-none p-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
            <span className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-3 px-2 font-mono">
              {isAr ? 'قائمة غرف التحكم المباشرة' : 'OPERATIONAL SEGMENTS'}
            </span>
            
            <nav className="space-y-1.5 flex flex-col" id="admin-nav-links">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAdminTab(item.id as AdminSubTab)}
                    className={`w-full text-right p-3 rounded-none font-sans text-xs font-black uppercase border-2 flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-black text-white border-black shadow-[3px_3px_0px_rgba(245,158,11,1)]'
                        : 'bg-white text-black border-transparent hover:border-black hover:bg-neutral-50'
                    } ${isAr ? 'flex-row' : 'flex-row-reverse text-left'}`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" />
                    <span className="truncate">{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* MAIN PANEL CONTENT WINDOW (3 cols) */}
        <div className="lg:col-span-3 min-w-0" id="admin-main-window">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAdminTab}
              initial={{ opacity: 0, x: isAr ? 15 : -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAr ? -15 : 15 }}
              transition={{ duration: 0.2 }}
            >
              {activeAdminTab === 'overview' && (
                <DashboardOverview lang={lang} articlesCount={articles.length} />
              )}

              {activeAdminTab === 'articles' && (
                <ArticleManager
                  lang={lang}
                  articles={articles}
                  onPublish={onPublish}
                  onUpdateArticle={onUpdateArticle}
                  onDeleteArticle={onDeleteArticle}
                  categoriesList={categoriesList}
                />
              )}

              {activeAdminTab === 'anime' && (
                <AnimeManager lang={lang} />
              )}

              {activeAdminTab === 'comments' && (
                <CommentManager lang={lang} />
              )}

              {activeAdminTab === 'users' && (
                <UserManager lang={lang} />
              )}

              {activeAdminTab === 'poll' && (
                <PollManager lang={lang} />
              )}

              {activeAdminTab === 'ticker' && (
                <TickerManager lang={lang} />
              )}

              {activeAdminTab === 'schedule' && (
                <ScheduleManager lang={lang} />
              )}

              {activeAdminTab === 'settings' && (
                <SettingsManager lang={lang} />
              )}

              {activeAdminTab === 'reports' && (
                <ReportsManager lang={lang} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
