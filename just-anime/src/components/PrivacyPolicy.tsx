/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Eye, Sparkles, BookOpen } from 'lucide-react';

interface PrivacyPolicyProps {
  lang: 'ar' | 'en';
}

export default function PrivacyPolicy({ lang }: PrivacyPolicyProps) {
  const privacyT = {
    ar: {
      title: 'سياسة الخصوصية وشروط الاستخدام',
      updated: 'آخر تحديث: يوليو 13, 2026 • تلتزم JUST ANIME بالشفافية المطلقة مع قرائها.',
      introTitle: '1. تمهيد ومقدمة عامة',
      introText: 'مرحباً بكم في مدونة وشبكة أخبار JUST ANIME. نحن نولي أقصى درجات العناية لخصوصية زوارنا الكرام وأمان بياناتهم الرقمية أثناء تصفح المقالات والتقارير. توضح هذه الوثيقة طبيعة المعلومات التي نجمعها وكيفية معالجتها بما يتوافق مع القوانين والأنظمة المعترف بها دولياً.',
      adsTitle: '2. سياسة الإعلانات وملفات تعريف الارتباط (Cookies)',
      adsP1: 'تتعامل شبكة JUST ANIME مع شبكات إعلانية تابعة لجهات خارجية ومزودي خدمات إعلانية موثوقين مثل Adsterra Advertising Network.',
      adsP2: 'تستخدم هذه الشركات ملفات تعريف الارتباط لتخصيص الإعلانات التي تظهر للمستخدم بناءً على زياراته السابقة لموقعنا أو مواقع الويب الأخرى على شبكة الإنترنت:',
      adsLi1: 'يستخدم شركاؤنا الإعلانيون تقنيات مثل الـ Cookies والـ Web Beacons لقياس فعالية الحملات الإعلانية وملاءمتها للمستخدم.',
      adsLi2: 'ليس لمدونتنا أي سلطة أو سيطرة على هذه الملفات التي يستخدمها معلنو الطرف الثالث.',
      adsLi3: 'يمكن للمستخدم دائماً اختيار تعطيل ملفات تعريف الارتباط من خلال إعدادات متصفحه الخاص بكل سهولة وأمان.',
      commentsTitle: '3. نظام التعليقات والمشاركات',
      commentsText: 'عند قيام الزائر بنشر تعليق على أخبارنا، نقوم بطلب اسم مستعار لتعريف التعليق للمتابعين الآخرين. نحن نمنع منعاً باتاً نشر أي تعليقات تحتوي على إساءات لفظية، تهديدات، طعن في المعتقدات، أو حرق للأحداث دون سابق إنذار. للمشرفين كامل الحق في تعديل أو حذف التعليقات المخالفة فوراً لضمان بيئة قراءة صحية وراقية.',
      termsTitle: '4. حقوق الملكية الفكرية وشروط إعادة النشر',
      termsP1: 'جميع التحليلات، المقالات الطويلة، والمحتوى المكتوب الحصري المنشور في مدونة JUST ANIME محمي بحقوق الملكية الفكرية الخاصة بكتابنا والشبكة.',
      termsP2: 'يُسمح بإعادة اقتباس جزء من الخبر أو المقال بشرط الإشارة الواضحة برابط نشط (Active Do-Follow link) يوجه إلى المصدر الأصلي في موقعنا لضمان حفظ حقوق كتابة المحتوى والجهد الصحفي المبذول.',
      contactTitle: '5. التواصل والاستفسار عن الشروط',
      contactText: 'إذا كان لديكم أي استفسار أو اعتراض بخصوص سياسة الخصوصية الخاصة بنا، يرجى عدم التردد في مراسلة مسؤول حماية البيانات عبر البريد الإلكتروني الرسمي:',
    },
    en: {
      title: 'Privacy Policy & Terms of Use',
      updated: 'Last updated: July 13, 2026 • JUST ANIME commits to absolute transparency with our readers.',
      introTitle: '1. Preamble & General Introduction',
      introText: 'Welcome to the JUST ANIME blog and news portal. We prioritize the privacy of our valued visitors and the security of their digital footprint. This document details the types of information we collect and how we process them in compliance with globally recognized regulations.',
      adsTitle: '2. Advertising Policy & Cookies',
      adsP1: 'JUST ANIME partners with third-party advertising services and trusted advertising networks such as the Adsterra Advertising Network.',
      adsP2: 'These advertising companies use cookies to serve personalized advertisements to you based on your previous visits to our website or other sites on the Internet:',
      adsLi1: 'Our advertising partners employ technologies like Cookies and Web Beacons to measure campaign performance and relevance.',
      adsLi2: 'Our publication does not possess authority or control over the cookies utilized by third-party advertisers.',
      adsLi3: 'Users can easily and safely choose to disable cookies through their individual web browser settings.',
      commentsTitle: '3. Comments & Engagement Policy',
      commentsText: 'When posting a comment on our stories, we request a nickname to identify you to other readers. We strictly prohibit posting comments containing verbal abuse, threats, religious mockery, or unflagged spoilers without warning. Moderators reserve the full right to edit or delete violating comments instantly to maintain a clean, intellectual reading environment.',
      termsTitle: '4. Intellectual Property & Republishing Terms',
      termsP1: 'All analytical reviews, long-form write-ups, and exclusive written content published on JUST ANIME are protected by intellectual property laws.',
      termsP2: 'Quoting portions of our stories is allowed, provided that active, clickable attribution (Active Do-Follow link) directly referencing the original source page on our site is explicitly included.',
      contactTitle: '5. Contact and Policy Inquiries',
      contactText: 'If you have any questions or concerns regarding our privacy policies or terms, please feel free to email our Data Protection Officer at:',
    }
  }[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black" id="privacy-policy-container">
      {/* Title */}
      <div className="border-b-2 border-black pb-5 mb-8">
        <h1 className="font-sans font-black text-2xl sm:text-3xl text-black flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-black animate-pulse" />
          <span>{privacyT.title}</span>
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1.5 font-mono font-black italic">
          {privacyT.updated}
        </p>
      </div>

      <div className={`space-y-8 text-black text-xs sm:text-sm leading-relaxed font-serif ${
        lang === 'ar' ? 'text-right' : 'text-left'
      }`} id="privacy-content">
        
        {/* Intro */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-black" />
            <span>{privacyT.introTitle}</span>
          </h2>
          <p>
            {privacyT.introText}
          </p>
        </section>

        {/* Ads Policy (Crucial for Adsterra integration approval!) */}
        <section className="space-y-3 bg-neutral-50 border-2 border-black p-5 rounded-none">
          <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-black" />
            <span>{privacyT.adsTitle}</span>
          </h2>
          <p>
            {privacyT.adsP1}
          </p>
          <p>
            {privacyT.adsP2}
          </p>
          <ul className={`list-disc ${
            lang === 'ar' ? 'list-inside pr-4' : 'list-inside pl-4'
          } space-y-1.5 text-neutral-800`}>
            <li>{privacyT.adsLi1}</li>
            <li>{privacyT.adsLi2}</li>
            <li>{privacyT.adsLi3}</li>
          </ul>
        </section>

        {/* Comments policy */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-black" />
            <span>{privacyT.commentsTitle}</span>
          </h2>
          <p>
            {privacyT.commentsText}
          </p>
        </section>

        {/* Terms of Use */}
        <section className="space-y-3 border-t-2 border-black pt-6">
          <h2 className="text-base sm:text-lg font-black text-black">{privacyT.termsTitle}</h2>
          <p>
            {privacyT.termsP1}
          </p>
          <p>
            {privacyT.termsP2}
          </p>
        </section>

        {/* Contact info support */}
        <section className="space-y-3 border-t-2 border-black pt-6">
          <h2 className="text-base sm:text-lg font-black text-black">{privacyT.contactTitle}</h2>
          <p>
            {privacyT.contactText}{' '}
            <a href="mailto:alawyabbas15@gmail.com" className="font-mono text-black font-black hover:underline hover:line-through">
              alawyabbas15@gmail.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
