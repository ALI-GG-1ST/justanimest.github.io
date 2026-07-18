/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Save, CheckCircle2, ShieldAlert, Globe, Palette, Mail } from 'lucide-react';

interface SettingsManagerProps {
  lang: 'ar' | 'en';
}

interface SiteSettings {
  siteName: string;
  siteSlogan: string;
  logoUrl: string;
  colorTheme: 'red' | 'amber' | 'pink' | 'emerald';
  seoKeywords: string;
  permalinkStructure: 'post-id' | 'post-name' | 'category-post';
  enableEmailAlerts: boolean;
  moderationFirst: boolean;
}

export default function SettingsManager({ lang }: SettingsManagerProps) {
  const isAr = lang === 'ar';
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'جاّست أنمي | Just Anime',
    siteSlogan: 'بوابتك الإخبارية الشاملة لعالم الأنمي والمانجا',
    logoUrl: '',
    colorTheme: 'amber',
    seoKeywords: 'أخبار أنمي, تسريبات مانجا, مراجعات أنميات',
    permalinkStructure: 'post-name',
    enableEmailAlerts: true,
    moderationFirst: true,
  });

  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('just_anime_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    localStorage.setItem('just_anime_settings', JSON.stringify(settings));
    
    // Broadcast custom event so other components (or App.tsx) can update primary color styles if needed
    window.dispatchEvent(new Event('just_anime_settings_updated'));

    setSuccessMsg(isAr ? 'تم حفظ كافة إعدادات وتخصيصات الموقع بنجاح!' : 'All site configurations saved successfully!');
    setTimeout(() => setSuccessMsg(''), 1500);
  };

  return (
    <div className="bg-white border-2 border-black rounded-none p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]" id="settings-manager-component">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-4 border-black pb-4 mb-6 gap-4">
        <div>
          <h3 className="font-sans font-black text-xl text-black flex items-center gap-2 uppercase tracking-wide">
            <Settings className="w-6 h-6 text-black" />
            <span>{isAr ? 'إعدادات المنصة وتخصيص المظهر' : 'Site Configuration & Design Theme'}</span>
          </h3>
          <p className="text-xs text-neutral-500 font-sans mt-1">
            {isAr 
              ? 'تعديل الإعدادات الأساسية، قواعد الأرشفة والسيو ومفاتيح المظهر' 
              : 'Modify system variables, SEO metadata, permalinks, and color accents'}
          </p>
        </div>

        {/* Success Notifications popup */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-black text-white border-2 border-red-500 p-2.5 rounded-none font-sans font-black text-[10px] uppercase shadow-xs shrink-0"
            >
              ⭐ {successMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* COLUMN 1: Basic Site settings */}
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 border-2 border-black rounded-none space-y-3">
              <h4 className="font-sans font-black text-xs text-black uppercase tracking-wider border-b border-black pb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>{isAr ? 'العلامة التجارية والترويج' : 'Site Branding'}</span>
              </h4>

              {/* Site Name */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1 text-neutral-500">{isAr ? 'اسم الموقع الأساسي' : 'Site Name'}</label>
                <input
                  type="text"
                  required
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full bg-white border-2 border-black rounded-none p-2 focus:outline-none text-xs font-sans font-black text-black"
                />
              </div>

              {/* Site Slogan */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1 text-neutral-500">{isAr ? 'شعار الموقع أو الوصف التعريفي' : 'Site Slogan'}</label>
                <input
                  type="text"
                  required
                  value={settings.siteSlogan}
                  onChange={(e) => setSettings({ ...settings, siteSlogan: e.target.value })}
                  className="w-full bg-white border-2 border-black rounded-none p-2 focus:outline-none text-xs font-sans font-semibold text-black"
                />
              </div>

              {/* Logo URL */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1 text-neutral-500">{isAr ? 'رابط شعار الموقع' : 'Custom Logo URL'}</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full bg-white border-2 border-black rounded-none p-2 focus:outline-none text-xs font-sans text-black"
                />
              </div>
            </div>

            {/* SEO configuration */}
            <div className="p-4 bg-neutral-50 border-2 border-black rounded-none space-y-3">
              <h4 className="font-sans font-black text-xs text-black uppercase tracking-wider border-b border-black pb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>{isAr ? 'محركات البحث والأرشفة (SEO)' : 'SEO & Technical Settings'}</span>
              </h4>

              {/* SEO keywords */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1 text-neutral-500">{isAr ? 'الكلمات المفتاحية الافتراضية للمنصة' : 'Global Meta Keywords'}</label>
                <input
                  type="text"
                  value={settings.seoKeywords}
                  onChange={(e) => setSettings({ ...settings, seoKeywords: e.target.value })}
                  className="w-full bg-white border-2 border-black rounded-none p-2 focus:outline-none text-xs font-sans font-bold text-black"
                />
              </div>

              {/* Permalinks structure */}
              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-1 text-neutral-500">{isAr ? 'تركيبة وهيكلية الروابط الدائمة' : 'Permalink URL Structure'}</label>
                <select
                  value={settings.permalinkStructure}
                  onChange={(e) => setSettings({ ...settings, permalinkStructure: e.target.value as 'post-id' | 'post-name' | 'category-post' })}
                  className="w-full bg-white border-2 border-black rounded-none p-2 focus:outline-none text-xs font-black cursor-pointer text-black"
                >
                  <option value="post-id">{isAr ? 'معرف المقال الافتراضي (e.g. ?p=123)' : 'Post ID (?p=123)'}</option>
                  <option value="post-name">{isAr ? 'اسم وعنوان المقال (e.g. /news/luffy-gear-5)' : 'Post Slug name (/news/luffy-gear-5)'}</option>
                  <option value="category-post">{isAr ? 'القسم مع اسم المقال (e.g. /anime/review-h1)' : 'Category + Slug (/anime/review-h1)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Design Themes & Mail Alerts */}
          <div className="space-y-4">
            {/* Visual Color Accents */}
            <div className="p-4 bg-neutral-50 border-2 border-black rounded-none space-y-3">
              <h4 className="font-sans font-black text-xs text-black uppercase tracking-wider border-b border-black pb-2 flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span>{isAr ? 'الألوان والهوية البصرية النشطة' : 'Interface Theme Accent'}</span>
              </h4>

              <div className={isAr ? 'text-right' : 'text-left'}>
                <label className="block text-[10px] uppercase font-black mb-2 text-neutral-500">{isAr ? 'اختر اللون الأساسي للموقع' : 'Select Primary Accent Color'}</label>
                
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'amber', labelAr: 'كهرماني', labelEn: 'Amber', class: 'bg-amber-400' },
                    { key: 'red', labelAr: 'أحمر قاني', labelEn: 'Crimson', class: 'bg-red-500 text-white' },
                    { key: 'pink', labelAr: 'وردي صاخب', labelEn: 'Neon Pink', class: 'bg-pink-500 text-white' },
                    { key: 'emerald', labelAr: 'زمردي أخضر', labelEn: 'Emerald', class: 'bg-emerald-400' },
                  ].map((theme) => (
                    <button
                      key={theme.key}
                      type="button"
                      onClick={() => setSettings({ ...settings, colorTheme: theme.key as any })}
                      className={`border-2 border-black rounded-none p-3 font-sans text-[10px] font-black uppercase text-center transition-all cursor-pointer ${theme.class} ${
                        settings.colorTheme === theme.key 
                          ? 'ring-4 ring-offset-2 ring-black scale-98' 
                          : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      {isAr ? theme.labelAr : theme.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Email & Notifications parameters */}
            <div className="p-4 bg-neutral-50 border-2 border-black rounded-none space-y-4">
              <h4 className="font-sans font-black text-xs text-black uppercase tracking-wider border-b border-black pb-2 flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>{isAr ? 'إشعارات البريد والرقابة الفورية' : 'E-mail Alerts & Moderation Policies'}</span>
              </h4>

              {/* Email Toggle checkbox */}
              <label className={`flex items-center gap-3 cursor-pointer select-none ${isAr ? 'flex-row-reverse' : ''}`}>
                <input
                  type="checkbox"
                  checked={settings.enableEmailAlerts}
                  onChange={(e) => setSettings({ ...settings, enableEmailAlerts: e.target.checked })}
                  className="w-4 h-4 border-2 border-black rounded-none cursor-pointer accent-black"
                />
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <span className="block text-xs font-black text-black">{isAr ? 'تفعيل تنبيهات البريد الإلكتروني' : 'Enable Email Notification Alerts'}</span>
                  <span className="block text-[9px] text-neutral-400 font-sans mt-0.5">{isAr ? 'إخطار مسؤولي النظام عند إضافة تعليقات جديدة للمراجعة' : 'Notify admins when comments are posted'}</span>
                </div>
              </label>

              {/* Moderation Toggle checkbox */}
              <label className={`flex items-center gap-3 cursor-pointer select-none ${isAr ? 'flex-row-reverse' : ''}`}>
                <input
                  type="checkbox"
                  checked={settings.moderationFirst}
                  onChange={(e) => setSettings({ ...settings, moderationFirst: e.target.checked })}
                  className="w-4 h-4 border-2 border-black rounded-none cursor-pointer accent-black"
                />
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <span className="block text-xs font-black text-black">{isAr ? 'المراجعة والرقابة المسبقة للتعليقات' : 'Moderate Comments Prior to Publishing'}</span>
                  <span className="block text-[9px] text-neutral-400 font-sans mt-0.5">{isAr ? 'جميع تعليقات القراء تمر بحالة معلقة حتى موافقة المشرفين' : 'All incoming reader posts start as Pending'}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end pt-3 border-t-2 border-black">
          <button
            type="submit"
            className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-white font-sans text-xs font-black uppercase tracking-wider px-8 py-3.5 border-2 border-black rounded-none flex items-center justify-center gap-2 transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_rgba(239,68,68,1)] cursor-pointer"
          >
            <Save className="w-4.5 h-4.5 text-white" />
            <span>{isAr ? 'حفظ وحقن الإعدادات الحالية' : 'Save & Hot-Deploy Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
