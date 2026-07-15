/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Check, X, Reply, Trash2, ShieldAlert, Search, Edit3 } from 'lucide-react';

interface CommentManagerProps {
  lang: 'ar' | 'en';
}

interface CommentRecord {
  id: string;
  articleTitle: string;
  author: string;
  email: string;
  content: string;
  date: string;
  status: 'pending' | 'approved';
  replyText?: string;
}

export default function CommentManager({ lang }: CommentManagerProps) {
  const isAr = lang === 'ar';
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all');
  
  // Modals / Input states
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [activeEditId, setActiveEditId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');

  const defaultCommentsList: CommentRecord[] = [
    {
      id: 'comm-1',
      articleTitle: 'تسريبات الفصل 1130 من مانجا One Piece تؤكد عودة أمير العمالقة لوكي!',
      author: 'محمد الغامدي',
      email: 'mohamed@example.com',
      content: 'تسريب مجنون جداً! عودة لوكي ستغير توازن القوى بالكامل في آرك إلباف. شكراً جزيلاً لسرعة النشر والتغطية!',
      date: '2026-07-14 21:30',
      status: 'pending',
    },
    {
      id: 'comm-2',
      articleTitle: 'رسمياً: استوديو Wit يعلن عن بدء إنتاج ريميك أنمي One Piece الشهير',
      author: 'Yuki Chan',
      email: 'yuki@example.com',
      content: 'Honestly Wit Studio will give One Piece the pacing and fluid modern art it truly deserves. Cant wait for 2026!',
      date: '2026-07-14 18:45',
      status: 'approved',
      replyText: 'We absolutely agree! The collaboration looks extremely promising.',
    },
    {
      id: 'comm-3',
      articleTitle: 'تسريبات حصرية: تحديد موعد عرض الجزء الثاني من الموسم الأخير لـ Bleach TYBW',
      author: 'عبد الله الدوسري',
      email: 'abdallah@example.com',
      content: 'هل التسريب بخصوص تأجيل شهر أكتوبر مؤكد؟ تيت كوبو كان يتحدث عن إنتاج إضافي ضخم.',
      date: '2026-07-13 14:15',
      status: 'pending',
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('just_anime_comments_all');
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
      setComments(defaultCommentsList);
      localStorage.setItem('just_anime_comments_all', JSON.stringify(defaultCommentsList));
    }
  }, []);

  const saveToStorage = (updated: CommentRecord[]) => {
    setComments(updated);
    localStorage.setItem('just_anime_comments_all', JSON.stringify(updated));
  };

  const handleApprove = (id: string) => {
    const updated = comments.map((c) => (c.id === id ? { ...c, status: 'approved' as const } : c));
    saveToStorage(updated);
    setSuccessMsg(isAr ? 'تمت الموافقة على التعليق ونشره بنجاح!' : 'Comment approved and published!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleDisapprove = (id: string) => {
    const updated = comments.map((c) => (c.id === id ? { ...c, status: 'pending' as const } : c));
    saveToStorage(updated);
    setSuccessMsg(isAr ? 'تم إعادة التعليق للمراجعة والتعليق.' : 'Comment moved back to pending list.');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من رغبتك في حذف هذا التعليق نهائياً؟' : 'Are you sure you want to permanently delete this comment?')) return;
    const updated = comments.filter((c) => c.id !== id);
    saveToStorage(updated);
    setSuccessMsg(isAr ? 'تم حذف التعليق.' : 'Comment deleted.');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleAddReplySubmit = (e: FormEvent, id: string) => {
    e.preventDefault();
    if (!replyInput.trim()) return;

    const updated = comments.map((c) => {
      if (c.id === id) {
        return { ...c, replyText: replyInput, status: 'approved' as const };
      }
      return c;
    });

    saveToStorage(updated);
    setReplyInput('');
    setActiveReplyId(null);
    setSuccessMsg(isAr ? 'تم نشر الرد الرسمي الخاص بالمحرر بنجاح!' : 'Official moderator reply posted!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleEditCommentSubmit = (e: FormEvent, id: string) => {
    e.preventDefault();
    if (!editInput.trim()) return;

    const updated = comments.map((c) => {
      if (c.id === id) {
        return { ...c, content: editInput };
      }
      return c;
    });

    saveToStorage(updated);
    setEditInput('');
    setActiveEditId(null);
    setSuccessMsg(isAr ? 'تم تعديل صياغة التعليق بنجاح!' : 'Comment text successfully edited!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const filtered = comments.filter((c) => {
    const matchesSearch = c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.articleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || c.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]" id="comment-manager-component">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-black flex items-center gap-2 uppercase tracking-wide">
            <MessageSquare className="w-6 h-6 text-black" />
            <span>{isAr ? 'لوحة تعديل ورقابة التعليقات' : 'Comment Moderation Hub'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {isAr 
              ? `تتابع حالياً ${comments.length} تعليق في مقالات المدونة النشطة` 
              : `Reviewing and managing ${comments.length} reader comments`}
          </p>
        </div>

        {/* Success Alert popup */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-black text-white border-2 border-amber-400 p-2.5 rounded-none font-sans font-black text-[10px] uppercase shadow-xs shrink-0"
            >
              ⭐ {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SEARCH AND STATE FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder={isAr ? 'بحث سريع بمحتوى التعليق أو كاتب التعليق أو المقالة...' : 'Search comments by content, author, or article...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 hover:bg-neutral-100/50 border-2 border-black rounded-none text-xs px-10 py-3.5 focus:outline-none focus:bg-white font-sans font-bold text-black"
          />
          <Search className={`absolute top-4.5 w-4.5 h-4.5 text-black ${isAr ? 'right-3.5' : 'left-3.5'}`} />
        </div>

        {/* State filters tabs */}
        <div className="flex border-2 border-black rounded-none overflow-hidden text-xs font-black font-sans shrink-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeFilter === 'all' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer border-x-2 border-black flex items-center justify-center gap-1 ${
              activeFilter === 'pending' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'
            }`}
          >
            <span>{isAr ? 'معلقة' : 'Pending'}</span>
            <span className={`text-[9px] px-1 bg-red-600 text-white font-mono ${activeFilter === 'pending' ? 'border border-white' : ''}`}>
              {comments.filter((c) => c.status === 'pending').length}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeFilter === 'approved' ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'
            }`}
          >
            {isAr ? 'منشورة' : 'Approved'}
          </button>
        </div>
      </div>

      {/* COMMENTS FEED LIST */}
      <div className="space-y-4" id="comments-moderator-feed">
        {filtered.length > 0 ? (
          filtered.map((comment) => (
            <motion.div
              layout
              key={comment.id}
              className={`bg-white border-2 border-black p-5 rounded-none relative transition-all ${
                comment.status === 'pending' ? 'border-dashed shadow-[4px_4px_0px_rgba(239,68,68,1)]' : 'shadow-[3px_3px_0px_rgba(0,0,0,1)]'
              }`}
              id={`comment-moderator-card-${comment.id}`}
            >
              {/* Top Row: metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-3 mb-3 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-xs sm:text-sm text-black">{comment.author}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">({comment.email})</span>
                  </div>
                  <span className="text-[10px] font-sans font-bold text-neutral-400 mt-1 block">
                    {isAr ? 'مقال: ' : 'Article: '} 
                    <span className="text-black font-black hover:underline cursor-pointer">{comment.articleTitle}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-neutral-400 font-mono font-bold uppercase">
                    {comment.date}
                  </span>
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-none border uppercase ${
                    comment.status === 'approved' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-500' 
                      : 'bg-red-50 text-red-600 border-red-500'
                  }`}>
                    {comment.status === 'approved' ? (isAr ? 'منشور' : 'Approved') : (isAr ? 'معلق ومراجعة' : 'Pending')}
                  </span>
                </div>
              </div>

              {/* Main content body / Edit comment form */}
              {activeEditId === comment.id ? (
                <form onSubmit={(e) => handleEditCommentSubmit(e, comment.id)} className="space-y-2 mb-4">
                  <textarea
                    required
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    className="w-full bg-white border-2 border-black p-3 text-xs sm:text-sm font-sans focus:outline-none"
                    rows={3}
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveEditId(null)}
                      className="px-3 py-1.5 bg-white border border-black text-[10px] font-bold rounded-none cursor-pointer"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-black text-white border border-black text-[10px] font-black rounded-none cursor-pointer"
                    >
                      {isAr ? 'حفظ التعديل' : 'Save'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-neutral-800 font-sans text-xs sm:text-sm leading-relaxed mb-4">
                  {comment.content}
                </p>
              )}

              {/* Official reply sub block */}
              {comment.replyText && (
                <div className="bg-neutral-50 border-l-4 border-black p-3 mb-4 rounded-none">
                  <h5 className="font-sans font-black text-[10px] text-black uppercase mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{isAr ? 'الرد الرسمي للمشرف:' : 'Official Admin Response:'}</span>
                  </h5>
                  <p className="text-neutral-600 text-xs font-serif leading-relaxed italic">
                    "{comment.replyText}"
                  </p>
                </div>
              )}

              {/* INTERACTIVE ACTIONS PANEL ROW */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                <div className="flex items-center gap-2">
                  {comment.status === 'pending' ? (
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 border border-black text-[10px] font-black uppercase rounded-none flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'موافقة ونشر' : 'Approve'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDisapprove(comment.id)}
                      className="px-3 py-1.5 bg-white text-black hover:bg-neutral-50 border border-black text-[10px] font-bold uppercase rounded-none flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>{isAr ? 'سحب الموافقة' : 'Reject'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setActiveEditId(comment.id);
                      setEditInput(comment.content);
                    }}
                    className="px-3 py-1.5 bg-white text-black hover:bg-neutral-50 border border-black text-[10px] font-bold uppercase rounded-none flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تعديل النص' : 'Edit text'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                      setReplyInput('');
                    }}
                    className="px-3 py-1.5 bg-white text-black hover:bg-neutral-50 border border-black text-[10px] font-bold uppercase rounded-none flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رد رسمي' : 'Reply'}</span>
                  </button>
                </div>

                <button
                  onClick={() => handleDelete(comment.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-600 border border-transparent hover:border-black rounded-none cursor-pointer transition-colors"
                  title={isAr ? 'حذف التعليق' : 'Delete Comment'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* REPLY FORM COLLAPSIBLE */}
              <AnimatePresence>
                {activeReplyId === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4 pt-4 border-t border-neutral-200"
                  >
                    <form onSubmit={(e) => handleAddReplySubmit(e, comment.id)} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'اكتب الرد الرسمي للمشرف هنا...' : 'Write official administrator reply...'}
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        className="flex-grow bg-neutral-50 border-2 border-black rounded-none px-3 py-2 text-xs focus:bg-white focus:outline-none font-sans font-bold text-black"
                      />
                      <button
                        type="submit"
                        className="bg-black hover:bg-neutral-800 text-white border-2 border-black px-4 py-2 font-sans font-black uppercase text-xs rounded-none cursor-pointer transition-colors"
                      >
                        {isAr ? 'إرسال' : 'Send'}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center text-neutral-400 font-sans border-2 border-dashed border-black">
            {isAr ? 'لا توجد أي تعليقات مطابقة للفرز والبحث.' : 'No comments found for search filter.'}
          </div>
        )}
      </div>
    </div>
  );
}
