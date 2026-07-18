/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sword, Zap, ShieldAlert, Award } from 'lucide-react';

interface Battle {
  id: string;
  char1Ar: string;
  char1En: string;
  char2Ar: string;
  char2En: string;
  anime1Ar: string;
  anime1En: string;
  anime2Ar: string;
  anime2En: string;
  power1Ar: string;
  power1En: string;
  power2Ar: string;
  power2En: string;
  votes1: number;
  votes2: number;
  statusAr: string;
  statusEn: string;
}

export default function VersusArena({ lang }: { lang: 'ar' | 'en' }) {
  const isAr = lang === 'ar';
  const [battles, setBattles] = useState<Battle[]>([]);
  const [userVotedIds, setUserVotedIds] = useState<Record<string, 'left' | 'right'>>({});

  const defaultBattles: Battle[] = [
    {
      id: 'vs-1',
      char1Ar: 'لوفي (طور نيكا الإلهي)',
      char1En: 'Luffy (Sun God Nika)',
      char2Ar: 'سوكونا (ملك اللعنات)',
      char2En: 'Ryomen Sukuna (King of Curses)',
      anime1Ar: 'ون بيس',
      anime1En: 'One Piece',
      anime2Ar: 'جوجوتسو كايسن',
      anime2En: 'Jujutsu Kaisen',
      power1Ar: 'التلاعب الكرتوني بالواقع، الهاكي الملكي والخصائص المطاطية المطلقة للجسد والبيئة.',
      power1En: 'Cartoon physics, complete environmental rubberization, and advanced Conqueror\'s Haki.',
      power2Ar: 'تقنية الضريح، الفتحة السوداء والرماد، الحركات السريعة الفائقة وتقطيع الفراغ المطلق.',
      power2En: 'Shrine slash, Divine Flame, domain expansion: Malevolent Shrine, and world-bisecting slashes.',
      votes1: 4210,
      votes2: 3845,
      statusAr: 'نزال متقارب جداً',
      statusEn: 'Extremely Close Matchup',
    },
    {
      id: 'vs-2',
      char1Ar: 'سونغ جين وو (ملك الظلال)',
      char1En: 'Sung Jinwoo (Shadow Monarch)',
      char2Ar: 'سايتاما (رجل اللكمة الواحدة)',
      char2En: 'Saitama (One Punch Man)',
      anime1Ar: 'سولو ليفيلينغ',
      anime1En: 'Solo Leveling',
      anime2Ar: 'رجل اللكمة الواحدة',
      anime2En: 'One Punch Man',
      power1Ar: 'استدعاء جيوش الموتى المتجددة، التلاعب بأبواق الموت والسرعة والخلود النسبي للجنود.',
      power1En: 'Infinite resurrection of shadow armies, dimensional warping, absolute domain of death.',
      power2Ar: 'القوة البدنية الكونية التي تكسر حدود الطبيعة بلكمة واحدة مباشرة تنهي المجرات.',
      power2En: 'Boundless physical strength, speed, and durability, capable of destroying stars with a single serious punch.',
      votes1: 2950,
      votes2: 5410,
      statusAr: 'سايتاما يتقدم بالتصويت',
      statusEn: 'Saitama leading the poll',
    }
  ];

  useEffect(() => {
    const savedBattles = localStorage.getItem('just_anime_versus_battles_list');
    const savedVotes = localStorage.getItem('just_anime_versus_user_votes');

    if (savedBattles) {
      setBattles(JSON.parse(savedBattles));
    } else {
      setBattles(defaultBattles);
      localStorage.setItem('just_anime_versus_battles_list', JSON.stringify(defaultBattles));
    }

    if (savedVotes) {
      setUserVotedIds(JSON.parse(savedVotes));
    }
  }, []);

  const handleCastVote = (battleId: string, side: 'left' | 'right') => {
    const currentVote = userVotedIds[battleId];
    if (currentVote) return; // Cannot re-vote once cast

    const updatedBattles = battles.map((b) => {
      if (b.id === battleId) {
        return {
          ...b,
          votes1: side === 'left' ? b.votes1 + 1 : b.votes1,
          votes2: side === 'right' ? b.votes2 + 1 : b.votes2,
        };
      }
      return b;
    });

    const updatedUserVotes = {
      ...userVotedIds,
      [battleId]: side,
    };

    setBattles(updatedBattles);
    setUserVotedIds(updatedUserVotes);
    localStorage.setItem('just_anime_versus_battles_list', JSON.stringify(updatedBattles));
    localStorage.setItem('just_anime_versus_user_votes', JSON.stringify(updatedUserVotes));
  };

  return (
    <section className="bg-white border-2 border-black p-6 rounded-none shadow-[4px_4px_0px_rgba(245,158,11,1)]" id="versus-arena-section">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-black pb-4 mb-6 gap-3">
        <div>
          <span className="text-[10px] bg-black text-white border border-black px-2.5 py-0.5 rounded-none font-mono font-black uppercase inline-block mb-1 italic">
            {isAr ? 'حلبة نقاش ومقارنات القوة' : 'POWER SCALING & VERSUS DUELS'}
          </span>
          <h3 className="font-sans font-black text-lg text-black flex items-center gap-2">
            <Sword className="w-5 h-5 text-black animate-spin-slow" />
            <span>{isAr ? 'حلبة مبارزات وتحديات الأوتـاكـو الأقوى' : 'Interactive Anime Versus Duel Arena'}</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono font-black text-amber-600 bg-amber-50 border border-amber-400 px-2 py-1">
          <Award className="w-3.5 h-3.5" />
          <span>{isAr ? 'حسابات حقيقية للمستويات' : 'REAL PERSISTENT VOTE STATS'}</span>
        </div>
      </div>

      {/* Arena Content Cards */}
      <div className="space-y-8" id="versus-duels-wrapper">
        {battles.map((b) => {
          const totalVotes = b.votes1 + b.votes2;
          const pct1 = totalVotes > 0 ? Math.round((b.votes1 / totalVotes) * 100) : 50;
          const pct2 = totalVotes > 0 ? Math.round((b.votes2 / totalVotes) * 100) : 50;
          const userVote = userVotedIds[b.id];

          return (
            <div 
              key={b.id} 
              className="border-2 border-black rounded-none p-5 bg-neutral-50"
              id={`duel-card-${b.id}`}
            >
              {/* VS Header Tag */}
              <div className="flex justify-center mb-4">
                <span className="bg-black text-white font-mono text-xs font-black px-3.5 py-1 rounded-none border-2 border-black shadow-[2px_2px_0px_rgba(245,158,11,1)] uppercase italic">
                  {isAr ? 'مواجهة كبرى' : 'TITAN CLASH'}
                </span>
              </div>

              {/* Characters Versus Flex Layout */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                
                {/* Character 1 (Left) */}
                <div className="md:col-span-3 text-center space-y-2 p-3 bg-white border border-black">
                  <span className="text-[8px] bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded-none border border-neutral-300">
                    {lang === 'ar' ? b.anime1Ar : b.anime1En}
                  </span>
                  <h4 className="font-sans font-black text-sm text-black">
                    {lang === 'ar' ? b.char1Ar : b.char1En}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-serif leading-tight">
                    {lang === 'ar' ? b.power1Ar : b.power1En}
                  </p>
                  
                  {/* Left vote button */}
                  <div className="pt-2">
                    <button
                      disabled={!!userVote}
                      onClick={() => handleCastVote(b.id, 'left')}
                      className={`w-full text-xs font-mono font-black py-2 rounded-none border-2 transition-all ${
                        userVote === 'left'
                          ? 'bg-amber-400 text-black border-black font-black'
                          : userVote
                          ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                          : 'bg-white text-black border-black hover:bg-neutral-50 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]'
                      }`}
                    >
                      {userVote === 'left' ? (isAr ? 'صوّتت له' : 'Your Choice') : (isAr ? 'انتصار الأيسر' : 'Vote Left')}
                    </button>
                  </div>
                </div>

                {/* VS Circle Center (Middle) */}
                <div className="md:col-span-1 text-center flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-none bg-black text-white font-mono font-black text-xs flex items-center justify-center border-2 border-black rotate-45 select-none shadow-[2px_2px_0px_rgba(239,68,68,1)]">
                    <span className="-rotate-45">VS</span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 font-black mt-4 block">
                    {totalVotes.toLocaleString()} {isAr ? 'أصوات' : 'votes'}
                  </span>
                </div>

                {/* Character 2 (Right) */}
                <div className="md:col-span-3 text-center space-y-2 p-3 bg-white border border-black">
                  <span className="text-[8px] bg-neutral-100 text-neutral-800 font-bold px-2 py-0.5 rounded-none border border-neutral-300">
                    {lang === 'ar' ? b.anime2Ar : b.anime2En}
                  </span>
                  <h4 className="font-sans font-black text-sm text-black">
                    {lang === 'ar' ? b.char2Ar : b.char2En}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-serif leading-tight">
                    {lang === 'ar' ? b.power2Ar : b.power2En}
                  </p>
                  
                  {/* Right vote button */}
                  <div className="pt-2">
                    <button
                      disabled={!!userVote}
                      onClick={() => handleCastVote(b.id, 'right')}
                      className={`w-full text-xs font-mono font-black py-2 rounded-none border-2 transition-all ${
                        userVote === 'right'
                          ? 'bg-amber-400 text-black border-black font-black'
                          : userVote
                          ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                          : 'bg-white text-black border-black hover:bg-neutral-50 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[1px]'
                      }`}
                    >
                      {userVote === 'right' ? (isAr ? 'صوّتت له' : 'Your Choice') : (isAr ? 'انتصار الأيمن' : 'Vote Right')}
                    </button>
                  </div>
                </div>

              </div>

              {/* Progress Bar of votes */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-black uppercase text-neutral-700">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{pct1}%</span>
                  </span>
                  <span className="text-[9px] bg-neutral-200 px-2 py-0.5 border border-neutral-300 text-neutral-500 font-sans font-bold">
                    {lang === 'ar' ? b.statusAr : b.statusEn}
                  </span>
                  <span>{pct2}%</span>
                </div>
                
                {/* Double Bar */}
                <div className="h-5 bg-neutral-200 border-2 border-black rounded-none flex overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 border-l-2 border-black transition-all duration-500"
                    style={{ width: `${pct1}%` }}
                  />
                  <div 
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${pct2}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
