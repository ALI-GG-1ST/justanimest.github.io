/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarRange, Plus, Trash2, Edit3, CheckCircle2, Radio, X } from 'lucide-react';

interface ScheduleManagerProps {
  lang: 'ar' | 'en';
}

interface AnimeAirTime {
  titleAr: string;
  titleEn: string;
  timeAr: string;
  timeEn: string;
  isAiring: boolean;
  coverImage: string;
}

type WeekDay = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export default function ScheduleManager({ lang }: ScheduleManagerProps) {
  const isAr = lang === 'ar';
  const [activeDay, setActiveDay] = useState<WeekDay>('sat');
  const [schedule, setSchedule] = useState<Record<WeekDay, AnimeAirTime[]>>({
    sat: [], sun: [], mon: [], tue: [], wed: [], thu: [], fri: []
  });
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [targetDay, setTargetDay] = useState<WeekDay>('sat');

  // Fields
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [timeAr, setTimeAr] = useState('');
  const [timeEn, setTimeEn] = useState('');
  const [isAiring, setIsAiring] = useState(false);
  const [coverImage, setCoverImage] = useState('');

  const defaultSchedule: Record<WeekDay, AnimeAirTime[]> = {
    sat: [
      {
        titleAr: 'قاتل الشياطين قلعة اللانهائية',
        titleEn: 'Demon Slayer: Infinity Castle',
        timeAr: '21:00 مكة المكرمة',
        timeEn: '09:00 PM GMT+3',
        isAiring: true,
        coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop',
      },
      {
        titleAr: 'سولو ليفيلينغ الموسم الثاني',
        titleEn: 'Solo Leveling Season 2',
        timeAr: '18:30 مكة المكرمة',
        timeEn: '06:30 PM GMT+3',
        isAiring: false,
        coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200&auto=format&fit=crop',
      },
    ],
    sun: [
      {
        titleAr: 'ون بيس (One Piece)',
        titleEn: 'One Piece',
        timeAr: '05:00 فجراً مكة المكرمة',
        timeEn: '05:00 AM GMT+3',
        isAiring: true,
        coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=200&auto=format&fit=crop',
      },
      {
        titleAr: 'كاجوراباتشي الموسم الأول',
        titleEn: 'Kagurabachi Season 1',
        timeAr: '19:00 مكة المكرمة',
        timeEn: '07:00 PM GMT+3',
        isAiring: false,
        coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=200&auto=format&fit=crop',
      },
    ],
    mon: [
      {
        titleAr: 'بليتش: حرب الألف سنة الدموية',
        titleEn: 'Bleach TYBW Part 3',
        timeAr: '23:30 مكة المكرمة',
        timeEn: '11:30 PM GMT+3',
        isAiring: false,
        coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop',
      },
    ],
    tue: [
      {
        titleAr: 'برج الإله الموسم الثالث',
        titleEn: 'Tower of God Season 3',
        timeAr: '17:00 مكة المكرمة',
        timeEn: '05:00 PM GMT+3',
        isAiring: true,
        coverImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop',
      },
    ],
    wed: [
      {
        titleAr: 'سلايم دات كين الموسم الرابع',
        titleEn: 'That Time I Got Reincarnated as a Slime S4',
        timeAr: '16:00 مكة المكرمة',
        timeEn: '04:00 PM GMT+3',
        isAiring: false,
        coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop',
      },
    ],
    thu: [
      {
        titleAr: 'ري زيرو Re:Zero الموسم الرابع',
        titleEn: 'Re:Zero Season 4',
        timeAr: '20:30 مكة المكرمة',
        timeEn: '08:30 PM GMT+3',
        isAiring: false,
        coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=200&auto=format&fit=crop',
      },
    ],
    fri: [
      {
        titleAr: 'سينت سيا الأوميغا الجديد',
        titleEn: 'Saint Seiya: Omega Spark',
        timeAr: '15:00 مكة المكرمة',
        timeEn: '03:00 PM GMT+3',
        isAiring: false,
        coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=200&auto=format&fit=crop',
      },
    ],
  };

  useEffect(() => {
    const saved = localStorage.getItem('just_anime_schedule');
    if (saved) {
      setSchedule(JSON.parse(saved));
    } else {
      setSchedule(defaultSchedule);
      localStorage.setItem('just_anime_schedule', JSON.stringify(defaultSchedule));
    }
  }, []);

  const saveToStorage = (updated: Record<WeekDay, AnimeAirTime[]>) => {
    setSchedule(updated);
    localStorage.setItem('just_anime_schedule', JSON.stringify(updated));
    
    // Broadcast live update for widgets
    window.dispatchEvent(new Event('just_anime_schedule_updated'));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!titleAr || !titleEn || !timeAr || !timeEn) return;

    const entry: AnimeAirTime = {
      titleAr,
      titleEn,
      timeAr,
      timeEn,
      isAiring,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200',
    };

    const nextSchedule = { ...schedule };

    if (editIndex !== null) {
      // If we switched days during editing, remove from original day and push to targetDay
      if (activeDay !== targetDay) {
        nextSchedule[activeDay].splice(editIndex, 1);
        nextSchedule[targetDay] = [...nextSchedule[targetDay], entry];
      } else {
        nextSchedule[activeDay][editIndex] = entry;
      }
      setSuccessMsg(isAr ? 'تم حفظ التعديلات لجدول البث!' : 'Broadcast schedule item updated!');
    } else {
      nextSchedule[targetDay] = [...nextSchedule[targetDay], entry];
      setSuccessMsg(isAr ? 'تم إضافة عمل جديد لجدول البث!' : 'New anime added to broadcast schedule!');
    }

    saveToStorage(nextSchedule);
    resetForm();
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleTriggerEdit = (anime: AnimeAirTime, idx: number) => {
    setEditIndex(idx);
    setTargetDay(activeDay);
    setTitleAr(anime.titleAr);
    setTitleEn(anime.titleEn);
    setTimeAr(anime.timeAr);
    setTimeEn(anime.timeEn);
    setIsAiring(anime.isAiring);
    setCoverImage(anime.coverImage);
    setFormOpen(true);
  };

  const handleDelete = (idx: number) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الميعاد من جدول البث؟' : 'Are you sure you want to delete this broadcast?')) return;
    
    const nextSchedule = { ...schedule };
    nextSchedule[activeDay].splice(idx, 1);

    saveToStorage(nextSchedule);
    setSuccessMsg(isAr ? 'تم حذف موعد البث.' : 'Broadcast item deleted.');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const resetForm = () => {
    setEditIndex(null);
    setTitleAr('');
    setTitleEn('');
    setTimeAr('');
    setTimeEn('');
    setIsAiring(false);
    setCoverImage('');
    setFormOpen(false);
  };

  const days: { id: WeekDay; labelAr: string; labelEn: string }[] = [
    { id: 'sat', labelAr: 'السبت', labelEn: 'Saturday' },
    { id: 'sun', labelAr: 'الأحد', labelEn: 'Sunday' },
    { id: 'mon', labelAr: 'الإثنين', labelEn: 'Monday' },
    { id: 'tue', labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
    { id: 'wed', labelAr: 'الأربعاء', labelEn: 'Wednesday' },
    { id: 'thu', labelAr: 'الخميس', labelEn: 'Thursday' },
    { id: 'fri', labelAr: 'الجمعة', labelEn: 'Friday' },
  ];

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]" id="schedule-manager-panel">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-black flex items-center gap-2 uppercase tracking-wide">
            <CalendarRange className="w-6 h-6 text-black" />
            <span>{isAr ? 'إدارة جدول مواعيد البث الأسبوعي' : 'Weekly Broadcast Schedule Manager'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {isAr 
              ? `تدير حالياً جدول عرض ومواعيد البث لجميع أيام الأسبوع` 
              : `Currently managing broadcasting times for the entire week`}
          </p>
        </div>

        {!formOpen && (
          <button
            onClick={() => {
              setTargetDay(activeDay);
              setFormOpen(true);
            }}
            className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white font-sans text-xs font-black uppercase tracking-widest px-6 py-3 border-2 border-black rounded-none flex items-center justify-center gap-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(245,158,11,1)] cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>{isAr ? 'إضافة موعد بث' : 'Schedule Anime'}</span>
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

      {/* FORM: ADD OR EDIT SCHEDULE TIMING */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-2 border-black bg-neutral-50 rounded-none mb-6"
          id="schedule-editor-form"
        >
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
            <h4 className="font-sans font-black text-sm text-black">
              {editIndex !== null ? (isAr ? 'تعديل موعد البث للأنمي' : 'Modify scheduled broadcast') : (isAr ? 'جدولة موعد بث أنمي جديد' : 'Schedule new broadcast')}
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
              {/* Target Broadcast Day */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'يوم العرض' : 'Broadcast Day'}</label>
                <select
                  value={targetDay}
                  onChange={(e) => setTargetDay(e.target.value as WeekDay)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none font-black cursor-pointer"
                >
                  {days.map((d) => (
                    <option key={d.id} value={d.id}>{isAr ? d.labelAr : d.labelEn}</option>
                  ))}
                </select>
              </div>

              {/* Cover Art Image */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'رابط صورة الغلاف' : 'Cover Image URL'}</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Title Ar */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'الاسم بالعربية' : 'Title (Arabic)'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'ون بيس...' : 'One Piece...'}
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Title En */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'الاسم بالإنجليزية' : 'Title (English)'}</label>
                <input
                  type="text"
                  required
                  placeholder="One Piece..."
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Time Ar */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'ساعة العرض بالعربية' : 'Time text (Arabic)'}</label>
                <input
                  type="text"
                  required
                  placeholder="21:00 مكة المكرمة"
                  value={timeAr}
                  onChange={(e) => setTimeAr(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Time En */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'ساعة العرض بالإنجليزية' : 'Time text (English)'}</label>
                <input
                  type="text"
                  required
                  placeholder="09:00 PM GMT+3"
                  value={timeEn}
                  onChange={(e) => setTimeEn(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Live Airing checkbox banner */}
              <div className="md:col-span-2 flex items-center gap-2 border-2 border-black bg-white p-3.5 rounded-none cursor-pointer">
                <input
                  type="checkbox"
                  id="airing-status-checkbox"
                  checked={isAiring}
                  onChange={(e) => setIsAiring(e.target.checked)}
                  className="w-4 h-4 text-black border-2 border-black accent-black rounded-none"
                />
                <label htmlFor="airing-status-checkbox" className="select-none font-sans font-black text-[10px] uppercase cursor-pointer text-black">
                  {isAr ? '🔴 يعرض بث مباشر في الوقت الفعلي حالياً' : '🔴 CURRENTLY AIRING LIVE NOW'}
                </label>
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
                {editIndex !== null ? (isAr ? 'تعديل الموعد' : 'Save broadcast') : (isAr ? 'جدولة البث' : 'Schedule')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* WEEKDAY SELECTOR TABS IN THE MANAGER */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none border-b-2 border-black pb-3">
        {days.map((day) => {
          const isSelected = activeDay === day.id;
          const count = schedule[day.id]?.length || 0;
          return (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`text-xs font-black px-4 py-2.5 rounded-none border-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-black text-white border-black italic'
                  : 'bg-white text-neutral-500 border-black hover:bg-neutral-50 hover:text-black'
              }`}
            >
              <span>{isAr ? day.labelAr : day.labelEn}</span>
              <span className={`text-[10px] px-1 font-mono rounded-none ${isSelected ? 'bg-amber-400 text-black' : 'bg-black text-white'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* LIST OF RECORDED BROADCST FOR CURRENT ACTIVE TAB */}
      <div className="space-y-3">
        {schedule[activeDay] && schedule[activeDay].length > 0 ? (
          schedule[activeDay].map((anime, idx) => (
            <div 
              key={idx}
              className="bg-white border-2 border-black p-4 rounded-none flex items-center gap-3 relative hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
            >
              <img
                src={anime.coverImage}
                alt={anime.titleEn}
                className="w-14 h-14 object-cover border border-black shrink-0"
              />

              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2.5">
                  <h4 className="font-sans font-black text-sm text-black truncate">
                    {isAr ? anime.titleAr : anime.titleEn}
                  </h4>
                  {anime.isAiring && (
                    <span className="bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-none border border-black uppercase flex items-center gap-0.5 animate-pulse">
                      <Radio className="w-2.5 h-2.5" />
                      <span>{isAr ? 'يبث الآن' : 'LIVE'}</span>
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400 font-mono font-bold uppercase mt-1">
                  {isAr ? anime.timeAr : anime.timeEn}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleTriggerEdit(anime, idx)}
                  className="p-1.5 border border-black hover:bg-neutral-100 rounded-none text-black cursor-pointer shadow-xs"
                  title={isAr ? 'تعديل' : 'Edit'}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 border border-black hover:bg-red-50 hover:text-red-600 hover:border-red-600 rounded-none text-neutral-600 cursor-pointer shadow-xs"
                  title={isAr ? 'حذف الموعد' : 'Delete'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-black font-sans text-xs text-neutral-400 italic">
            {isAr ? 'لا توجد أعمال مجدولة لعرضها يوم السبت في هذا القسم.' : 'No scheduled anime found for this weekday.'}
          </div>
        )}
      </div>

    </div>
  );
}
