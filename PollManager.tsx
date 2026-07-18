/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Plus, Trash2, Edit3, CheckCircle2, RotateCcw, X } from 'lucide-react';

interface PollManagerProps {
  lang: 'ar' | 'en';
}

interface PollOption {
  id: string;
  ar: string;
  en: string;
  votes: number;
}

export default function PollManager({ lang }: PollManagerProps) {
  const isAr = lang === 'ar';
  const [questionAr, setQuestionAr] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [options, setOptions] = useState<PollOption[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for managing options
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [optionAr, setOptionAr] = useState('');
  const [optionEn, setOptionEn] = useState('');
  const [optionVotes, setOptionVotes] = useState(0);

  const defaultOptions: PollOption[] = [
    { id: 'opt1', ar: 'ريميك أنمي ون بيس (THE ONE PIECE)', en: 'THE ONE PIECE Anime Remake (Wit Studio)', votes: 345 },
    { id: 'opt2', ar: 'الموسم الثالث من Solo Leveling', en: 'Solo Leveling Season 2', votes: 210 },
    { id: 'opt3', ar: 'فيلم قاتل الشياطين قلعة اللانهائية', en: 'Demon Slayer: Infinity Castle Movie Trilogy', votes: 412 },
    { id: 'opt4', ar: 'أنمي ممر كاجوراباتشي (Kagurabachi)', en: 'Kagurabachi Anime Adaptation', votes: 180 },
  ];

  const defaultQuestionAr = 'ما هو أكثر مشروع أنمي لعام 2026 تترقب عرضه بحماس شديد؟';
  const defaultQuestionEn = 'Which upcoming 2026 anime project are you most excited to watch?';

  useEffect(() => {
    // Load question and options
    const savedOptions = localStorage.getItem('just_anime_daily_poll_options');
    const savedQAr = localStorage.getItem('just_anime_daily_poll_question_ar') || defaultQuestionAr;
    const savedQEn = localStorage.getItem('just_anime_daily_poll_question_en') || defaultQuestionEn;

    setQuestionAr(savedQAr);
    setQuestionEn(savedQEn);

    if (savedOptions) {
      setOptions(JSON.parse(savedOptions));
    } else {
      setOptions(defaultOptions);
      localStorage.setItem('just_anime_daily_poll_options', JSON.stringify(defaultOptions));
    }
  }, []);

  const saveToStorage = (updatedOptions: PollOption[]) => {
    setOptions(updatedOptions);
    localStorage.setItem('just_anime_daily_poll_options', JSON.stringify(updatedOptions));
    // Trigger custom event for real-time update in widgets if needed
    window.dispatchEvent(new Event('just_anime_poll_updated'));
  };

  const handleUpdateQuestions = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem('just_anime_daily_poll_question_ar', questionAr);
    localStorage.setItem('just_anime_daily_poll_question_en', questionEn);
    
    setSuccessMsg(isAr ? 'تم حفظ وتحديث أسئلة الاستطلاع بنجاح!' : 'Poll questions successfully updated!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!optionAr || !optionEn) return;

    const entry: PollOption = {
      id: editId || `opt-${Date.now()}`,
      ar: optionAr,
      en: optionEn,
      votes: Number(optionVotes) || 0,
    };

    let updated: PollOption[] = [];
    if (editId) {
      updated = options.map((opt) => (opt.id === editId ? entry : opt));
      setSuccessMsg(isAr ? 'تم تعديل الخيار بنجاح!' : 'Option updated successfully!');
    } else {
      updated = [...options, entry];
      setSuccessMsg(isAr ? 'تم إضافة الخيار الجديد بنجاح!' : 'New option added successfully!');
    }

    saveToStorage(updated);
    resetForm();
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleEditOption = (option: PollOption) => {
    setEditId(option.id);
    setOptionAr(option.ar);
    setOptionEn(option.en);
    setOptionVotes(option.votes);
    setFormOpen(true);
  };

  const handleDeleteOption = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الخيار؟' : 'Are you sure you want to delete this option?')) return;
    const updated = options.filter((opt) => opt.id !== id);
    saveToStorage(updated);
    setSuccessMsg(isAr ? 'تم حذف الخيار.' : 'Option deleted.');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const handleResetVotes = () => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من تصفير وإعادة ضبط كافة أصوات هذا الاستطلاع؟' : 'Are you sure you want to reset all votes for this poll?')) return;
    const updated = options.map((opt) => ({ ...opt, votes: 0 }));
    saveToStorage(updated);
    localStorage.removeItem('just_anime_daily_poll_vote'); // Clear user's vote state so they can vote again
    setSuccessMsg(isAr ? 'تم تصفير الأصوات بنجاح وتمكين التصويت مجدداً!' : 'Votes successfully reset and voting re-enabled!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  const resetForm = () => {
    setEditId(null);
    setOptionAr('');
    setOptionEn('');
    setOptionVotes(0);
    setFormOpen(false);
  };

  const totalVotes = options.reduce((acc, curr) => acc + curr.votes, 0);

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]" id="poll-manager-panel">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-black flex items-center gap-2 uppercase tracking-wide">
            <BarChart3 className="w-6 h-6 text-black" />
            <span>{isAr ? 'إدارة الاستطلاع اليومي للأوتاكو' : 'Daily Otaku Poll Manager'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {isAr 
              ? `تدير حالياً ${options.length} خيارات تصويت بنسبة إجمالية لـ ${totalVotes} صوت` 
              : `Currently managing ${options.length} options with a total of ${totalVotes} votes`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleResetVotes}
            className="flex-1 sm:flex-initial bg-white hover:bg-neutral-50 text-black font-sans text-xs font-bold uppercase px-4 py-3 border-2 border-black rounded-none flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isAr ? 'إعادة ضبط الأصوات' : 'Reset All Votes'}</span>
          </button>
          
          {!formOpen && (
            <button
              onClick={() => setFormOpen(true)}
              className="flex-1 sm:flex-initial bg-black hover:bg-neutral-800 text-white font-sans text-xs font-black uppercase tracking-widest px-4 py-3 border-2 border-black rounded-none flex items-center justify-center gap-1.5 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(245,158,11,1)] cursor-pointer"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>{isAr ? 'إضافة خيار جديد' : 'Add Choice'}</span>
            </button>
          )}
        </div>
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

      {/* QUESTION EDITING SECTION */}
      <div className="bg-neutral-50 border-2 border-black p-5 rounded-none mb-6">
        <h4 className="font-sans font-black text-xs text-black uppercase mb-3 border-b border-neutral-200 pb-2">
          {isAr ? '📝 سؤال وجذر الاستطلاع الحالي' : '📝 EDIT CURRENT POLL QUESTION'}
        </h4>

        <form onSubmit={handleUpdateQuestions} className="space-y-4 text-xs font-bold font-sans text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={isAr ? 'text-right' : 'text-left'}>
              <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'السؤال بالعربية' : 'Question (Arabic)'}</label>
              <input
                type="text"
                required
                value={questionAr}
                onChange={(e) => setQuestionAr(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
              />
            </div>

            <div className={isAr ? 'text-right' : 'text-left'}>
              <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'السؤال بالإنجليزية' : 'Question (English)'}</label>
              <input
                type="text"
                required
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white border border-black px-5 py-2.5 text-xs font-black uppercase rounded-none cursor-pointer transition-colors"
            >
              {isAr ? 'تحديث السؤال' : 'Update Question'}
            </button>
          </div>
        </form>
      </div>

      {/* FORM: ADD OR EDIT POLL OPTION */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-2 border-black bg-neutral-100 rounded-none mb-6"
          id="poll-option-form"
        >
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
            <h4 className="font-sans font-black text-sm text-black">
              {editId ? (isAr ? 'تعديل خيار استطلاع' : 'Edit Poll Option') : (isAr ? 'إضافة خيار استطلاع جديد' : 'Create New Option')}
            </h4>
            <button
              onClick={resetForm}
              className="p-1 border border-black rounded-none hover:bg-neutral-200 cursor-pointer"
            >
              <X className="w-4.5 h-4.5 text-black" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-bold font-sans text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'الخيار بالعربية' : 'Choice Text (Arabic)'}</label>
                <input
                  type="text"
                  required
                  value={optionAr}
                  onChange={(e) => setOptionAr(e.target.value)}
                  placeholder={isAr ? 'مثال: فيلم بليتش القادم...' : 'e.g. Next Bleach Movie...'}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'الخيار بالإنجليزية' : 'Choice Text (English)'}</label>
                <input
                  type="text"
                  required
                  value={optionEn}
                  onChange={(e) => setOptionEn(e.target.value)}
                  placeholder="e.g. Upcoming Bleach Movie..."
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              <div className={`md:col-span-2 ${isAr ? 'text-right' : 'text-left'}`}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'عدد الأصوات الافتراضي (Seed Votes)' : 'Current Votes Count'}</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={optionVotes}
                  onChange={(e) => setOptionVotes(Number(e.target.value))}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-300 pt-3">
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
                {editId ? (isAr ? 'تعديل الخيار' : 'Save Option') : (isAr ? 'إضافة الخيار' : 'Add Option')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* OPTIONS LIST TABLE */}
      <div className="overflow-x-auto border-2 border-black rounded-none" id="poll-options-table-container">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-black text-white text-[10px] sm:text-xs font-black uppercase border-b-2 border-black font-sans">
              <th className={`p-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الخيار بالعربية' : 'Choice (Arabic)'}</th>
              <th className={`p-3.5 ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الخيار بالإنجليزية' : 'Choice (English)'}</th>
              <th className="p-3.5 text-center">{isAr ? 'عدد الأصوات المجمعة' : 'Votes Count'}</th>
              <th className="p-3.5 text-center">{isAr ? 'النسبة التقريبية' : 'Percentage'}</th>
              <th className="p-3.5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {options.map((option) => {
              const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
              return (
                <tr key={option.id} className="hover:bg-neutral-50/50 transition-colors text-xs" id={`poll-row-${option.id}`}>
                  <td className="p-3.5 font-sans font-bold text-black">{option.ar}</td>
                  <td className="p-3.5 font-sans font-semibold text-neutral-600">{option.en}</td>
                  <td className="p-3.5 font-mono text-center font-black">{option.votes.toLocaleString()}</td>
                  <td className="p-3.5 text-center">
                    <span className="bg-neutral-100 border border-black px-2 py-0.5 font-mono font-black text-[10px]">
                      {percentage}%
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditOption(option)}
                        className="p-1 border border-black hover:bg-neutral-100 rounded-none text-black cursor-pointer shadow-xs"
                        title={isAr ? 'تعديل' : 'Edit'}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteOption(option.id)}
                        className="p-1 border border-black hover:bg-red-50 hover:text-red-600 hover:border-red-600 rounded-none text-neutral-600 cursor-pointer shadow-xs"
                        title={isAr ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
