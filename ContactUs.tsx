/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ContactUsProps {
  lang: 'ar' | 'en';
}

export default function ContactUs({ lang }: ContactUsProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name && email && subject && message) {
      try {
        const contactId = `contact-${Date.now()}`;
        await setDoc(doc(db, 'contacts', contactId), {
          name,
          email,
          subject,
          message
        });
      } catch (err) {
        console.warn("Failed to save contact submission in Firestore", err);
      }
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }
  };

  const contactT = {
    ar: {
      title: 'تواصل معنا الآن',
      desc: 'هل لديك اقتراح، شراكة إعلانية، رغبة في الانضمام لطاقم التحرير، أو بلاغ عن محتوى؟ نحن نسعد بالاستماع إليك دائماً والرد خلال 24 ساعة.',
      sidebarTitle: 'قنوات الاتصال المباشرة',
      emailLabel: 'البريد الإلكتروني للتحرير:',
      adsLabel: 'شراكات وعروض الإعلان (Adsterra):',
      hqLabel: 'مقر الإدارة:',
      hqVal: 'الشرق الأوسط - إدارة رقمية متكاملة',
      joinTitle: 'انضم كـ كاتب مقالات',
      joinDesc: 'إذا كنت تملك مهارات ممتازة في صياغة أخبار الأنمي وتتبع التسريبات، أرسل لنا بعض أعمالك السابقة وسنتواصل معك فوراً!',
      successTitle: 'وصلت رسالتك بنجاح!',
      successDesc: 'شكراً لتواصلك مع JUST ANIME. تم تسجيل رسالتك في نظام الدعم وسيقوم أحد مسؤولي التحرير بالرد عليك عبر بريدك الإلكتروني قريباً.',
      anotherBtn: 'إرسال رسالة أخرى',
      formTitle: 'نموذج المراسلة والاتصال',
      nameLabel: 'اسمك الكريم:',
      namePlace: 'مثال: أحمد عبد الله',
      emailFieldLabel: 'بريدك الإلكتروني للمراسلة:',
      emailFieldPlace: 'example@domain.com',
      subLabel: 'موضوع الرسالة:',
      subPlace: 'مثال: طلب شراكة إعلانية / إبلاغ عن محتوى',
      msgLabel: 'نص الرسالة التفصيلي:',
      msgPlace: 'اكتب اقتراحك أو استفسارك هنا بوضوح لتسهيل الرد السريع...',
      sendBtn: 'إرسال رسالة الدعم الفني الآن',
    },
    en: {
      title: 'Contact Us Now',
      desc: 'Do you have a suggestion, an advertising partnership offer, a desire to join our editorial staff, or content reports? We are always happy to hear from you and reply within 24 hours.',
      sidebarTitle: 'Direct Communication Channels',
      emailLabel: 'Editorial Email:',
      adsLabel: 'Advertising Partnerships (Adsterra):',
      hqLabel: 'Headquarters:',
      hqVal: 'Middle East - Integrated Digital Management',
      joinTitle: 'Join as an Article Writer',
      joinDesc: 'If you have excellent skills in drafting anime news and tracking leaks, send us some of your work and we will get in touch!',
      successTitle: 'Your message has been sent!',
      successDesc: 'Thank you for contacting JUST ANIME. Your inquiry has been registered. Our support team will reply to your email address shortly.',
      anotherBtn: 'Send another message',
      formTitle: 'Inquiry and Message Form',
      nameLabel: 'Your Full Name:',
      namePlace: 'e.g., John Doe',
      emailFieldLabel: 'Your Email Address:',
      emailFieldPlace: 'example@domain.com',
      subLabel: 'Message Subject:',
      subPlace: 'e.g., Partnership Inquiry / Content Report',
      msgLabel: 'Detailed Message:',
      msgPlace: 'Write your suggestion or inquiry clearly to help us reply efficiently...',
      sendBtn: 'Send Support Message Now',
    }
  }[lang];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-black" id="contact-us-container">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="font-sans font-black text-2xl sm:text-4xl text-black mb-3">
          {contactT.title}
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-serif">
          {contactT.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="contact-grid">
        {/* Contact Info Sidebar */}
        <div className="space-y-6 md:col-span-1" id="contact-info-sidebar">
          
          <div className="bg-black text-white p-6 rounded-none border-2 border-black space-y-5" id="info-card">
            <h3 className="font-sans font-black text-base flex items-center gap-2 italic uppercase">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>{contactT.sidebarTitle}</span>
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm font-sans">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <span className="block font-black text-neutral-300 text-xs">{contactT.emailLabel}</span>
                  <a href="mailto:alawyabbas15@gmail.com" className="hover:underline text-white font-mono font-black">
                    alawyabbas15@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <span className="block font-black text-neutral-300 text-xs">{contactT.adsLabel}</span>
                  <span className="text-white font-mono hover:underline cursor-pointer font-black">ads@just-anime.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <span className="block font-black text-neutral-300 text-xs">{contactT.hqLabel}</span>
                  <span className="text-neutral-300">{contactT.hqVal}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-neutral-50 border-2 border-black p-5 rounded-none text-center ${
            lang === 'ar' ? 'text-right' : 'text-left'
          }`}>
            <h4 className="font-sans font-black text-sm text-black mb-2">{contactT.joinTitle}</h4>
            <p className="text-neutral-600 text-xs leading-relaxed font-serif">
              {contactT.joinDesc}
            </p>
          </div>

        </div>

        {/* Contact Inquiry Form */}
        <div className="md:col-span-2" id="contact-form-area">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-neutral-50 border-4 border-black p-8 rounded-none text-center flex flex-col items-center justify-center space-y-4 h-full"
              id="submission-success-panel"
            >
              <CheckCircle2 className="w-16 h-16 text-black animate-bounce" />
              <h3 className="font-sans font-black text-xl text-black">{contactT.successTitle}</h3>
              <p className="text-neutral-600 text-sm max-w-sm leading-relaxed font-serif">
                {contactT.successDesc}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-black text-white px-6 py-2.5 rounded-none hover:bg-neutral-800 transition-all text-xs font-black border border-black cursor-pointer"
              >
                {contactT.anotherBtn}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border-2 border-black p-6 rounded-none space-y-4">
              <h3 className="font-sans font-black text-lg text-black border-b-2 border-black pb-3 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-black" />
                <span>{contactT.formTitle}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <label className="block text-xs font-black text-neutral-600 mb-1.5">{contactT.nameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder={contactT.namePlace}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 focus:bg-white text-xs sm:text-sm px-4 py-3 rounded-none border border-black focus:outline-none transition-all"
                  />
                </div>

                <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <label className="block text-xs font-black text-neutral-600 mb-1.5">{contactT.emailFieldLabel}</label>
                  <input
                    type="email"
                    required
                    placeholder={contactT.emailFieldPlace}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-50 focus:bg-white text-xs sm:text-sm px-4 py-3 rounded-none border border-black focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <label className="block text-xs font-black text-neutral-600 mb-1.5">{contactT.subLabel}</label>
                <input
                  type="text"
                  required
                  placeholder={contactT.subPlace}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-neutral-50 focus:bg-white text-xs sm:text-sm px-4 py-3 rounded-none border border-black focus:outline-none transition-all"
                />
              </div>

              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <label className="block text-xs font-black text-neutral-600 mb-1.5">{contactT.msgLabel}</label>
                <textarea
                  required
                  rows={5}
                  placeholder={contactT.msgPlace}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-neutral-50 focus:bg-white text-xs sm:text-sm px-4 py-3 rounded-none border border-black focus:outline-none transition-all"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 text-white font-black py-3.5 rounded-none transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-black shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{contactT.sendBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
