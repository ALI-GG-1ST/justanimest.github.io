/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Flame, Eye, EyeOff, AlertTriangle, ExternalLink } from 'lucide-react';

interface LeakRecord {
  id: string;
  mangaAr: string;
  mangaEn: string;
  titleAr: string;
  titleEn: string;
  date: string;
  leakTextAr: string;
  leakTextEn: string;
  hasSpilersImage: boolean;
  image: string;
}

export default function MangaLeaksHub({ lang }: { lang: 'ar' | 'en' }) {
  const isAr = lang === 'ar';
  const [unblurredIds, setUnblurredIds] = useState<string[]>([]);

  const leaks: LeakRecord[] = [
    {
      id: 'leak-1',
      mangaAr: 'ون بيس (One Piece)',
      mangaEn: 'One Piece Chapter 1131',
      titleAr: 'تسريبات الفصل 1131: حوار لوفي الناري مع لوكي أمير العمالقة!',
      titleEn: 'Chapter 1131: Luffy\'s Fiery Dialogue with Prince Loki!',
      date: '2026-07-15 08:00',
      leakTextAr: 'لوفي يستعمل الهاكي الملكي المتقدم لتخفيف حدة القيود بينما يضحك لوكي ساخراً ويقترح عليه صفقة للمغادرة. يوسوب يشاهدهم من بعيد ويبكي خوفاً من هالة أمير العمالقة التي تغطي السجن بأكمله.',
      leakTextEn: 'Luffy uses Advanced Conqueror\'s Haki to test Loki\'s restraints while Loki laughs mockingly, offering him a trade-off. Usopp observes in total terror of the Prince\'s overwhelming dark spiritual aura.',
      hasSpilersImage: true,
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'leak-2',
      mangaAr: 'بوروتو: دورتين زرقاء (Boruto TBV)',
      mangaEn: 'Boruto: Two Blue Vortex Chapter 16',
      titleAr: 'تسريبات الفصل 16: كاشين كوجي يكشف لبوروتو عن رؤى دمار المستقبل!',
      titleEn: 'Chapter 16: Kashin Koji Reveals Apocalyptic Future Visions to Boruto!',
      date: '2026-07-14 15:30',
      leakTextAr: 'كاشين كوجي يشرح قدرة شينجو شيباي الحقيقية وتوقع تدمير قرية كونوها بالكامل. بوروتو يبدأ تدريباً مكثفاً لدمج تشاكرا الرياح مع الرعد المتقدم لصياغة جيل جديد من تقنيات الطيران الذاتي.',
      leakTextEn: 'Kashin Koji details the True Shibai Shingo power and predicts the complete annihilation of Konoha. Boruto starts intense training merging wind and lightning chakra elements for flight.',
      hasSpilersImage: true,
      image: 'https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'leak-3',
      mangaAr: 'كاجوراباتشي (Kagurabachi)',
      mangaEn: 'Kagurabachi Chapter 90',
      titleAr: 'تسريبات الفصل 90: شيشامو يحرر طاقة النصل الفوضوية!',
      titleEn: 'Chapter 90: Chihiro Unleashes the Ultimate Chaos Blade Domain!',
      date: '2026-07-13 11:00',
      leakTextAr: 'تطور غير متوقع! تشيهيرو يصاب بجروح بالغة ولكنه يدمج السيف السحري ليفجر طاقة مائية سوداء غير منتهية تدمر حصون العصابة الحاكمة بالكامل وتقطع خطوط الإمدادات للسلاح النووي.',
      leakTextEn: 'Unexpected turn! Chihiro, heavily wounded, merges the magic sword and creates a massive black water energy vortex, flattening the syndicate fortress in a single swing.',
      hasSpilersImage: false,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60',
    }
  ];

  const handleToggleReveal = (id: string) => {
    if (unblurredIds.includes(id)) {
      setUnblurredIds(unblurredIds.filter((xId) => xId !== id));
    } else {
      setUnblurredIds([...unblurredIds, id]);
    }
  };

  return (
    <section className="bg-white border-2 border-black p-6 rounded-none shadow-[4px_4px_0px_rgba(245,158,11,1)]" id="manga-leaks-section">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-black pb-4 mb-6 gap-3">
        <div>
          <span className="text-[10px] bg-amber-400 text-black border border-black px-2.5 py-0.5 rounded-none font-mono font-black uppercase inline-block mb-1 italic">
            {isAr ? 'قسم التسريبات الحارقة والمانجا' : 'HOT MANGA SPOILERS NETWORK'}
          </span>
          <h3 className="font-sans font-black text-lg text-black flex items-center gap-2">
            <Flame className="w-5 h-5 text-black animate-bounce" />
            <span>{isAr ? 'غرفة تسريبات المانجا الفورية والترجمات الأولية' : 'Manga Spoilers & Fast Leaks Hub'}</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono font-black text-neutral-500 uppercase bg-neutral-100 border border-black px-2 py-1">
          <AlertTriangle className="w-3.5 h-3.5 text-black animate-pulse" />
          <span>{isAr ? 'تنبيه حرق المانجا' : 'SPOILERS AHEAD WARNING'}</span>
        </div>
      </div>

      {/* Leaks Column */}
      <div className="space-y-6" id="leaks-list-wrapper">
        {leaks.map((leak) => {
          const isRevealed = unblurredIds.includes(leak.id);
          return (
            <div 
              key={leak.id} 
              className="border-2 border-black rounded-none p-4 bg-neutral-50 hover:bg-white hover:translate-x-[2px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all flex flex-col lg:flex-row gap-5"
              id={`leak-row-${leak.id}`}
            >
              {/* Cover or Spoiler Blurrable Screen */}
              <div className="w-full lg:w-48 h-32 shrink-0 border border-black relative overflow-hidden bg-black flex items-center justify-center">
                <img 
                  src={leak.image} 
                  alt={leak.mangaEn} 
                  className={`w-full h-full object-cover transition-all duration-300 ${isRevealed ? 'blur-none scale-100 grayscale-0' : 'blur-xl scale-110 grayscale brightness-50'}`}
                  referrerPolicy="no-referrer"
                />
                {!isRevealed && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                    <EyeOff className="w-8 h-8 text-white mb-1.5 animate-pulse" />
                    <span className="text-[10px] text-white font-black uppercase font-mono tracking-widest bg-black px-1.5 border border-white">
                      {isAr ? 'محتوى محروق' : 'SPOILER COVER'}
                    </span>
                  </div>
                )}
              </div>

              {/* Text & Content */}
              <div className="flex-grow space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-black text-white font-black px-2 py-0.5 rounded-none font-mono uppercase italic">
                    {lang === 'ar' ? leak.mangaAr : leak.mangaEn}
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 font-bold">
                    {leak.date}
                  </span>
                </div>

                <h4 className="font-sans font-black text-sm text-black">
                  {lang === 'ar' ? leak.titleAr : leak.titleEn}
                </h4>

                <div className="relative">
                  <p className={`font-serif text-[11px] leading-relaxed transition-all duration-300 select-none ${isRevealed ? 'text-neutral-700 blur-none' : 'text-neutral-300 select-none blur-xs'}`}>
                    {lang === 'ar' ? leak.leakTextAr : leak.leakTextEn}
                  </p>
                  
                  {/* Blurry text block guard */}
                  {!isRevealed && (
                    <div className="absolute inset-0 bg-neutral-50/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none" />
                  )}
                </div>

                {/* Reveal action button */}
                <div className="flex items-center justify-between border-t border-neutral-200 pt-3 mt-1.5">
                  <button
                    onClick={() => handleToggleReveal(leak.id)}
                    className="flex items-center gap-1.5 text-[10px] font-mono font-black bg-white text-black px-3.5 py-1.5 rounded-none border border-black hover:bg-neutral-100 transition-all cursor-pointer shadow-[1px_1px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-black" />
                        <span>{isAr ? 'إخفاء وحجب التسريب' : 'Hide Spoiler'}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-black" />
                        <span>{isAr ? 'كشف تفاصيل الحرق والتسريب' : 'Reveal Spoilers'}</span>
                      </>
                    )}
                  </button>

                  <a 
                    href="#manga-division"
                    onClick={(e) => {
                      e.preventDefault();
                      window.alert(isAr ? 'الترجمة الحصرية الكاملة ستصدر فجر الغد بالتعاون مع فريق الترجمة الخاص بنا!' : 'The full exclusive translation drops tomorrow morning in our Manga Division.');
                    }}
                    className="text-[10px] font-sans font-black text-black hover:underline flex items-center gap-1 uppercase"
                  >
                    <span>{isAr ? 'قراءة الترجمة الكاملة' : 'Read Full Scan'}</span>
                    <ExternalLink className="w-3 h-3 text-black" />
                  </a>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
