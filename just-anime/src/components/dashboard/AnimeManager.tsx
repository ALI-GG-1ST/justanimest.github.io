/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Plus, Search, Trash2, Edit3, Flame, Film, CheckCircle2, X } from 'lucide-react';

interface AnimeManagerProps {
  lang: 'ar' | 'en';
}

interface AnimeSeries {
  id: string;
  titleAr: string;
  titleEn: string;
  studio: string;
  episodes: number;
  year: number;
  rating: number;
  status: 'airing' | 'finished' | 'upcoming';
  synopsisAr: string;
  synopsisEn: string;
  coverImage: string;
}

export default function AnimeManager({ lang }: AnimeManagerProps) {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [animes, setAnimes] = useState<AnimeSeries[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Fields state
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [studio, setStudio] = useState('');
  const [episodes, setEpisodes] = useState<number>(12);
  const [year, setYear] = useState<number>(2026);
  const [rating, setRating] = useState<number>(8.5);
  const [status, setStatus] = useState<'airing' | 'finished' | 'upcoming'>('airing');
  const [synopsisAr, setSynopsisAr] = useState('');
  const [synopsisEn, setSynopsisEn] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const defaultAnimeList: AnimeSeries[] = [
    {
      id: 'anime-op',
      titleAr: 'ون بيس (One Piece)',
      titleEn: 'One Piece',
      studio: 'Toei Animation',
      episodes: 1120,
      year: 1999,
      rating: 9.7,
      status: 'airing',
      synopsisAr: 'مغامرات لوفي وطاقمه من أجل العثور على الكنز الأسطوري ون بيس ليصبح ملك القراصنة.',
      synopsisEn: 'Monkey D. Luffy and his crew sail the oceans in search of the legendary One Piece treasure.',
      coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'anime-ds',
      titleAr: 'قاتل الشياطين (Demon Slayer)',
      titleEn: 'Demon Slayer',
      studio: 'ufotable',
      episodes: 55,
      year: 2019,
      rating: 9.2,
      status: 'finished',
      synopsisAr: 'تانجيرو يشرع في رحلة دموية ليصبح قاتل شياطين من أجل إنقاذ شقيقته الصغرى نيزوكو.',
      synopsisEn: 'Tanjiro Kamado sets off on a journey to become a demon slayer and restore his sister Nezuko to human form.',
      coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop',
    },
    {
      id: 'anime-sl',
      titleAr: 'سولو ليفيلينغ (Solo Leveling)',
      titleEn: 'Solo Leveling',
      studio: 'A-1 Pictures',
      episodes: 24,
      year: 2024,
      rating: 8.9,
      status: 'airing',
      synopsisAr: 'أضعف صياد بشري يحصل على قدرة سرية تتيح له زيادة مستواه بلا حدود وتحقيق قوى خيالية.',
      synopsisEn: 'The weakest hunter of humanity gains a secret capability that allows him to level up endlessly.',
      coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop',
    },
  ];

  // Load and save
  useEffect(() => {
    const saved = localStorage.getItem('just_anime_dictionary');
    if (saved) {
      setAnimes(JSON.parse(saved));
    } else {
      setAnimes(defaultAnimeList);
      localStorage.setItem('just_anime_dictionary', JSON.stringify(defaultAnimeList));
    }
  }, []);

  const saveToStorage = (updatedList: AnimeSeries[]) => {
    setAnimes(updatedList);
    localStorage.setItem('just_anime_dictionary', JSON.stringify(updatedList));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    const entry: AnimeSeries = {
      id: editId || `anime-${Date.now()}`,
      titleAr: titleAr || titleEn,
      titleEn: titleEn || titleAr,
      studio: studio || 'Unknown Studio',
      episodes: Number(episodes) || 12,
      year: Number(year) || 2026,
      rating: Number(rating) || 8.0,
      status,
      synopsisAr,
      synopsisEn,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop',
    };

    let updated: AnimeSeries[] = [];
    if (editId) {
      updated = animes.map((a) => (a.id === editId ? entry : a));
      setSuccessMessage(isAr ? 'تم تعديل بيانات السلسلة بنجاح!' : 'Anime series updated successfully!');
    } else {
      updated = [entry, ...animes];
      setSuccessMessage(isAr ? 'تم إضافة الأنمي الجديد للقاموس بنجاح!' : 'New Anime series added to encyclopedia!');
    }

    saveToStorage(updated);
    resetForm();

    setTimeout(() => {
      setSuccessMessage('');
    }, 1500);
  };

  const handleTriggerEdit = (anime: AnimeSeries) => {
    setEditId(anime.id);
    setTitleAr(anime.titleAr);
    setTitleEn(anime.titleEn);
    setStudio(anime.studio);
    setEpisodes(anime.episodes);
    setYear(anime.year);
    setRating(anime.rating);
    setStatus(anime.status);
    setSynopsisAr(anime.synopsisAr);
    setSynopsisEn(anime.synopsisEn);
    setCoverImage(anime.coverImage);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من رغبتك في حذف هذا العمل؟' : 'Are you sure you want to delete this anime?')) return;
    const updated = animes.filter((a) => a.id !== id);
    saveToStorage(updated);
    setSuccessMessage(isAr ? 'تم حذف السلسلة بنجاح.' : 'Anime series deleted.');
    setTimeout(() => setSuccessMessage(''), 1500);
  };

  const resetForm = () => {
    setEditId(null);
    setTitleAr('');
    setTitleEn('');
    setStudio('');
    setEpisodes(12);
    setYear(2026);
    setRating(8.5);
    setStatus('airing');
    setSynopsisAr('');
    setSynopsisEn('');
    setCoverImage('');
    setFormOpen(false);
  };

  const filtered = animes.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.titleAr.toLowerCase().includes(q) ||
      a.titleEn.toLowerCase().includes(q) ||
      a.studio.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]" id="anime-manager-component">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-black flex items-center gap-2 uppercase tracking-wide">
            <BookOpen className="w-6 h-6 text-black" />
            <span>{isAr ? 'قاموس سلاسل وأعمال الأنمي' : 'Anime Franchise Encyclopedia'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {isAr 
              ? `تدير حالياً معلومات وتفاصيل لـ ${animes.length} سلسلة أنمي مختلفة` 
              : `Currently managing entries for ${animes.length} anime franchises`}
          </p>
        </div>

        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white font-sans text-xs font-black uppercase tracking-widest px-6 py-3 border-2 border-black rounded-none flex items-center justify-center gap-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(245,158,11,1)] cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5 text-white" />
            <span>{isAr ? 'إضافة أنمي جديد' : 'Add Anime Series'}</span>
          </button>
        )}
      </div>

      {/* Dynamic alerts feedback */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-emerald-500 text-white border-2 border-black p-4 rounded-none mb-6 flex items-center gap-2.5 font-sans font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] text-xs"
          >
            <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORM OVERLAY DRAWER */}
      {formOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 border-2 border-black bg-neutral-50 rounded-none mb-6"
          id="anime-create-form"
        >
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-5">
            <h4 className="font-sans font-black text-sm text-black">
              {editId ? (isAr ? 'تعديل بيانات سلسلة أنمي' : 'Modify Anime details') : (isAr ? 'إضافة سلسلة أنمي جديدة' : 'Add New Franchise Entry')}
            </h4>
            <button
              onClick={resetForm}
              className="p-1 border border-black rounded-none hover:bg-neutral-100 cursor-pointer"
            >
              <X className="w-4.5 h-4.5 text-black" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold font-sans text-black">
              {/* Title Ar */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'الاسم بالعربية' : 'Title (Arabic)'}</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ون بيس..."
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
                  placeholder="e.g. One Piece..."
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Studio */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'استوديو الإنتاج' : 'Animation Studio'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toei Animation, Wit Studio..."
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Cover image */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'رابط صورة الغلاف الفنية' : 'Cover Art URL'}</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>

              {/* Stats group row */}
              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div>
                  <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'عدد الحلقات' : 'Episodes'}</label>
                  <input
                    type="number"
                    value={episodes}
                    onChange={(e) => setEpisodes(Number(e.target.value))}
                    className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'سنة البث الأولى' : 'Release Year'}</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'التقييم العالمي' : 'Global Score'}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status */}
              <div className={`md:col-span-2 ${isAr ? 'text-right' : 'text-left'}`}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'حالة العمل والموسم الحالي' : 'Broadcast Status'}</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'airing' | 'finished' | 'upcoming')}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none font-black cursor-pointer"
                >
                  <option value="airing">{isAr ? 'يعرض الآن 🔴' : 'Airing Now 🔴'}</option>
                  <option value="finished">{isAr ? 'مكتمل البث ⏳' : 'Finished'}</option>
                  <option value="upcoming">{isAr ? 'قريباً في المواسم القادمة ⏳' : 'Upcoming'}</option>
                </select>
              </div>

              {/* Synopsis Ar */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'نبذة مختصرة (بالعربية)' : 'Synopsis (Arabic)'}</label>
                <textarea
                  rows={3}
                  value={synopsisAr}
                  onChange={(e) => setSynopsisAr(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none font-sans font-bold"
                />
              </div>

              {/* Synopsis En */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1">{isAr ? 'نبذة مختصرة (بالإنجليزية)' : 'Synopsis (English)'}</label>
                <textarea
                  rows={3}
                  value={synopsisEn}
                  onChange={(e) => setSynopsisEn(e.target.value)}
                  className="w-full bg-white border-2 border-black rounded-none p-2.5 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
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
                {editId ? (isAr ? 'حفظ التعديلات' : 'Save') : (isAr ? 'إضافة للقاموس' : 'Add')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* FILTER SEARCH FIELD */}
      {!formOpen && (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder={isAr ? 'بحث سريع عن سلسلة أنمي في القاموس أو الاستوديو...' : 'Search anime series by title or studio...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-50 hover:bg-neutral-100/50 border-2 border-black rounded-none text-xs px-10 py-3.5 focus:outline-none focus:bg-white font-sans font-bold text-black"
            />
            <Search className={`absolute top-4.5 w-4.5 h-4.5 text-black ${isAr ? 'right-3.5' : 'left-3.5'}`} />
          </div>

          {/* Cards list grid of Anime entries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="anime-entries-grid">
            {filtered.map((anime) => (
              <motion.div
                key={anime.id}
                layout
                className="bg-white border-2 border-black p-4 rounded-none flex gap-3 relative group overflow-hidden hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                id={`anime-dictionary-card-${anime.id}`}
              >
                {/* Thumb */}
                <div className="w-20 h-24 bg-neutral-100 border border-black rounded-none overflow-hidden shrink-0">
                  <img src={anime.coverImage} className="w-full h-full object-cover group-hover:scale-101 transition-all" />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h4 className="font-sans font-black text-xs sm:text-sm text-black truncate leading-tight">
                        {isAr ? anime.titleAr : anime.titleEn}
                      </h4>
                      {anime.status === 'airing' && (
                        <span className="bg-red-600 text-white text-[8px] font-black px-1 py-0.5 rounded-none shrink-0 border border-black animate-pulse">
                          {isAr ? 'يبث الآن' : 'AIRING'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono block uppercase mt-0.5">
                      {anime.studio} • {anime.year}
                    </span>
                    <p className="text-[10px] text-neutral-600 font-sans mt-1 line-clamp-2 leading-snug">
                      {isAr ? anime.synopsisAr : anime.synopsisEn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-2 mt-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-neutral-500 uppercase">
                      <span>{anime.episodes} {isAr ? 'حلقة' : 'episodes'}</span>
                      <span>•</span>
                      <span className="text-black font-black">⭐ {anime.rating}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTriggerEdit(anime)}
                        className="p-1 border border-black hover:bg-neutral-100 rounded-none text-black cursor-pointer shadow-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(anime.id)}
                        className="p-1 border border-black hover:bg-red-50 hover:text-red-600 hover:border-red-600 rounded-none text-neutral-600 cursor-pointer shadow-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
