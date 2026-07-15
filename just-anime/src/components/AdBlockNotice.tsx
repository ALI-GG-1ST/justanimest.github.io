/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, RefreshCw, Heart, X, HelpCircle } from 'lucide-react';

interface AdBlockNoticeProps {
  lang: 'ar' | 'en';
}

export default function AdBlockNotice({ lang }: AdBlockNoticeProps) {
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [checking, setChecking] = useState(true);

  const isAr = lang === 'ar';

  const labels = {
    ar: {
      title: 'تم كشف مانع الإعلانات 🛡️',
      description: 'نحن نلاحظ أنك تستخدم برنامجاً لحظر الإعلانات (مثل AdBlock). JUST ANIME هي شبكة مجانية تماماً تقدم ترجمات وتسريبات حصرية للأنمي والمانجا على مدار الساعة. نعتمد بشكل كامل على الإعلانات (مثل Adsterra) لتغطية تكاليف الخوادم والصيانة.',
      politeRequest: 'يرجى التكرم بتعطيل مانع الإعلانات لموقعنا ودعمنا لنستمر في توفير المحتوى المجاني! ❤️',
      disableInstructions: 'كيفية التعطيل: اضغط على أيقونة مانع الإعلانات في متصفحك واختر "إيقاف التشغيل في هذا الموقع" ثم أعد تحميل الصفحة.',
      recheckBtn: 'تحقق مجدداً وأعد التحميل',
      closeBtn: 'متابعة القراءة (إغلاق)',
    },
    en: {
      title: 'Ad Blocker Detected 🛡️',
      description: 'We noticed you are using an ad blocker (like AdBlock). JUST ANIME is completely free, providing 24/7 anime news, leaks, and translations. We rely entirely on light, secure ads (Adsterra) to fund our high-speed servers and maintenance.',
      politeRequest: 'Please consider disabling your ad blocker for our domain to support our work! ❤️',
      disableInstructions: 'How to disable: Click the ad blocker icon in your browser toolbar, toggle it off for this site, and refresh.',
      recheckBtn: 'Re-check & Refresh',
      closeBtn: 'Continue Reading (Close)',
    }
  }[lang];

  useEffect(() => {
    // Robust multi-layered AdBlock detection
    const detectAdBlocker = async () => {
      let detected = false;

      // Layer 1: Detect by creating a fake ad element with common ad class names
      const fakeAd = document.createElement('div');
      fakeAd.innerHTML = '&nbsp;';
      fakeAd.className = 'adsbox ad-zone ad-banner ads-placeholder doubleclick-ad';
      // Style it so it is invisible to real users but detectable by blockers
      fakeAd.setAttribute('style', 'position: absolute; left: -9999px; top: -9999px; width: 1px; height: 1px; display: block;');
      
      document.body.appendChild(fakeAd);

      // Give the browser a brief moment to apply adblock stylesheet rules
      await new Promise((resolve) => setTimeout(resolve, 150));

      const styles = window.getComputedStyle(fakeAd);
      if (
        styles.display === 'none' ||
        styles.visibility === 'hidden' ||
        fakeAd.clientHeight === 0 ||
        fakeAd.offsetHeight === 0 ||
        fakeAd.offsetParent === null
      ) {
        detected = true;
      }

      document.body.removeChild(fakeAd);

      // Layer 2: Detect by attempting to fetch a script that is universally blacklisted by adblockers (e.g. Adsterra or Google Adsense script domains)
      if (!detected) {
        try {
          // A standard Adsterra resource URL or pagead script
          const response = await fetch(
            new Request('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
              method: 'HEAD',
              mode: 'no-cors',
            })
          );
          // If fetch succeeds but redirect/blocked, it might throw or trigger zero-length
          if (response.status === 0) {
            detected = false; // standard no-cors opaque response
          }
        } catch (error) {
          // AdBlock usually aborts the fetch completely, resulting in a TypeError/Failed to fetch
          detected = true;
        }
      }

      setChecking(false);
      if (detected) {
        setIsAdBlockerDetected(true);
        // Check if user has already dismissed this notice in this session
        const isDismissed = sessionStorage.getItem('just_anime_adblock_dismissed');
        if (!isDismissed) {
          setIsVisible(true);
        }
      }
    };

    detectAdBlocker();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('just_anime_adblock_dismissed', 'true');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isVisible && isAdBlockerDetected && !checking && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          id="adblock-notice-overlay"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-amber-50 border-4 border-black p-6 md:p-8 max-w-xl w-full rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden text-right"
            dir={isAr ? 'rtl' : 'ltr'}
            id="adblock-notice-card"
          >
            {/* Top decorative hazard stripes */}
            <div className="absolute top-0 inset-x-0 h-2 bg-amber-400 repeating-linear" />

            {/* Close button top right (or left if RTL, but relative handles it cleanly) */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 bg-white hover:bg-neutral-100 border-2 border-black p-1.5 transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              aria-label="Close"
              id="adblock-close-btn-top"
            >
              <X className="w-4 h-4 text-black" />
            </button>

            {/* Notice header */}
            <div className={`flex items-start gap-4 mt-2 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="bg-red-500 border-2 border-black p-3 shrink-0 transform -rotate-3 shadow-[2px_2px_0px_rgba(0,0,0,1)] text-white">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <span className="text-[9px] font-mono font-black uppercase bg-black text-white px-2 py-0.5 border border-black inline-block transform rotate-1">
                  ADSTERRA INTEGRITY MONITOR
                </span>
                <h3 className="font-sans font-black text-xl md:text-2xl text-black mt-1 leading-tight">
                  {labels.title}
                </h3>
              </div>
            </div>

            {/* Core body message */}
            <div className={`mt-6 space-y-4 font-sans text-sm text-neutral-800 ${isAr ? 'text-right' : 'text-left'}`}>
              <p className="leading-relaxed font-semibold">
                {labels.description}
              </p>
              
              <p className="font-black text-red-600 bg-red-50 border-l-4 border-red-600 p-3 italic">
                {labels.politeRequest}
              </p>

              <div className="bg-white border-2 border-black p-4 text-xs font-mono font-bold text-neutral-600 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <p className="leading-tight">{labels.disableInstructions}</p>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="mt-8 pt-4 border-t-2 border-black flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 font-mono text-xs font-black uppercase">
              {/* Dismiss button */}
              <button
                onClick={handleClose}
                className="bg-white hover:bg-neutral-50 text-black border-2 border-black px-5 py-2.5 shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-center cursor-pointer"
                id="adblock-dismiss-btn"
              >
                {labels.closeBtn}
              </button>

              {/* Reload/Refresh button */}
              <button
                onClick={handleRefresh}
                className="bg-black hover:bg-neutral-800 text-white border-2 border-black px-5 py-2.5 shadow-[3px_3px_0px_rgba(251,191,36,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_rgba(251,191,36,1)] active:translate-x-0 active:translate-y-0 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                id="adblock-refresh-btn"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{labels.recheckBtn}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
