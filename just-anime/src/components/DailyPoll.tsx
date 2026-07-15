/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Check } from 'lucide-react';
import { translations } from '../translations';

interface DailyPollProps {
  lang: 'ar' | 'en';
}

interface PollOption {
  id: string;
  ar: string;
  en: string;
  votes: number;
}

export default function DailyPoll({ lang }: DailyPollProps) {
  const t = translations[lang];
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);

  const defaultOptions: PollOption[] = [
    { id: 'opt1', ar: 'ريميك أنمي ون بيس (THE ONE PIECE)', en: 'THE ONE PIECE Anime Remake (Wit Studio)', votes: 345 },
    { id: 'opt2', ar: 'الموسم الثالث من Solo Leveling', en: 'Solo Leveling Season 2', votes: 210 },
    { id: 'opt3', ar: 'فيلم قاتل الشياطين قلعة اللانهائية', en: 'Demon Slayer: Infinity Castle Movie Trilogy', votes: 412 },
    { id: 'opt4', ar: 'أنمي ممر كاجوراباتشي (Kagurabachi)', en: 'Kagurabachi Anime Adaptation', votes: 180 },
  ];

  useEffect(() => {
    // Check if user has voted on this poll
    const savedVote = localStorage.getItem('just_anime_daily_poll_vote');
    const savedOptions = localStorage.getItem('just_anime_daily_poll_options');

    if (savedOptions) {
      setPollOptions(JSON.parse(savedOptions));
    } else {
      setPollOptions(defaultOptions);
      localStorage.setItem('just_anime_daily_poll_options', JSON.stringify(defaultOptions));
    }

    if (savedVote) {
      setSelectedOptionId(savedVote);
      setVoted(true);
    }
  }, []);

  const handleVote = (optionId: string) => {
    if (voted) return;

    const updatedOptions = pollOptions.map((opt) => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    setPollOptions(updatedOptions);
    setSelectedOptionId(optionId);
    setVoted(true);

    localStorage.setItem('just_anime_daily_poll_vote', optionId);
    localStorage.setItem('just_anime_daily_poll_options', JSON.stringify(updatedOptions));
  };

  const totalVotes = pollOptions.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-xs" id="daily-otaku-poll">
      {/* Title block */}
      <h3 className="font-sans font-black text-lg text-black border-b-2 border-black pb-3 mb-4 flex items-center gap-2 uppercase tracking-wide">
        <BarChart3 className="w-5 h-5 text-black" />
        <span>{t.pollTitle}</span>
      </h3>

      {/* Question */}
      <p className="text-black text-sm font-black mb-4 leading-snug font-sans">
        {t.pollQuestion}
      </p>

      {/* Options */}
      <div className="space-y-3" id="poll-options-list">
        {pollOptions.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const isSelected = selectedOptionId === option.id;

          return (
            <div key={option.id} className="relative" id={`poll-option-container-${option.id}`}>
              {voted ? (
                /* Voted State (Results view) */
                <div 
                  className={`w-full bg-neutral-50 border-2 border-black p-3 rounded-none relative overflow-hidden flex items-center justify-between text-xs font-bold transition-all ${
                    isSelected ? 'bg-neutral-100 font-black' : ''
                  }`}
                  id={`poll-voted-${option.id}`}
                >
                  {/* Dynamic percentage fill background */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`absolute inset-y-0 left-0 ${lang === 'ar' ? 'right-0 left-auto' : 'left-0'} bg-neutral-200/60 z-0`}
                  />

                  {/* Option Text and Check indicator */}
                  <span className="relative z-10 flex items-center gap-1.5 max-w-[80%] truncate text-neutral-800">
                    {isSelected && <Check className="w-4 h-4 text-black stroke-[3px]" />}
                    <span>{lang === 'ar' ? option.ar : option.en}</span>
                  </span>

                  {/* Percentage score */}
                  <span className="relative z-10 font-mono text-black font-black bg-white px-1.5 py-0.5 border border-black text-[10px]">
                    {percentage}%
                  </span>
                </div>
              ) : (
                /* Voting Interactive State */
                <button
                  onClick={() => handleVote(option.id)}
                  className="w-full text-right bg-white hover:bg-neutral-50 border-2 border-black p-3.5 rounded-none text-xs font-bold transition-all duration-200 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none flex items-center justify-between cursor-pointer group"
                  id={`poll-vote-btn-${option.id}`}
                >
                  <span className={`group-hover:line-through ${lang === 'ar' ? 'text-right' : 'text-left'} w-full`}>
                    {lang === 'ar' ? option.ar : option.en}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer statistics */}
      {voted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center justify-between text-[10px] text-neutral-400 font-mono uppercase font-black"
          id="poll-stats"
        >
          <span>{t.pollVotedAlready}</span>
          <span>
            {totalVotes.toLocaleString()} {lang === 'ar' ? 'صوت إجمالي' : 'total votes'}
          </span>
        </motion.div>
      )}
    </div>
  );
}
