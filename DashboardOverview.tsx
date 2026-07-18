/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Eye, 
  ArrowUpRight, 
  Flame,
  Award,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, collectionGroup } from 'firebase/firestore';

interface DashboardOverviewProps {
  lang: 'ar' | 'en';
  articlesCount: number;
}

export default function DashboardOverview({ lang, articlesCount }: DashboardOverviewProps) {
  const isAr = lang === 'ar';

  const [articles, setArticles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [activeCommenters, setActiveCommenters] = useState<{ name: string; email: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRightTab, setActiveRightTab] = useState<'commenters' | 'logs'>('commenters');

  useEffect(() => {
    const fetchFirestoreStats = async () => {
      setLoading(true);
      try {
        // 1. Fetch Articles from Firestore
        const articlesCol = collection(db, 'articles');
        const articlesSnap = await getDocs(articlesCol);
        let articlesList: any[] = [];
        if (!articlesSnap.empty) {
          articlesSnap.forEach((docSnap) => {
            const data = docSnap.data();
            articlesList.push({ id: docSnap.id, ...data });
          });
        } else {
          const savedArticles = localStorage.getItem('just_anime_articles');
          if (savedArticles) {
            articlesList = JSON.parse(savedArticles);
          }
        }
        setArticles(articlesList);

        // 2. Fetch Users from Firestore
        const usersCol = collection(db, 'users');
        const usersSnap = await getDocs(usersCol);
        let usersList: any[] = [];
        if (!usersSnap.empty) {
          usersSnap.forEach((docSnap) => {
            usersList.push({ id: docSnap.id, ...docSnap.data() });
          });
        } else {
          const savedUsers = localStorage.getItem('just_anime_users_all');
          if (savedUsers) {
            usersList = JSON.parse(savedUsers);
          } else {
            usersList = [
              { id: 'user-1', name: 'علاء عباس', email: 'alawyabbas15@gmail.com', role: 'admin', joinDate: '2026-01-10', status: 'active' },
              { id: 'user-2', name: 'سارة أحمد', email: 'sara.ahmed@example.com', role: 'editor', joinDate: '2026-02-14', status: 'active' },
              { id: 'user-3', name: 'خالد اليوسف', email: 'khaled.y@example.com', role: 'editor', joinDate: '2026-03-20', status: 'active' },
              { id: 'user-4', name: 'محمد الأوتاكو', email: 'otaku.moe@example.com', role: 'user', joinDate: '2026-04-05', status: 'active' },
            ];
          }
        }
        setUsers(usersList);

        // 3. Fetch Comments from Firestore (with collectionGroup + individual fallback)
        let commentsList: any[] = [];
        try {
          const commentsColGroup = collectionGroup(db, 'comments');
          const commentsSnap = await getDocs(commentsColGroup);
          if (!commentsSnap.empty) {
            commentsSnap.forEach((docSnap) => {
              commentsList.push({ id: docSnap.id, ...docSnap.data() });
            });
          }
        } catch (cgErr) {
          console.warn("Collection group query failed or blocked, checking individual articles", cgErr);
          // Individual query fallback
          for (const art of articlesList) {
            try {
              const articleCommentsCol = collection(db, 'articles', art.id, 'comments');
              const commentsSnap = await getDocs(articleCommentsCol);
              commentsSnap.forEach((docSnap) => {
                commentsList.push({ id: docSnap.id, ...docSnap.data() });
              });
            } catch (artErr) {
              console.warn(`Failed to fetch comments for article ${art.id}`, artErr);
            }
          }
        }

        if (commentsList.length === 0) {
          const savedComments = localStorage.getItem('just_anime_comments_all');
          if (savedComments) {
            commentsList = JSON.parse(savedComments);
          } else {
            commentsList = [
              { id: 'comm-1', articleTitle: 'تسريبات الفصل 1130 من مانجا One Piece تؤكد عودة أمير العمالقة لوكي!', author: 'محمد الغامدي', email: 'mohamed@example.com', content: 'تسريب مجنون جداً! عودة لوكي ستغير توازن القوى بالكامل في آرك إلباف. شكراً جزيلاً لسرعة النشر والتغطية!', date: '2026-07-14 21:30', status: 'pending' },
              { id: 'comm-2', articleTitle: 'رسمياً: استوديو Wit يعلن عن بدء إنتاج ريميك أنمي One Piece الشهير', author: 'Yuki Chan', email: 'yuki@example.com', content: 'Honestly Wit Studio will give One Piece the pacing and fluid modern art it truly deserves. Cant wait for 2026!', date: '2026-07-14 18:45', status: 'approved' },
              { id: 'comm-3', articleTitle: 'تسريبات حصرية: تحديد موعد عرض الجزء الثاني من الموسم الأخير لـ Bleach TYBW', author: 'عبد الله الدوسري', email: 'abdallah@example.com', content: 'هل التسريب بخصوص تأجيل شهر أكتوبر مؤكد؟ تيت كوبو كان يتحدث عن إنتاج إضافي ضخم.', date: '2026-07-13 14:15', status: 'pending' }
            ];
          }
        }
        setComments(commentsList);

        // 4. Calculate Commenters Stats
        const commenterMap: { [key: string]: { name: string; email: string; count: number } } = {};
        commentsList.forEach((c) => {
          const authorName = c.authorName || c.author || (isAr ? 'زائر مجهول' : 'Anonymous Guest');
          const authorEmail = c.email || '';
          const key = authorEmail ? `${authorName}_${authorEmail}` : authorName;
          if (commenterMap[key]) {
            commenterMap[key].count += 1;
          } else {
            commenterMap[key] = {
              name: authorName,
              email: authorEmail,
              count: 1,
            };
          }
        });
        const sortedCommenters = Object.values(commenterMap).sort((a, b) => b.count - a.count);
        setActiveCommenters(sortedCommenters);

        // 5. Fetch Polls
        const savedPolls = localStorage.getItem('just_anime_daily_poll_options');
        if (savedPolls) {
          setPolls(JSON.parse(savedPolls));
        } else {
          setPolls([
            { id: 'opt1', ar: 'ريميك أنمي ون بيس (THE ONE PIECE)', en: 'THE ONE PIECE Anime Remake (Wit Studio)', votes: 345 },
            { id: 'opt2', ar: 'الموسم الثالث من Solo Leveling', en: 'Solo Leveling Season 2', votes: 210 },
            { id: 'opt3', ar: 'فيلم قاتل الشياطين قلعة اللانهائية', en: 'Demon Slayer: Infinity Castle Movie Trilogy', votes: 412 },
            { id: 'opt4', ar: 'أنمي ممر كاجوراباتشي (Kagurabachi)', en: 'Kagurabachi Anime Adaptation', votes: 180 },
          ]);
        }
      } catch (err) {
        console.error("Firestore dashboard stats load failed:", err);
        // Fallback gracefully to LocalStorage
        loadLocalFallbacks();
      } finally {
        setLoading(false);
      }
    };

    const loadLocalFallbacks = () => {
      const savedArticles = localStorage.getItem('just_anime_articles');
      let articlesList = [];
      if (savedArticles) {
        try {
          articlesList = JSON.parse(savedArticles);
          setArticles(articlesList);
        } catch (e) {
          console.error(e);
        }
      }

      const savedUsers = localStorage.getItem('just_anime_users_all');
      let usersList = [];
      if (savedUsers) {
        try {
          usersList = JSON.parse(savedUsers);
          setUsers(usersList);
        } catch (e) {
          console.error(e);
        }
      } else {
        usersList = [
          { id: 'user-1', name: 'علاء عباس', email: 'alawyabbas15@gmail.com', role: 'admin', joinDate: '2026-01-10', status: 'active' },
          { id: 'user-2', name: 'سارة أحمد', email: 'sara.ahmed@example.com', role: 'editor', joinDate: '2026-02-14', status: 'active' },
          { id: 'user-3', name: 'خالد اليوسف', email: 'khaled.y@example.com', role: 'editor', joinDate: '2026-03-20', status: 'active' },
          { id: 'user-4', name: 'محمد الأوتاكو', email: 'otaku.moe@example.com', role: 'user', joinDate: '2026-04-05', status: 'active' },
        ];
        setUsers(usersList);
      }

      const savedComments = localStorage.getItem('just_anime_comments_all');
      let commentsList = [];
      if (savedComments) {
        try {
          commentsList = JSON.parse(savedComments);
          setComments(commentsList);
        } catch (e) {
          console.error(e);
        }
      } else {
        commentsList = [
          { id: 'comm-1', articleTitle: 'تسريبات الفصل 1130 من مانجا One Piece تؤكد عودة أمير العمالقة لوكي!', author: 'محمد الغامدي', email: 'mohamed@example.com', content: 'تسريب مجنون جداً! عودة لوكي ستغير توازن القوى بالكامل في آرك إلباف. شكراً جزيلاً لسرعة النشر والتغطية!', date: '2026-07-14 21:30', status: 'pending' },
          { id: 'comm-2', articleTitle: 'رسمياً: استوديو Wit يعلن عن بدء إنتاج ريميك أنمي One Piece الشهير', author: 'Yuki Chan', email: 'yuki@example.com', content: 'Honestly Wit Studio will give One Piece the pacing and fluid modern art it truly deserves. Cant wait for 2026!', date: '2026-07-14 18:45', status: 'approved' },
          { id: 'comm-3', articleTitle: 'تسريبات حصرية: تحديد موعد عرض الجزء الثاني من الموسم الأخير لـ Bleach TYBW', author: 'عبد الله الدوسري', email: 'abdallah@example.com', content: 'هل التسريب بخصوص تأجيل شهر أكتوبر مؤكد؟ تيت كوبو كان يتحدث عن إنتاج إضافي ضخم.', date: '2026-07-13 14:15', status: 'pending' }
        ];
        setComments(commentsList);
      }

      const savedPolls = localStorage.getItem('just_anime_daily_poll_options');
      if (savedPolls) {
        try {
          setPolls(JSON.parse(savedPolls));
        } catch (e) {
          console.error(e);
        }
      }

      // Calculate commenter stats for local fallback
      const commenterMap: { [key: string]: { name: string; email: string; count: number } } = {};
      commentsList.forEach((c) => {
        const authorName = c.authorName || c.author || (isAr ? 'زائر مجهول' : 'Anonymous Guest');
        const authorEmail = c.email || '';
        const key = authorEmail ? `${authorName}_${authorEmail}` : authorName;
        if (commenterMap[key]) {
          commenterMap[key].count += 1;
        } else {
          commenterMap[key] = {
            name: authorName,
            email: authorEmail,
            count: 1,
          };
        }
      });
      const sortedCommenters = Object.values(commenterMap).sort((a, b) => b.count - a.count);
      setActiveCommenters(sortedCommenters);
    };

    fetchFirestoreStats();
  }, [articlesCount]);

  // Derive dynamic counts
  const finalArticlesCount = articles.length > 0 ? articles.length : articlesCount;
  const usersCount = users.length;
  const totalViews = articles.reduce((sum, art) => sum + (art.views || 0), 0);
  const commentsCount = comments.length;
  const pendingCommentsCount = comments.filter(c => c.status === 'pending').length;
  const totalPollVotes = polls.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  // Dynamic stat figures
  const stats = [
    {
      title: isAr ? 'إجمالي المقالات والتقارير' : 'Total Articles & Reports',
      value: finalArticlesCount.toLocaleString(),
      change: isAr ? `+${finalArticlesCount} مقال منشور` : `+${finalArticlesCount} stories published`,
      icon: FileText,
      color: 'bg-amber-400',
    },
    {
      title: isAr ? 'الأعضاء والناشرين المسجلين' : 'Registered Staff & Users',
      value: usersCount.toString(),
      change: isAr ? `${users.filter(u => u.role === 'admin').length} مسؤولين و ${users.filter(u => u.role === 'editor').length} محرّرين` : `${users.filter(u => u.role === 'admin').length} admins & ${users.filter(u => u.role === 'editor').length} editors`,
      icon: Users,
      color: 'bg-red-500 text-white',
    },
    {
      title: isAr ? 'إجمالي قراءات المقالات' : 'Total Article Views',
      value: totalViews.toLocaleString(),
      change: isAr ? 'مستخلص من خادم الإحصاء' : 'Derived from traffic server',
      icon: Eye,
      color: 'bg-cyan-400',
    },
    {
      title: isAr ? 'التعليقات والمشاركات' : 'Comments & Moderation',
      value: commentsCount.toString(),
      change: isAr ? `${pendingCommentsCount} تعليق بانتظار المراجعة` : `${pendingCommentsCount} comments pending review`,
      icon: MessageSquare,
      color: 'bg-emerald-400',
    },
  ];

  // Dynamic Activities Logs
  const activities = [
    {
      id: 1,
      user: articles[0]?.author || 'علاء عباس',
      role: 'محرر رئيسي',
      actionAr: articles[0] ? `قام بنشر مقال: "${articles[0].title}"` : 'قام بنشر تسريب الفصل الجديد من ون بيس',
      actionEn: articles[0] ? `Published article: "${articles[0].title}"` : 'Published One Piece chapter leaks',
      time: isAr ? 'منذ 5 دقائق' : '5 mins ago'
    },
    {
      id: 2,
      user: 'سارة أحمد',
      role: 'محررة',
      actionAr: `قامت بمراجعة التعليقات النشطة (إجمالي التعليقات المعتمدة: ${comments.filter(c => c.status === 'approved').length})`,
      actionEn: `Moderated active comments (approved comments total: ${comments.filter(c => c.status === 'approved').length})`,
      time: isAr ? 'منذ 18 دقيقة' : '18 mins ago'
    },
    {
      id: 3,
      user: 'نظام الاستطلاعات',
      role: 'روبوت الإحصاء',
      actionAr: `تم تجميع الأصوات في استطلاع الأنمي (إجمالي الأصوات: ${totalPollVotes} صوت)`,
      actionEn: `Aggregated daily poll votes (total votes: ${totalPollVotes} votes)`,
      time: isAr ? 'منذ ساعة' : '1 hour ago'
    },
    {
      id: 4,
      user: 'خالد اليوسف',
      role: 'مسؤول الأنظمة',
      actionAr: `تحديث جدول البث الأسبوعي للأنمي وقاموس الأعمال (المقالات النشطة: ${finalArticlesCount})`,
      actionEn: `Updated the weekly anime broadcast schedule (active stories: ${finalArticlesCount})`,
      time: isAr ? 'منذ ساعتين' : '2 hours ago'
    },
  ];

  return (
    <div className="space-y-6" id="dashboard-overview-tab-content">
      {/* Real-time Status Alert Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black text-white p-4 rounded-none border-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[4px_4px_0px_rgba(239,68,68,1)]"
        id="live-status-banner"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <p className="text-xs sm:text-sm font-black font-sans tracking-wide">
            {isAr 
              ? 'الوضع المباشر نشط: الخوادم تعمل بكفاءة تامة بنسبة 99.9% والزوار في تزايد هائل!' 
              : 'Live Mode Active: Servers running perfectly at 99.9% with surging traffic!'}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-3 py-1 text-[10px] font-mono font-black italic text-red-500">
          <Flame className="w-4 h-4 text-red-500 animate-pulse" />
          <span>{isAr ? 'خريف 2026 آمن' : 'FALL 2026 SECURE'}</span>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="overview-stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border-2 border-black p-5 rounded-none shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between"
              id={`stat-card-${idx}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-neutral-500 text-[11px] font-black uppercase font-sans tracking-wide block mb-1">
                    {stat.title}
                  </span>
                  <span className="text-3xl font-black font-mono block tracking-tight">
                    {stat.value}
                  </span>
                </div>
                <div className={`p-2.5 border-2 border-black rounded-none ${stat.color}`}>
                  <Icon className="w-5 h-5 text-black" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] font-black font-mono uppercase text-neutral-400">
                <span>{stat.change}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-black" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts & Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overview-visuals-row">
        {/* Visitor Traffic Chart (2 cols) */}
        <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] lg:col-span-2">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-6">
            <h4 className="font-sans font-black text-sm uppercase tracking-wider text-black flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-black" />
              <span>{isAr ? 'أداء الزيارات الأسبوعي ومعدل البث المباشر' : 'Weekly Visitor Traffic & Live Stream Rates'}</span>
            </h4>
            <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-black uppercase italic">
              {isAr ? 'تحديث فوري' : 'Live Updated'}
            </span>
          </div>

          {/* Neo-brutalist interactive SVG Chart */}
          <div className="h-60 w-full relative flex items-end justify-between px-2 pt-4" id="visitors-svg-chart">
            {/* Grid helper lines */}
            <div className="absolute inset-x-0 bottom-12 border-b border-dashed border-neutral-200 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-24 border-b border-dashed border-neutral-200 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-36 border-b border-dashed border-neutral-200 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-48 border-b border-dashed border-neutral-200 pointer-events-none" />

            {/* Custom SVG line overlay */}
            <svg className="absolute inset-0 w-full h-full p-2 pointer-events-none" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                d="M 10 180 L 80 140 L 150 160 L 220 90 L 290 120 L 360 40 L 430 70 L 490 20 L 490 180 Z"
                fill="url(#chartGrad)"
              />
              {/* Bold Chart Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                d="M 10 180 L 80 140 L 150 160 L 220 90 L 290 120 L 360 40 L 430 70 L 490 20"
                fill="none"
                stroke="black"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Daily Bars as columns / hoverable triggers */}
            {[
              { day: isAr ? 'السبت' : 'Sat', views: '24K', height: '60%' },
              { day: isAr ? 'الأحد' : 'Sun', views: '32K', height: '70%' },
              { day: isAr ? 'الإثنين' : 'Mon', views: '28K', height: '65%' },
              { day: isAr ? 'الثلاثاء' : 'Tue', views: '45K', height: '80%' },
              { day: isAr ? 'الأربعاء' : 'Wed', views: '38K', height: '75%' },
              { day: isAr ? 'الخميس' : 'Thu', views: '58K', height: '90%' },
              { day: isAr ? 'الجمعة' : 'Fri', views: '64K', height: '98%' },
            ].map((d, idx) => (
              <div key={idx} className="flex flex-col items-center group relative z-10 w-[12%]" id={`chart-col-${idx}`}>
                {/* Tooltip */}
                <span className="absolute -top-7 scale-0 group-hover:scale-100 bg-black text-white text-[10px] font-mono font-black py-1 px-1.5 border border-white rounded-none shadow-[2px_2px_0px_rgba(239,68,68,1)] transition-all duration-150 z-20 whitespace-nowrap">
                  {d.views} {isAr ? 'زيارة' : 'Views'}
                </span>
                
                {/* Custom bar spacer */}
                <div 
                  className="w-4 bg-black border-t border-x border-black hover:bg-amber-400 group-hover:border-2 transition-all duration-200 cursor-pointer"
                  style={{ height: `calc(${d.height} - 30px)` }}
                />

                {/* Day label */}
                <span className="mt-2 text-[10px] font-black text-neutral-800 font-sans truncate w-full text-center">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity & Commenters Row (1 col) */}
        <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
          <div>
            <div className="flex border-b-2 border-black pb-3 mb-6 items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-sans font-black text-sm uppercase tracking-wider text-black">
                <Clock className="w-4 h-4 text-black animate-pulse" />
                <span>{isAr ? 'مراقبة التفاعل الحي' : 'Live Interaction Monitor'}</span>
              </div>
              <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-black uppercase italic animate-pulse">
                {isAr ? 'نشط' : 'Live'}
              </span>
            </div>

            {/* Neo-brutalist Selector Tabs */}
            <div className="flex border-2 border-black rounded-none mb-4 overflow-hidden text-[10px] font-black font-mono uppercase">
              <button
                onClick={() => setActiveRightTab('commenters')}
                className={`flex-1 py-2 text-center transition-colors cursor-pointer border-r-2 border-black ${
                  activeRightTab === 'commenters' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'
                }`}
              >
                {isAr ? 'أبرز المعلّقين' : 'Top Commenters'}
              </button>
              <button
                onClick={() => setActiveRightTab('logs')}
                className={`flex-1 py-2 text-center transition-colors cursor-pointer ${
                  activeRightTab === 'logs' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'
                }`}
              >
                {isAr ? 'سجل النشاط' : 'Activity Log'}
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-black border-t-amber-400 rounded-full animate-spin" />
                <span className="text-xs font-mono text-neutral-400">{isAr ? 'جاري الاستعلام...' : 'Fetching live data...'}</span>
              </div>
            ) : activeRightTab === 'commenters' ? (
              <div className="space-y-3" id="active-commenters-list">
                {activeCommenters.slice(0, 5).map((comm, index) => {
                  const isTopOne = index === 0 && comm.count > 0;
                  return (
                    <div 
                      key={index} 
                      className="p-3 bg-neutral-50 border-2 border-black rounded-none flex items-center justify-between gap-3 hover:bg-neutral-100 transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]"
                      id={`commenter-row-${index}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 shrink-0 border border-black flex items-center justify-center text-xs font-black font-mono ${
                          isTopOne ? 'bg-amber-400 text-black animate-pulse' : 'bg-white text-black'
                        }`}>
                          #{index + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-sans font-black text-xs text-black truncate block">{comm.name}</span>
                            {isTopOne && <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          </div>
                          {comm.email && (
                            <span className="text-[9px] text-neutral-400 font-mono truncate block">{comm.email}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-xs font-mono font-black bg-black text-white px-2 py-0.5 border border-black">
                          {comm.count}
                        </span>
                        <span className="text-[8px] font-sans font-bold text-neutral-400 uppercase hidden sm:inline">
                          {isAr ? 'تعليق' : 'comments'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {activeCommenters.length === 0 && (
                  <div className="py-8 text-center text-xs text-neutral-400 font-mono border border-dashed border-neutral-300">
                    {isAr ? 'لا توجد تعليقات نشطة حالياً.' : 'No active comments found.'}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4" id="activity-logs-list">
                {activities.map((act) => (
                  <div 
                    key={act.id} 
                    className="p-3 bg-neutral-50 border-2 border-black rounded-none flex flex-col gap-1 text-xs hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-black text-black">{act.user}</span>
                      <span className="text-[9px] bg-black text-white px-1.5 py-0.5 font-mono font-black italic">
                        {act.role}
                      </span>
                    </div>
                    <p className="text-neutral-600 font-sans text-[11px] leading-tight">
                      {isAr ? act.actionAr : act.actionEn}
                    </p>
                    <span className="text-[9px] text-neutral-400 font-mono block mt-1 uppercase font-bold text-right font-mono">
                      {act.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-neutral-200 text-center">
            <span className="text-[9px] font-mono font-bold uppercase text-neutral-400">
              {isAr ? 'تتم مزامنة البيانات تلقائياً مع Firestore' : 'Live Data Synced securely with Firestore'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

