/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Compass, Sparkles, Award, ShieldCheck, Users } from 'lucide-react';
import { generateOrganizationSchema } from '../utils/schemaGenerator';

interface AboutUsProps {
  lang: 'ar' | 'en';
}

export default function AboutUs({ lang }: AboutUsProps) {
  const values = lang === 'ar' ? [
    {
      icon: Award,
      title: 'السرعة والمصداقية',
      description: 'نلتزم بنقل الأخبار من مصادرها اليابانية الرسمية وترجمتها فوراً وبدقة متناهية دون تهويل أو شائعات.',
    },
    {
      icon: ShieldCheck,
      title: 'الأمان والخصوصية',
      description: 'نحن منصة آمنة تماماً للمستخدمين، ونحرص على توفير محتوى محترم يليق بالجمهور العربي المتابع للأنمي.',
    },
    {
      icon: Users,
      title: 'بناء المجتمع',
      description: 'نهدف لجمع مجتمعات الأوتاكو والمتابعين العرب تحت مظلة واحدة لمناقشة الفصول والحلقات والنظريات بمودة.',
    },
  ] : [
    {
      icon: Award,
      title: 'Speed & Credibility',
      description: 'We commit to sourcing news from official Japanese platforms, translating them instantly with absolute accuracy, free from exaggeration.',
    },
    {
      icon: ShieldCheck,
      title: 'Security & Privacy',
      description: 'We are a fully secure platform, ensuring respectful, high-quality content that meets the expectations of passionate fans.',
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'We aim to unite manga and anime enthusiasts under one umbrella to discuss episodes, chapters, and theories warmly.',
    },
  ];

  const orgJsonLd = generateOrganizationSchema();

  const aboutT = {
    ar: {
      meta: 'من نحن • ABOUT US',
      title: 'منصة JUST ANIME الإعلامية',
      desc: 'المنصة العربية الرائدة والأسرع في تغطية أخبار الأنمي والمانجا، المراجعات التحليلية، وتسريبات فصول المانجا الأسبوعية بشكل دقيق واحترافي تماماً.',
      visionTitle: 'رؤيتنا ورسالتنا للجمهور العربي',
      visionP1: 'ولدت فكرة منصة JUST ANIME من شغف حقيقي بعالم الأنمي والمانجا، وإدراك تام لحاجة الجمهور لمصدر إعلامي موثوق وسريع ويتمتع بصياغة رفيعة المستوى خالية من الترجمات الحرفية الركيكة.',
      visionP2: 'نحن هنا لنختصر عليك المسافة بين صدور الخبر في اليابان وحصولك عليه. فريق محررينا الموزع يعمل على مدار الساعة لترجمة المؤتمرات، تحليلات الحلقات، وتتبع التسريبات من قلب الحدث.',
      whyTitle: 'لماذا نحن الخيار الأول للأوتاكو؟',
      whyItem1: 'فريق تحريري ذو خبرة لسنوات طويلة في متابعة الصناعة وتحليلها.',
      whyItem2: 'تغطية حية ومباشرة للأحداث والمعارض الكبرى كمعرض AnimeJapan و Jump Festa.',
      whyItem3: 'نظام قوالب نشر سريع وذكي يضمن وصول الخبر في ثوانٍ معدودة.',
      whyItem4: 'توافق تام مع معايير السيو (SEO) لضمان سهولة العثور على تقاريرنا عبر محركات البحث.',
      valuesHeader: 'القيم التي تحكم عملنا التحريري',
    },
    en: {
      meta: 'ABOUT US • من نحن',
      title: 'JUST ANIME Media Platform',
      desc: 'The leading and fastest digital platform covering anime & manga news, analytical reviews, and weekly manga leaks with ultimate precision and professionalism.',
      visionTitle: 'Our Vision & Mission',
      visionP1: 'The idea behind JUST ANIME was born from an authentic passion for the anime and manga culture, and a clear understanding of the fans\' need for a reliable, fast news outlet that delivers professional, elegant translations.',
      visionP2: 'We are here to bridge the gap between Japanese releases and your screen. Our global team of editors works around the clock to translate official press conferences, analyze anime episodes, and deliver verified leaks.',
      whyTitle: 'Why are we the #1 choice for Otakus?',
      whyItem1: 'Veteran editorial team with years of experience tracking the industry.',
      whyItem2: 'Live coverage of major global events such as AnimeJapan and Jump Festa.',
      whyItem3: 'High-speed and smart publishing layout ensuring stories reach you in seconds.',
      whyItem4: 'Fully optimized for SEO to make all deep reviews highly discoverable online.',
      valuesHeader: 'Our Core Editorial Values',
    }
  }[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black" id="about-us-container">
      {/* Dynamic SEO Organization JSON-LD */}
      <script type="application/ld+json">{orgJsonLd}</script>

      {/* Hero Banner Area */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white rounded-none p-8 sm:p-12 text-center border-4 border-black relative overflow-hidden mb-12 shadow-xs"
        id="about-hero"
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-white font-mono text-xs font-black uppercase tracking-widest mb-2 inline-block bg-black px-2 py-0.5 border border-white italic">
            {aboutT.meta}
          </span>
          <h1 className="font-sans font-black text-2xl sm:text-4xl text-white mb-4 italic">
            {aboutT.title}
          </h1>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-serif">
            {aboutT.desc}
          </p>
        </div>
      </motion.div>

      {/* Main Narrative */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 ${
        lang === 'ar' ? 'text-right' : 'text-left'
      }`} id="about-narrative">
        <div className="space-y-4">
          <h2 className={`font-sans font-black text-xl text-black flex items-center gap-2 ${
            lang === 'ar' ? 'flex-row' : 'flex-row'
          }`}>
            <Compass className="w-5 h-5 text-black" />
            <span>{aboutT.visionTitle}</span>
          </h2>
          <p className="text-neutral-700 text-sm sm:text-base leading-relaxed font-serif">
            {aboutT.visionP1}
          </p>
          <p className="text-neutral-700 text-sm sm:text-base leading-relaxed font-serif">
            {aboutT.visionP2}
          </p>
        </div>

        <div className="bg-neutral-50 border-2 border-black rounded-none p-6 flex flex-col justify-center space-y-4">
          <h3 className="font-sans font-black text-base text-black flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-black" />
            <span>{aboutT.whyTitle}</span>
          </h3>
          <ul className={`space-y-3 text-xs sm:text-sm text-neutral-800 leading-relaxed font-serif list-disc ${
            lang === 'ar' ? 'list-inside pr-2' : 'list-inside pl-2'
          }`}>
            <li>{aboutT.whyItem1}</li>
            <li>{aboutT.whyItem2}</li>
            <li>{aboutT.whyItem3}</li>
            <li>{aboutT.whyItem4}</li>
          </ul>
        </div>
      </div>

      {/* Our Values section */}
      <div className="border-t-2 border-black pt-10" id="about-values">
        <h2 className="font-sans font-black text-xl text-black text-center mb-8 uppercase tracking-wide">
          {aboutT.valuesHeader}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((val, idx) => {
            const IconComponent = val.icon;
            return (
              <div
                key={idx}
                className="bg-white border-2 border-black rounded-none p-6 hover:bg-neutral-50 transition-all duration-300"
                id={`value-card-${idx}`}
              >
                <div className="bg-neutral-100 text-black w-12 h-12 rounded-none flex items-center justify-center mb-4 border border-black shadow-xs">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className={`font-sans font-black text-base text-black mb-2 ${
                  lang === 'ar' ? 'text-right' : 'text-left'
                }`}>{val.title}</h3>
                <p className={`text-neutral-600 text-xs sm:text-sm leading-relaxed font-serif ${
                  lang === 'ar' ? 'text-right' : 'text-left'
                }`}>{val.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
