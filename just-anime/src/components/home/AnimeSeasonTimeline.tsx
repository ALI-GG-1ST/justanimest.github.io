/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, Flame, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineEvent {
  id: string;
  season: 'winter' | 'spring' | 'summer' | 'fall';
  titleAr: string;
  titleEn: string;
  studio: string;
  genresAr: string[];
  genresEn: string[];
  descAr: string;
  descEn: string;
  statusAr: string;
  statusEn: string;
  cover: string;
}

export default function AnimeSeasonTimeline({ lang }: { lang: 'ar' | 'en' }) {
  const isAr = lang === 'ar';
  const [activeSeason, setActiveSeason] = useState<'all' | 'winter' | 'spring' | 'summer' | 'fall'>('all');

  const seasonsList = [
    { id: 'all', labelAr: 'كل الفصول', labelEn: 'All Seasons' },
    { id: 'winter', labelAr: 'شتاء 2026', labelEn: 'Winter 2026' },
    { id: 'spring', labelAr: 'ربيع 2026', labelEn: 'Spring 2026' },
    { id: 'summer', labelAr: 'صيف 2026', labelEn: 'Summer 2026' },
    { id: 'fall', labelAr: 'خريف 2026', labelEn: 'Fall 2026' },
  ];

  const events: TimelineEvent[] = [
    {
      id: 'time-1',
      season: 'winter',
      titleAr: 'أنمي ريميك ون بيس (THE ONE PIECE)',
      titleEn: 'THE ONE PIECE Remake',
      studio: 'Wit Studio',
      genresAr: ['مغامرة', 'أكشن', 'شينوبي'],
      genresEn: ['Adventure', 'Action', 'Shonen'],
      descAr: 'إعادة إرساء السلسلة الأسطورية بداية من الأزرق الشرقي بنسق إنتاجي عصري خالٍ من الفيلر والتمطيط بتعاون Wit Studio مع Netflix.',
      descEn: 'The legendary saga returns from East Blue with high-tier modern animation pacing, free of filler, produced by Wit Studio & Netflix.',
      statusAr: 'إنتاج مؤكد - يناير 2026',
      statusEn: 'Confirmed - January 2026',
      cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'time-2',
      season: 'winter',
      titleAr: 'سولو ليفيلينغ: الموسم الثاني (Arise from the Shadow)',
      titleEn: 'Solo Leveling Season 2: Arise from the Shadow',
      studio: 'A-1 Pictures',
      genresAr: ['بوابة', 'أكشن', 'قوى خارقة'],
      genresEn: ['Fantasy', 'Action', 'RPG'],
      descAr: 'بعد الصدمة الكبرى للموسم الأول، سونغ جين وو يقود جيشه المتزايد من الظلال لكشف أسرار المنظومة ومواجهة الملوك الجدد.',
      descEn: 'Following the massive success of Season 1, Sung Jinwoo commands his growing Shadow Army to unravel the System secrets and face Monarchs.',
      statusAr: 'مكتمل الإنتاج - يناير 2026',
      statusEn: 'Completed - January 2026',
      cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'time-3',
      season: 'spring',
      titleAr: 'أنمي ممر كاجوراباتشي (Kagurabachi)',
      titleEn: 'Kagurabachi Anime Adaptation',
      studio: 'ufotable',
      genresAr: ['ساموراي', 'دراما', 'سحر الأسياف'],
      genresEn: ['Samurai', 'Dark Fantasy', 'Action'],
      descAr: 'المانجا الأكثر شهرة في مجلة شونين جمب تحصل رسمياً على اقتباس أنمي فاخر تحت رعاية استوديو ufotable لإنتاج معارك أسياف مبهرة.',
      descEn: 'The highly popular Shonen Jump manga officially receives a prestige anime adaptation animated by ufotable for breathtaking sword combat.',
      statusAr: 'قيد العمل - أبريل 2026',
      statusEn: 'In Production - April 2026',
      cover: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'time-4',
      season: 'spring',
      titleAr: 'أكاديمية بطلي: فيلم المعركة الختامية الكبرى',
      titleEn: 'My Hero Academia: The Last Stand Movie',
      studio: 'Bones',
      genresAr: ['أبطال', 'أكشن', 'مأساة'],
      genresEn: ['Heroes', 'Action', 'Superpowers'],
      descAr: 'الفيلم السينمائي الختامي الذي يسطر الملحمة الأخيرة بين ديكو ورمز الشر المطلق أول فور ون بتعاون جيل الأبطال الناشئ.',
      descEn: 'The final cinematic movie portraying the ultimate clash between Deku and the symbol of evil All For One with the next-gen heroes.',
      statusAr: 'إنتاج مؤكد - مايو 2026',
      statusEn: 'Confirmed Release - May 2026',
      cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'time-5',
      season: 'summer',
      titleAr: 'قاتل الشياطين: فيلم قلعة اللانهائية (الجزء الأول)',
      titleEn: 'Demon Slayer: Infinity Castle Movie Trilogy (Part I)',
      studio: 'ufotable',
      genresAr: ['شياطين', 'تاريخي', 'معارك ملحمية'],
      genresEn: ['Slayer', 'Historical', 'Masterpiece'],
      descAr: 'المرحلة الختامية تبدأ هنا! تانجيرو والهاشيرا يخوضون أشرس حرب بقاء داخل معقل موزان كيبوتسوجي الملتوي بالبعد غير المتناهي.',
      descEn: 'The endgame begins! Tanjiro and the Hashiras wage absolute war inside Muzan Kibutsuji\'s twisting extra-dimensional fortress.',
      statusAr: 'العرض بالسينما - يوليو 2026',
      statusEn: 'Theatrical Release - July 2026',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'time-6',
      season: 'summer',
      titleAr: 'رجل المنشار: فيلم آرك ريزي (Reze Movie)',
      titleEn: 'Chainsaw Man: Reze Arc Movie',
      studio: 'MAPPA',
      genresAr: ['غموض', 'رعب نفسي', 'أكشن'],
      genresEn: ['Action', 'Psychological', 'Gore'],
      descAr: 'سينما بمفهوم سوداوي! دينجي يلتقي بالفتاة الغامضة ريزي لتبدأ سلسلة أحداث دامية وصراعات تفجيرية تقلب موازين قصة رجل المنشار.',
      descEn: 'Dark cinematic storytelling! Denji meets the mysterious Reze, starting a series of tragic, explosive fights in the Chainsaw Man universe.',
      statusAr: 'مؤكد صيف - أغسطس 2026',
      statusEn: 'Summer Blockbuster - August 2026',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'time-7',
      season: 'fall',
      titleAr: 'بليتش: حرب الألف عام الدموية - الجزء الرابع والأخير',
      titleEn: 'Bleach: Thousand-Year Blood War - Part 4: The Finale',
      studio: 'Studio Pierrot',
      genresAr: ['شينيغامي', 'صراع الأرواح', 'خيال علمي'],
      genresEn: ['Shinigami', 'Quincy', 'Epic Battle'],
      descAr: 'النهاية الحاسمة التي طال انتظارها لأكثر من عقد! كرنفال السول سوسايتي يكتمل بمواجهة إيتشيغو كوروساكي ضد الإله كوينسي يوهاباخ.',
      descEn: 'The long-awaited climax of the decade! The Soul Society saga reaches its ultimate peak as Ichigo Kurosaki faces Quincy god Yhwach.',
      statusAr: 'بث مباشر - أكتوبر 2026',
      statusEn: 'Broadcast Release - October 2026',
      cover: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=60',
    },
    {
      id: 'time-8',
      season: 'fall',
      titleAr: 'جوجوتسو كايسن: الموسم الثالث (لعبة الإعدام)',
      titleEn: 'Jujutsu Kaisen Season 3: The Culling Game',
      studio: 'MAPPA',
      genresAr: ['سحر', 'غموض', 'تضحيات'],
      genresEn: ['Cursed Energy', 'Sorcery', 'Shonen'],
      descAr: 'بعد دمار شيبويا، كينجاكو يفجر فتيل اللعبة الدموية الفتاكة. السحرة في مواجهة حتمية مع سحرة العصور الغابرة لتقرير بقاء البشرية.',
      descEn: 'After the Shibuya Incident, Kenjaku initiates the Culling Game. Modern sorcerers must fight ancient legends for the survival of mankind.',
      statusAr: 'إنتاج مؤكد - نوفمبر 2026',
      statusEn: 'In Production - November 2026',
      cover: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=600&auto=format&fit=crop&q=60',
    }
  ];

  const filteredEvents = activeSeason === 'all' 
    ? events 
    : events.filter(e => e.season === activeSeason);

  return (
    <section className="bg-white border-2 border-black p-6 rounded-none shadow-[4px_4px_0px_rgba(245,158,11,1)]" id="anime-timeline-section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-black pb-4 mb-6 gap-3">
        <div>
          <span className="text-[10px] bg-amber-400 text-black border border-black px-2.5 py-0.5 rounded-none font-mono font-black uppercase inline-block mb-1 italic">
            {isAr ? 'أجندة الخطة السنوية 2026' : 'ANNUAL FORECAST TIMELINE 2026'}
          </span>
          <h3 className="font-sans font-black text-lg text-black flex items-center gap-2">
            <Calendar className="w-5 h-5 text-black animate-pulse" />
            <span>{isAr ? 'المخطط الزمني الشامل لأضخم عروض الأنمي' : 'Comprehensive Anime Release Agenda'}</span>
          </h3>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 font-bold bg-neutral-100 px-2 py-1 border border-black">
          {events.length} {isAr ? 'مشروعاً مرتقباً' : 'upcoming blockbusters'}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none" id="timeline-filter-buttons">
        {seasonsList.map((s) => {
          const isSelected = activeSeason === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id as any)}
              className={`text-[11px] font-black px-3.5 py-2 rounded-none border transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_rgba(245,158,11,1)] italic'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-300 hover:bg-neutral-100 hover:text-black hover:border-black'
              }`}
            >
              {lang === 'ar' ? s.labelAr : s.labelEn}
            </button>
          );
        })}
      </div>

      {/* Vertical Interactive Timeline Line */}
      <div className="relative border-r-2 md:border-r-0 md:border-l-2 border-neutral-200 pr-4 md:pr-0 md:pl-6 space-y-8" id="timeline-vertical-flow">
        {filteredEvents.map((evt, index) => (
          <div key={evt.id} className="relative group" id={`timeline-item-${evt.id}`}>
            {/* Timeline bullet dot */}
            <div className={`absolute top-1.5 ${isAr ? '-right-[25px]' : '-left-[33px]'} w-4 h-4 rounded-none bg-white border-4 border-black group-hover:bg-amber-400 group-hover:scale-125 transition-all duration-250 z-10`} />
            
            <div className="bg-neutral-50 border-2 border-black p-5 rounded-none hover:bg-white hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all flex flex-col md:flex-row gap-5 items-start">
              {/* Cover mini image */}
              <div className="w-full md:w-40 h-28 shrink-0 border border-black relative overflow-hidden bg-neutral-200">
                <img 
                  src={evt.cover} 
                  alt={evt.titleEn} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 bg-black text-white text-[8px] font-mono font-black px-1 border border-black uppercase italic">
                  {evt.season.toUpperCase()}
                </span>
              </div>

              {/* Main Info */}
              <div className="flex-grow space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 rounded-none border border-black uppercase">
                      {evt.studio}
                    </span>
                    <span className="text-[9px] font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 border border-amber-400">
                      {lang === 'ar' ? evt.statusAr : evt.statusEn}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-neutral-400">
                    #{index + 1}
                  </span>
                </div>

                <h4 className="font-sans font-black text-sm md:text-base text-black group-hover:text-amber-500 transition-colors">
                  {lang === 'ar' ? evt.titleAr : evt.titleEn}
                </h4>

                <p className="text-neutral-600 font-serif text-[11px] leading-relaxed max-w-2xl">
                  {lang === 'ar' ? evt.descAr : evt.descEn}
                </p>

                {/* Genre Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(lang === 'ar' ? evt.genresAr : evt.genresEn).map((g) => (
                    <span key={g} className="text-[9px] bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-none border border-neutral-300 font-bold">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
