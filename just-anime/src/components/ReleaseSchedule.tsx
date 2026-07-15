/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarRange, Radio } from 'lucide-react';
import { translations } from '../translations';

interface ReleaseScheduleProps {
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

export default function ReleaseSchedule({ lang }: ReleaseScheduleProps) {
  const t = translations[lang];
  const [activeDay, setActiveDay] = useState<WeekDay>('sat');
  const [scheduleData, setScheduleData] = useState<Record<WeekDay, AnimeAirTime[]>>({
    sat: [],
    sun: [],
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
  });

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
    const handleUpdate = () => {
      const saved = localStorage.getItem('just_anime_schedule');
      if (saved) {
        setScheduleData(JSON.parse(saved));
      } else {
        setScheduleData(defaultSchedule);
        localStorage.setItem('just_anime_schedule', JSON.stringify(defaultSchedule));
      }
    };

    handleUpdate();

    window.addEventListener('just_anime_schedule_updated', handleUpdate);
    return () => {
      window.removeEventListener('just_anime_schedule_updated', handleUpdate);
    };
  }, []);

  const days: { id: WeekDay; label: string }[] = [
    { id: 'sat', label: t.sched_sat },
    { id: 'sun', label: t.sched_sun },
    { id: 'mon', label: t.sched_mon },
    { id: 'tue', label: t.sched_tue },
    { id: 'wed', label: t.sched_wed },
    { id: 'thu', label: t.sched_thu },
    { id: 'fri', label: t.sched_fri },
  ];

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-xs" id="release-schedule-widget">
      {/* Header */}
      <h3 className="font-sans font-black text-lg text-black border-b-2 border-black pb-3 mb-4 flex items-center gap-2 uppercase tracking-wide">
        <CalendarRange className="w-5 h-5 text-black" />
        <span>{t.scheduleTitle}</span>
      </h3>

      {/* Weekdays Tabs row */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none" id="schedule-day-tabs">
        {days.map((day) => {
          const isSelected = activeDay === day.id;
          return (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`text-[10px] sm:text-[11px] font-black px-2.5 py-1.5 rounded-none border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-black text-white border-black italic'
                  : 'bg-white text-neutral-500 border-black hover:bg-neutral-50 hover:text-black'
              }`}
              id={`sched-tab-${day.id}`}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {/* Anime broadcasting list for active day */}
      <div className="space-y-3 relative min-h-[140px]" id="schedule-anime-items">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {scheduleData[activeDay] && scheduleData[activeDay].length > 0 ? (
              scheduleData[activeDay].map((anime, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 bg-neutral-50 border-2 border-black p-3 rounded-none relative overflow-hidden"
                >
                  {/* Small preview thumbnail */}
                  <img
                    src={anime.coverImage}
                    alt={anime.titleEn}
                    loading="lazy"
                    className="w-12 h-12 object-cover border border-black rounded-none flex-shrink-0"
                  />

                  <div className="flex-grow min-w-0">
                    {/* Title */}
                    <h4 className="font-sans font-black text-xs sm:text-sm text-black truncate leading-tight mb-1">
                      {lang === 'ar' ? anime.titleAr : anime.titleEn}
                    </h4>
                    {/* Timing info */}
                    <span className="font-mono text-[10px] text-neutral-500 block uppercase font-bold">
                      {lang === 'ar' ? anime.timeAr : anime.timeEn}
                    </span>
                  </div>

                  {/* Status indicator */}
                  <div className="flex-shrink-0">
                    {anime.isAiring ? (
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-none flex items-center gap-1 border border-black animate-pulse uppercase italic">
                        <Radio className="w-3 h-3 text-white" />
                        <span>{t.sched_airing}</span>
                      </span>
                    ) : (
                      <span className="bg-white text-neutral-400 text-[9px] font-mono font-black px-1.5 py-0.5 rounded-none border border-black uppercase italic">
                        <span>{t.sched_upcoming}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-neutral-400 font-sans italic">
                {lang === 'ar' ? 'لا توجد أعمال مجدولة لهذا اليوم.' : 'No scheduled anime for this day.'}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
