/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Plus, Trash2, Edit3, CheckCircle2, X } from 'lucide-react';

interface TickerManagerProps {
  lang: 'ar' | 'en';
}

export default function TickerManager({ lang }: TickerManagerProps) {
  const isAr = lang === 'ar';
  const [tickerAr, setTickerAr] = useState<string[]>([]);
  const [tickerEn, setTickerEn] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editLang, setEditLang] = useState<'ar' | 'en'>('ar');
  const [headline, setHeadline] = useState('');

  const defaultAr = [
    'تسريبات الفصل 1130 من مانجا One Piece تؤكد عودة أمير العمالقة لوكي!',
    'رسمياً: استوديو Wit يعلن عن بدء إنتاج ريميك أنمي One Piece الشهير باسم THE ONE PIECE.',
    'تسريبات حصرية: تحديد موعد عرض الجزء الثاني من الموسم الأخير لـ Bleach TYBW في أكتوبر 2026.',
    'صدمة الأسبوع: مانجاكا Jujutsu Kaisen يلمح لـ غلاف خاص وفصل إضافي قصير قريباً!',
    'مؤكد: أنمي Solo Leveling يحصل على فيلم سينمائي يغطي آرك الحديقة الحمراء.',
    'إعلان رسمي: مانجا هجوم العمالقة تحصل على نسخة ملونة بالكامل بقلم إيساياما.'
  ];

  const defaultEn = [
    'One Piece Chapter 1130 leaks confirm the return of Prince Loki of Elbaf!',
    'Official: Wit Studio announces production start for THE ONE PIECE anime remake.',
    'Exclusive Leak: Bleach TYBW Part 3 broadcast date set for October 2026.',
    'Weekly Shock: Jujutsu Kaisen creator hints at a special bonus epilogue chapter!',
    'Confirmed: Solo Leveling is getting a theatrical movie covering the Red Gate arc.',
    'Official Reveal: Attack on Titan manga to receive a fully colored edition by Isayama.'
  ];

  useEffect(() => {
    const savedAr = localStorage.getItem('just_anime_ticker_ar');
    const savedEn = localStorage.getItem('just_anime_ticker_en');

    setTickerAr(savedAr ? JSON.parse(savedAr) : defaultAr);
    setTickerEn(savedEn ? JSON.parse(savedEn) : defaultEn);
  }, []);

  const saveToStorage = (updatedAr: string[], updatedEn: string[]) => {
    setTickerAr(updatedAr);
    setTickerEn(updatedEn);
    localStorage.setItem('just_anime_ticker_ar', JSON.stringify(updatedAr));
    localStorage.setItem('just_anime_ticker_en', JSON.stringify(updatedEn));
    
    // Broadcast live event update for tickers
    window.dispatchEvent(new Event('just_anime_ticker_updated'));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;

    let updatedAr = [...tickerAr];
    let updatedEn = [...tickerEn];

    if (editIndex !== null) {
      if (editLang === 'ar') {
        updatedAr[editIndex] = headline;
      } else {
        updatedEn[editIndex] = headline;
      }
      setSuccessMsg(isAr ? 'تم تعديل العنوان بنجاح!' : 'Headline edited successfully!');
    } else {
      if (editLang === 'ar') {
        updatedAr = [headline, ...updatedAr];
      } else {
        updatedEn = [headline, ...updatedEn];
      }
      setSuccessMsg(isAr ? 'تم إضافة العنوان بنجاح لشريط الأخبار!' : 'New headline added to ticker!');
    }

    saveToStorage(updatedAr, updatedEn);
    resetForm();
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleEdit = (index: number, language: 'ar' | 'en') => {
    setEditIndex(index);
    setEditLang(language);
    setHeadline(language === 'ar' ? tickerAr[index] : tickerEn[index]);
    setFormOpen(true);
  };

  const handleDelete = (index: number, language: 'ar' | 'en') => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الخبر من الشريط العاجل؟' : 'Are you sure you want to delete this headline?')) return;
    
    let updatedAr = [...tickerAr];
    let updatedEn = [...tickerEn];

    if (language === 'ar') {
      updatedAr.splice(index, 1);
    } else {
      updatedEn.splice(index, 1);
    }

    saveToStorage(updatedAr, updatedEn);
    setSuccessMsg(isAr ? 'تم حذف الخبر.' : 'Headline deleted.');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const resetForm = () => {
    setEditIndex(null);
    setHeadline('');
    setFormOpen(false);
  };

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]" id="ticker-manager-panel">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-black flex items-center gap-2 uppercase tracking-wide">
            <Flame className="w-6 h-6 text-black" />
            <span>{isAr ? 'إدارة شريط الأخبار العاجلة' : 'Breaking News Ticker Manager'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {isAr 
              ? `تدير حالياً ${tickerAr.length} عناوين عاجلة بالعربية و ${tickerEn.length} بالإنجليزية` 
              : `Currently managing ${tickerAr.length} Arabic and ${tickerEn.length} English headlines`}
          </p>
        </div>

        {!formOpen && (
          <button
            onClick={() => {
              setEditLang(isAr ? 'ar' : 'en');
              setFormOpen(true);
            }}
            className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white font-sans text-xs font-black uppercase tracking-widest px-6 py-3 border-2 border-black rounded-none flex items-center justify-center gap-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(245,158,11,1)] cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>{isAr ? 'إضافة خبر عاجل' : 'Add Headline'}</span>
          </button>
        )}
      </div>

      {/* Success Notifications popup */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-black text-white border-2 border-amber-400 p-4 rounded-none mb-6 flex items-center gap-2.5 font-sans font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORM: ADD OR EDIT HEADLINE */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-2 border-black bg-neutral-50 rounded-none mb-6"
          id="headline-editor-form"
        >
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
            <h4 className="font-sans font-black text-sm text-black">
              {editIndex !== null ? (isAr ? 'تعديل عنوان الخبر العاجل' : 'Modify Ticker Headline') : (isAr ? 'إضافة خبر عاجل جديد للشريط' : 'New Ticker Headline')}
            </h4>
            <button
              onClick={resetForm}
              className="p-1 border border-black rounded-none hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-4.5 h-4.5 text-black" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-bold font-sans text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'لغة الخبر والعرض' : 'Target Language'}</label>
                <select
                  value={editLang}
                  disabled={editIndex !== null}
                  onChange={(e) => setEditLang(e.target.value as 'ar' | 'en')}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none font-black cursor-pointer"
                >
                  <option value="ar">{isAr ? 'العربية (Arabic)' : 'Arabic'}</option>
                  <option value="en">{isAr ? 'الإنجليزية (English)' : 'English'}</option>
                </select>
              </div>

              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'صياغة الخبر العاجل' : 'Headline Content'}</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={editLang === 'ar' ? 'ادخل صياغة الخبر العاجل هنا...' : 'Enter the English breaking news...'}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-white text-black border border-black rounded-none text-xs font-bold cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black hover:bg-neutral-800 text-white border border-black rounded-none text-xs font-black uppercase cursor-pointer"
              >
                {editIndex !== null ? (isAr ? 'حفظ العنوان' : 'Save Headline') : (isAr ? 'إضافة للشريط' : 'Add to Ticker')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* TWO SECTIONS: ARABIC & ENGLISH LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="tickers-side-by-side">
        
        {/* Arabic news feed list */}
        <div className="bg-neutral-50/50 border-2 border-black p-4 rounded-none">
          <h4 className="font-sans font-black text-xs text-black border-b border-black pb-2 mb-4 flex items-center justify-between">
            <span>🇸🇦 شريط الأخبار العربية</span>
            <span className="font-mono text-[10px] bg-black text-white px-1.5">{tickerAr.length}</span>
          </h4>

          <div className="space-y-3 font-sans text-xs">
            {tickerAr.map((text, idx) => (
              <div key={`ar-${idx}`} className="bg-white border border-black p-3 rounded-none flex items-start justify-between gap-2.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all">
                <p className="font-semibold text-black leading-relaxed">{text}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(idx, 'ar')}
                    className="p-1.5 hover:bg-neutral-100 border border-transparent hover:border-black rounded-none text-black cursor-pointer transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(idx, 'ar')}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-600 rounded-none text-neutral-500 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* English news feed list */}
        <div className="bg-neutral-50/50 border-2 border-black p-4 rounded-none">
          <h4 className="font-sans font-black text-xs text-black border-b border-black pb-2 mb-4 flex items-center justify-between">
            <span>🇺🇸 English News Ticker</span>
            <span className="font-mono text-[10px] bg-black text-white px-1.5">{tickerEn.length}</span>
          </h4>

          <div className="space-y-3 font-sans text-xs">
            {tickerEn.map((text, idx) => (
              <div key={`en-${idx}`} className="bg-white border border-black p-3 rounded-none flex items-start justify-between gap-2.5 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all">
                <p className="font-semibold text-neutral-800 leading-relaxed text-left">{text}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(idx, 'en')}
                    className="p-1.5 hover:bg-neutral-100 border border-transparent hover:border-black rounded-none text-black cursor-pointer transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(idx, 'en')}
                    className="p-1.5 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-600 rounded-none text-neutral-500 cursor-pointer transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
