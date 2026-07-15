/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Heart, Sparkles, Trophy, Star } from 'lucide-react';

interface Character {
  id: string;
  nameAr: string;
  nameEn: string;
  animeAr: string;
  animeEn: string;
  roleAr: string;
  roleEn: string;
  seiyuuAr: string;
  seiyuuEn: string;
  bioAr: string;
  bioEn: string;
  votes: number;
  cover: string;
}

export default function CharacterSpotlight({ lang }: { lang: 'ar' | 'en' }) {
  const isAr = lang === 'ar';
  const [characters, setCharacters] = useState<Character[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const defaultCharacters: Character[] = [
    {
      id: 'char-1',
      nameAr: 'مونكي دي لوفي (جير 5)',
      nameEn: 'Monkey D. Luffy (Gear 5)',
      animeAr: 'ون بيس (One Piece)',
      animeEn: 'One Piece',
      roleAr: 'قائد قراصنة قبعة القش - إله الشمس نيكا',
      roleEn: 'Straw Hat Captain - Sun God Nika',
      seiyuuAr: 'مايومي تاناكا',
      seiyuuEn: 'Mayumi Tanaka',
      bioAr: 'القرصان الطموح وصاحب الإيقاع المطاطي الأسطوري الذي حرر قوة نيكا الكاملة ليحارب بحرية مطلقة وضخ الضحك في ساحة النزال.',
      bioEn: 'The ambitious pirate who awakened the mythical zoan Sun God Nika, bringing rubbery cartoon freedom and laughter to the battlefields.',
      votes: 1240,
      cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=60',
    },
    {
      id: 'char-2',
      nameAr: 'غوجو ساتورو',
      nameEn: 'Gojo Satoru',
      animeAr: 'جوجوتسو كايسن (Jujutsu Kaisen)',
      animeEn: 'Jujutsu Kaisen',
      roleAr: 'الساحر الأقوى - حارس العيون الستة واللامتناهي',
      roleEn: 'The Strongest Sorcerer - Limitless & Six Eyes',
      seiyuuAr: 'يويتشي ناكامورا',
      seiyuuEn: 'Yuichi Nakamura',
      bioAr: 'الرجل الحامل لميزان قوى السحرة بالكامل. بعيونه الست وتقنية اللامتناهي، يعتبر جدار الدفاع المطلق وحامي جيل السحرة الجديد.',
      bioEn: 'The man who single-handedly balances the entire Jujutsu world. With his Six Eyes and Limitless void, he remains untouchable.',
      votes: 1198,
      cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=60',
    },
    {
      id: 'char-3',
      nameAr: 'سونغ جين وو',
      nameEn: 'Sung Jinwoo',
      animeAr: 'سولو ليفيلينغ (Solo Leveling)',
      animeEn: 'Solo Leveling',
      roleAr: 'ملك الظلال - أعظم صياد منفرد',
      roleEn: 'The Shadow Monarch - Ultimate Solo Hunter',
      seiyuuAr: 'بان تايتو',
      seiyuuEn: 'Taito Ban',
      bioAr: 'الصياد الذي ارتقى بمفرده من أدنى رتبة صيادي E-Rank ليتجاوز حدود النظام ويصبح مالكاً لقوى الظلال المروعة وجيش الموتى.',
      bioEn: 'The hunter who ascended from the absolute weakest E-Rank to a godlike Monarch capable of summoning massive shadow legions.',
      votes: 942,
      cover: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&auto=format&fit=crop&q=60',
    },
    {
      id: 'char-4',
      nameAr: 'رورونوا زورو',
      nameEn: 'Roronoa Zoro',
      animeAr: 'ون بيس (One Piece)',
      animeEn: 'One Piece',
      roleAr: 'اليد اليمنى للوفي - سياف الأسلوب الثلاثي',
      roleEn: 'Straw Hat First Mate - Santoryu Swordmaster',
      seiyuuAr: 'كازويا ناكاي',
      seiyuuEn: 'Kazuya Nakai',
      bioAr: 'المقاتل الأشرس ذو الكبرياء الصارم الذي يحمل ثلاثة سيوف ويسلك درب الجحيم لكي يصبح السياف الأعظم في العالم وفاءً بوعد طفولته.',
      bioEn: 'The iron-willed swordsman who fights using three swords, carving a path through hell to claim the title of world\'s strongest.',
      votes: 1089,
      cover: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=400&auto=format&fit=crop&q=60',
    }
  ];

  useEffect(() => {
    const savedChars = localStorage.getItem('just_anime_spotlight_characters');
    const savedVotes = localStorage.getItem('just_anime_spotlight_voted_ids');

    if (savedChars) {
      setCharacters(JSON.parse(savedChars));
    } else {
      setCharacters(defaultCharacters);
      localStorage.setItem('just_anime_spotlight_characters', JSON.stringify(defaultCharacters));
    }

    if (savedVotes) {
      setVotedIds(JSON.parse(savedVotes));
    }
  }, []);

  const handleVote = (id: string) => {
    if (votedIds.includes(id)) {
      // Undo vote
      const updatedVotes = votedIds.filter((vId) => vId !== id);
      const updatedChars = characters.map((c) => 
        c.id === id ? { ...c, votes: c.votes - 1 } : c
      );
      setVotedIds(updatedVotes);
      setCharacters(updatedChars);
      localStorage.setItem('just_anime_spotlight_voted_ids', JSON.stringify(updatedVotes));
      localStorage.setItem('just_anime_spotlight_characters', JSON.stringify(updatedChars));
    } else {
      // Add vote
      const updatedVotes = [...votedIds, id];
      const updatedChars = characters.map((c) => 
        c.id === id ? { ...c, votes: c.votes + 1 } : c
      );
      setVotedIds(updatedVotes);
      setCharacters(updatedChars);
      localStorage.setItem('just_anime_spotlight_voted_ids', JSON.stringify(updatedVotes));
      localStorage.setItem('just_anime_spotlight_characters', JSON.stringify(updatedChars));
    }
  };

  const sortedChars = [...characters].sort((a, b) => b.votes - a.votes);

  return (
    <section className="bg-white border-2 border-black p-6 rounded-none shadow-[4px_4px_0px_rgba(239,68,68,1)]" id="char-spotlight-section">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-black pb-4 mb-6 gap-3">
        <div>
          <span className="text-[10px] bg-red-500 text-white border border-black px-2.5 py-0.5 rounded-none font-mono font-black uppercase inline-block mb-1 italic">
            {isAr ? 'استفتاء الجمهور والنجومية' : 'POPULARITY STARS & VOTING'}
          </span>
          <h3 className="font-sans font-black text-lg text-black flex items-center gap-2">
            <Trophy className="w-5 h-5 text-black" />
            <span>{isAr ? 'نجوم ومحبوبي الأسبوع لعشاق الأنمي' : 'Anime Characters of the Week'}</span>
          </h3>
        </div>
        <span className="text-[9px] font-mono text-red-500 font-black bg-red-50 px-2 py-1 border border-black">
          {isAr ? 'تصويت الجمهور نشط' : 'FAN VOTING IS LIVE'}
        </span>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="spotlight-characters-grid">
        {sortedChars.map((char, index) => {
          const isVoted = votedIds.includes(char.id);
          return (
            <div 
              key={char.id} 
              className="border-2 border-black rounded-none p-4 flex flex-col sm:flex-row gap-4 bg-neutral-50 relative hover:bg-white hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
              id={`char-card-${char.id}`}
            >
              {/* Leaderboard crown/star index */}
              <div className="absolute top-2 left-2 bg-black text-white border border-black font-mono text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-none italic">
                {index === 0 ? <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : index + 1}
              </div>

              {/* Character Avatar */}
              <div className="w-24 h-24 shrink-0 border border-black rounded-none overflow-hidden bg-neutral-200 mx-auto sm:mx-0">
                <img 
                  src={char.cover} 
                  alt={char.nameEn} 
                  className="w-full h-full object-cover grayscale-xs hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Character Specs */}
              <div className="flex-grow space-y-1.5 min-w-0">
                <div>
                  <span className="text-[8px] bg-black text-white font-mono px-1.5 py-0.5 rounded-none inline-block uppercase italic">
                    {lang === 'ar' ? char.animeAr : char.animeEn}
                  </span>
                  <h4 className="font-sans font-black text-sm text-black truncate mt-1">
                    {lang === 'ar' ? char.nameAr : char.nameEn}
                  </h4>
                </div>

                <div className="text-[10px] text-neutral-500 leading-tight">
                  <strong className="text-black font-black">{isAr ? 'الدور: ' : 'Role: '}</strong>
                  <span>{lang === 'ar' ? char.roleAr : char.roleEn}</span>
                </div>

                <p className="text-neutral-600 font-serif text-[11px] leading-relaxed line-clamp-3">
                  {lang === 'ar' ? char.bioAr : char.bioEn}
                </p>

                {/* Voting actions */}
                <div className="flex items-center justify-between border-t border-neutral-200 pt-2.5 mt-2">
                  <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px]">
                    <span className="text-black font-black font-mono">{char.votes.toLocaleString()}</span>
                    <span>{isAr ? 'صوت' : 'votes'}</span>
                  </div>

                  <button
                    onClick={() => handleVote(char.id)}
                    className={`flex items-center gap-1.5 text-[10px] font-mono font-black px-3 py-1.5 rounded-none border border-black transition-all cursor-pointer ${
                      isVoted 
                        ? 'bg-red-500 text-white border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]' 
                        : 'bg-white text-black hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isVoted ? 'fill-white animate-bounce' : ''}`} />
                    <span>{isVoted ? (isAr ? 'تم التصويت' : 'Voted') : (isAr ? 'صوّت له' : 'Vote')}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
