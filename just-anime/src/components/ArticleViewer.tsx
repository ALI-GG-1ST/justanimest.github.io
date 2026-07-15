/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  Eye,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Send,
  MessageSquare,
  Link2,
  Twitter,
  Facebook,
  Copy,
  CheckCircle,
  Hash,
} from 'lucide-react';
import { Article, Comment } from '../types';
import { generateNewsArticleSchema, generateBreadcrumbSchema } from '../utils/schemaGenerator';
import { translations } from '../translations';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ArticleViewerProps {
  article: Article;
  allArticles: Article[];
  onBack: () => void;
  onSelectArticle: (id: string) => void;
  lang: 'ar' | 'en';
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

const getCategoryLabel = (cat: string, lang: 'ar' | 'en') => {
  const map: Record<string, { ar: string; en: string }> = {
    'الكل': { ar: 'الكل', en: 'All' },
    'أخبار': { ar: 'أخبار', en: 'News' },
    'أنمي': { ar: 'أنمي', en: 'Anime' },
    'مانجا': { ar: 'مانجا', en: 'Manga' },
    'مراجعات': { ar: 'مراجعات', en: 'Reviews' },
    'فعاليات': { ar: 'فعاليات', en: 'Events' },
  };
  return map[cat]?.[lang] || cat;
};

export default function ArticleViewer({
  article,
  allArticles,
  onBack,
  onSelectArticle,
  lang,
  isBookmarked,
  onToggleBookmark,
}: ArticleViewerProps) {
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [copied, setCopied] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const t = translations[lang];

  const viewerT = {
    ar: {
      editorTitle: 'محرر أخبار معتمد',
      copiedText: 'تم نسخ الرابط!',
      shareX: 'أنشر على X',
      telegram: 'تيليجرام',
      tocTitle: 'جدول محتويات المقال الفوري',
      commentPrompt: 'شاركنا برأيك في هذا الخبر:',
      commentUserLabel: 'اسمك المستعار:',
      commentUserPlace: 'مثال: لوفي_العرب',
      commentTextLabel: 'التعليق:',
      commentTextPlace: 'اكتب تعليقك هنا بكل احترام ومسؤولية...',
      commentTitle: 'التعليقات والمناقشة',
      adLabelTop: 'MEMBER OF ADSTERRA PREMIUM ADS (728x90)',
      adPlaceholderTop: 'استبدل هذا المربع برمز الإعلان الخاص بك',
      adLabelMid: 'ADSTERRA MIDDLE IN-FEED AD',
      adPlaceholderMid: 'إعلان مدمج بمنتصف المقال (Native Banner)',
      adLabelBot: 'ADSTERRA UNDER ARTICLE AD (468x60)',
      adPlaceholderBot: 'إعلان أسفل المقالة والمحتوى',
      sectionLabel: 'الفقرة',
    },
    en: {
      editorTitle: 'Certified News Editor',
      copiedText: 'Link Copied!',
      shareX: 'Post on X',
      telegram: 'Telegram',
      tocTitle: 'Article Table of Contents',
      commentPrompt: 'Share your thoughts on this story:',
      commentUserLabel: 'Your Nickname:',
      commentUserPlace: 'e.g., Luffy_Global',
      commentTextLabel: 'Your Comment:',
      commentTextPlace: 'Write your comment respectfully and responsibly...',
      commentTitle: 'Comments & Discussion',
      adLabelTop: 'MEMBER OF ADSTERRA PREMIUM ADS (728x90)',
      adPlaceholderTop: 'Replace this block with your Adsterra tag',
      adLabelMid: 'ADSTERRA MIDDLE IN-FEED AD',
      adPlaceholderMid: 'Integrated In-Feed Ad (Native Banner)',
      adLabelBot: 'ADSTERRA UNDER ARTICLE AD (468x60)',
      adPlaceholderBot: 'Ad below article content',
      sectionLabel: 'Section',
    }
  }[lang];

  // Load comments from Firestore or LocalStorage specific to this article
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsCol = collection(db, 'articles', article.id, 'comments');
        const querySnapshot = await getDocs(commentsCol);
        if (!querySnapshot.empty) {
          const loadedComments: Comment[] = [];
          querySnapshot.forEach((docSnap) => {
            loadedComments.push(docSnap.data() as Comment);
          });
          loadedComments.sort((a, b) => b.id.localeCompare(a.id));
          setComments(loadedComments);
          localStorage.setItem(`comments_${article.id}`, JSON.stringify(loadedComments));
          return;
        }

        // If Firestore is empty, seed defaults
        const defaultComments: Comment[] = lang === 'ar' ? [
          {
            id: 'c1',
            authorName: 'أوتـاكو محترف',
            content: 'مقال استثنائي وتقديم رائع ومكتوب باحترافية تامة! متشوق جداً لمتابعة الأحداث القادمة.',
            date: 'منذ يومين',
          },
          {
            id: 'c2',
            authorName: 'رانكا_تشان',
            content: 'أخيراً أخبار حقيقية ومصادر موثوقة. شكراً لشبكة JUST ANIME على جهودكم المستمرة في التغطية.',
            date: 'منذ 5 ساعات',
          },
        ] : [
          {
            id: 'c1',
            authorName: 'Pro_Otaku',
            content: 'Exceptional article! Highly professional and well-detailed. I am very hyped for what is coming.',
            date: '2 days ago',
          },
          {
            id: 'c2',
            authorName: 'Ranka_Chan',
            content: 'Finally, real verified sources. Thanks to the JUST ANIME team for the outstanding coverage!',
            date: '5 hours ago',
          },
        ];

        for (const comm of defaultComments) {
          await setDoc(doc(db, 'articles', article.id, 'comments', comm.id), {
            ...comm,
            articleId: article.id
          });
        }
        setComments(defaultComments);
        localStorage.setItem(`comments_${article.id}`, JSON.stringify(defaultComments));
      } catch (err) {
        console.warn("Failed to fetch comments from Firestore. Falling back to local storage.", err);
        const savedComments = localStorage.getItem(`comments_${article.id}`);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        } else {
          const defaultComments: Comment[] = lang === 'ar' ? [
            {
              id: 'c1',
              authorName: 'أوتـاكو محترف',
              content: 'مقال استثنائي وتقديم رائع ومكتوب باحترافية تامة! متشوق جداً لمتابعة الأحداث القادمة.',
              date: 'منذ يومين',
            },
            {
              id: 'c2',
              authorName: 'رانكا_تشان',
              content: 'أخيراً أخبار حقيقية ومصادر موثوقة. شكراً لشبكة JUST ANIME على جهودكم المستمرة في التغطية.',
              date: 'منذ 5 ساعات',
            },
          ] : [
            {
              id: 'c1',
              authorName: 'Pro_Otaku',
              content: 'Exceptional article! Highly professional and well-detailed. I am very hyped for what is coming.',
              date: '2 days ago',
            },
            {
              id: 'c2',
              authorName: 'Ranka_Chan',
              content: 'Finally, real verified sources. Thanks to the JUST ANIME team for the outstanding coverage!',
              date: '5 hours ago',
            },
          ];
          setComments(defaultComments);
          localStorage.setItem(`comments_${article.id}`, JSON.stringify(defaultComments));
        }
      }
    };

    fetchComments();

    // Increment views count in LocalStorage
    const savedArticles = localStorage.getItem('just_anime_articles');
    if (savedArticles) {
      const parsed: Article[] = JSON.parse(savedArticles);
      const updated = parsed.map((a) => {
        if (a.id === article.id) {
          return { ...a, views: a.views + 1 };
        }
        return a;
      });
      localStorage.setItem('just_anime_articles', JSON.stringify(updated));
    }

    // Parse Content to find H2 headings for Table of Contents
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = article.content;
    const h2Elements = tempDiv.querySelectorAll('h2');
    const parsedHeadings: { id: string; text: string }[] = [];

    h2Elements.forEach((el, index) => {
      const id = `heading-${index}`;
      parsedHeadings.push({
        id,
        text: el.innerText || el.textContent || `${viewerT.sectionLabel} ${index + 1}`,
      });
    });
    setHeadings(parsedHeadings);
  }, [article, lang]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentName || !commentText) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      authorName: commentName,
      content: commentText,
      date: lang === 'ar' ? 'الآن' : 'Now',
    };

    try {
      await setDoc(doc(db, 'articles', article.id, 'comments', newComment.id), {
        ...newComment,
        articleId: article.id
      });
    } catch (err) {
      console.warn("Failed to write comment to Firestore", err);
    }

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${article.id}`, JSON.stringify(updatedComments));

    setCommentName('');
    setCommentText('');
  };

  // Render article content with dynamic IDs injected for ToC anchor jumping
  const renderFormattedContent = () => {
    let contentHtml = article.content;
    headings.forEach((heading) => {
      contentHtml = contentHtml.replace(
        '<h2>',
        `<h2 id="${heading.id}" class="text-xl sm:text-2xl font-black text-black mt-8 mb-4 ${
          lang === 'ar' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'
        } border-black scroll-mt-24 font-sans">`
      );
    });

    // Style p tags
    contentHtml = contentHtml.replaceAll(
      '<p>',
      '<p class="text-zinc-700 text-sm sm:text-base leading-relaxed mb-5 font-serif">'
    );

    // Style blockquotes
    contentHtml = contentHtml.replaceAll(
      '<blockquote>',
      `<blockquote class="${
        lang === 'ar' ? 'border-r-4 pr-5 rounded-l-md' : 'border-l-4 pl-5 rounded-r-md'
      } border-zinc-800 bg-zinc-50 py-5 my-6 text-zinc-800 font-medium italic font-serif text-sm sm:text-base">`
    );

    // Style ul tags
    contentHtml = contentHtml.replaceAll(
      '<ul>',
      `<ul class="list-disc list-inside space-y-2 mb-6 text-zinc-700 text-sm sm:text-base ${
        lang === 'ar' ? 'pr-4' : 'pl-4'
      } font-serif">`
    );

    // Style li tags
    contentHtml = contentHtml.replaceAll('<li>', '<li class="marker:text-black">');

    return <div className="article-body animate-in fade-in duration-300" dangerouslySetInnerHTML={{ __html: contentHtml }} />;
  };

  // Find Related Articles in same language
  const relatedArticles = allArticles
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.lang || 'ar') === lang &&
        (a.category === article.category || a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, 3);

  // Generate metadata JSON-LD strings
  const newsArticleJsonLd = generateNewsArticleSchema(article);
  const breadcrumbJsonLd = generateBreadcrumbSchema(article.category, article.title);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-black" id={`article-viewer-${article.id}`}>
      {/* Dynamic SEO JSON-LD tags injected in memory */}
      <script type="application/ld+json">{newsArticleJsonLd}</script>
      <script type="application/ld+json">{breadcrumbJsonLd}</script>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 font-mono font-black uppercase italic" id="breadcrumb-navigation">
        <span className="cursor-pointer hover:underline" onClick={onBack}>
          {t.home}
        </span>
        {lang === 'ar' ? <ChevronRight className="w-3 h-3 text-black" /> : <ChevronLeft className="w-3 h-3 text-black" />}
        <span className="text-neutral-400">{getCategoryLabel(article.category, lang)}</span>
        {lang === 'ar' ? <ChevronRight className="w-3 h-3 text-black" /> : <ChevronLeft className="w-3 h-3 text-black" />}
        <span className="text-black font-black truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
      </div>

      {/* Action Buttons Row */}
      <div className={`flex items-center justify-between mb-6 ${
        lang === 'ar' ? 'flex-row' : 'flex-row-reverse'
      }`} id="viewer-actions-row">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-black text-black hover:bg-neutral-100 px-3 py-2 rounded-none border-2 border-black transition-all shadow-xs cursor-pointer animate-in fade-in"
        >
          {lang === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          <span>{t.backToList}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded-none border-2 border-black transition-all text-black relative shadow-xs cursor-pointer ${
              isBookmarked ? 'bg-black text-white' : 'bg-neutral-50 hover:bg-neutral-105'
            }`}
            title="Bookmark Article"
            id="bookmark-viewer-btn"
          >
            <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-white text-white' : ''}`} />
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-none border-2 border-black transition-all text-black relative shadow-xs cursor-pointer"
            title={t.copyLink}
          >
            {copied ? <CheckCircle className="w-4.5 h-4.5 text-green-600" /> : <Copy className="w-4.5 h-4.5" />}
            {copied && (
              <span className={`absolute -top-8 ${lang === 'ar' ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} bg-black text-white text-[10px] px-2 py-0.5 rounded-none border border-black whitespace-nowrap`}>
                {viewerT.copiedText}
              </span>
            )}
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-none border-2 border-black transition-all text-black shadow-xs"
            title="Post to X"
          >
            <Twitter className="w-4.5 h-4.5" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-none border-2 border-black transition-all text-black shadow-xs"
            title="Share on Facebook"
          >
            <Facebook className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>

      {/* Title block */}
      <div className={`mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="viewer-title-block">
        <span className="inline-block bg-black text-white text-xs font-black px-2.5 py-1 rounded-none uppercase mb-3 italic border border-black">
          {getCategoryLabel(article.category, lang)}
        </span>
        <h1 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-black leading-tight mb-4 animate-in slide-in-from-bottom-2 duration-350">
          {article.title}
        </h1>
        <p className={`text-neutral-600 text-sm sm:text-base leading-relaxed ${
          lang === 'ar' ? 'border-r-4 pr-3' : 'border-l-4 pl-3'
        } border-black italic font-serif`}>
          {article.shortDescription}
        </p>
      </div>

      {/* Author and Date Meta block */}
      <div className={`flex flex-wrap items-center justify-between border-y-2 border-black py-4 mb-8 text-xs text-neutral-500 font-mono gap-4 ${
        lang === 'ar' ? 'flex-row' : 'flex-row-reverse'
      }`} id="viewer-meta-row">
        <div className={`flex items-center gap-3 ${lang === 'ar' ? 'flex-row' : 'flex-row'}`}>
          <div className="w-10 h-10 rounded-none bg-black flex items-center justify-center font-bold text-white text-sm border-2 border-black">
            {article.author.slice(0, 2)}
          </div>
          <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <span className="block font-sans text-black font-black text-sm">{article.author}</span>
            <span className="block text-[10px] text-neutral-400">{viewerT.editorTitle}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-black font-black">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{article.publishDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{t.readTime}: {article.readTime}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{article.views.toLocaleString()} {t.viewsCount}</span>
          </span>
        </div>
      </div>

      {/* Adsterra Top Slot banner */}
      <div className="bg-neutral-50 border-2 border-black text-center rounded-none p-4 mb-8 flex flex-col items-center justify-center" id="viewer-ad-top">
        <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-wider mb-1 uppercase">{viewerT.adLabelTop}</span>
        <div className="border border-dashed border-black w-full py-4 bg-white text-xs font-mono text-neutral-500 uppercase">
          {viewerT.adPlaceholderTop}
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="relative rounded-none overflow-hidden border-2 border-black mb-8 aspect-video w-full bg-neutral-100" id="viewer-hero-image">
        <img
          src={article.coverImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Table of Contents Box */}
      {headings.length > 0 && (
         <div className="bg-neutral-50 border-2 border-black rounded-none p-5 mb-8 animate-in fade-in" id="viewer-toc-box">
          <h4 className="font-sans font-black text-sm text-black mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-black" />
            <span>{viewerT.tocTitle}</span>
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
            {headings.map((heading) => (
              <li key={heading.id} className="flex items-center gap-1.5 text-neutral-700 hover:text-black transition-colors">
                <Hash className="w-3.5 h-3.5 text-black animate-pulse" />
                <a href={`#${heading.id}`} className="hover:underline hover:line-through">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Content Body */}
      <div className={`prose max-w-none text-black ${lang === 'ar' ? 'text-right' : 'text-left'}`} id="viewer-content-body">
        {renderFormattedContent()}
      </div>

      {/* Adsterra Middle Slot banner */}
      <div className="bg-neutral-50 border-2 border-black text-center rounded-none p-4 my-8 flex flex-col items-center justify-center" id="viewer-ad-middle">
        <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-wider mb-1 uppercase">{viewerT.adLabelMid}</span>
        <div className="border border-dashed border-black w-full py-3 bg-white text-xs font-mono text-neutral-500 uppercase">
          {viewerT.adPlaceholderMid}
        </div>
      </div>

      {/* SEO keywords tags list */}
      {article.keywords && article.keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-8 mb-6 border-t border-dashed border-neutral-300 pt-6" id="viewer-keywords-tags">
          <span className="text-xs font-black text-neutral-400 font-mono uppercase">{lang === 'ar' ? 'الكلمات الدلالية:' : 'SEO Keywords:'}</span>
          {article.keywords.map((word, idx) => (
            <span
              key={idx}
              className="bg-neutral-100 text-black font-black text-[11px] px-2.5 py-1 rounded-none border border-black italic"
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {/* Adsterra Bottom Slot banner */}
      <div className="bg-neutral-50 border-2 border-black text-center rounded-none p-4 mb-8 flex flex-col items-center justify-center" id="viewer-ad-bottom">
        <span className="text-[9px] font-mono font-bold text-neutral-400 tracking-wider mb-1 uppercase">{viewerT.adLabelBot}</span>
        <div className="border border-dashed border-black w-full py-4 bg-white text-xs font-mono text-neutral-500 uppercase">
          {viewerT.adPlaceholderBot}
        </div>
      </div>

      {/* Social Media Share Section */}
      <div className="border-t border-dashed border-neutral-300 pt-6 mb-10 text-center" id="viewer-share-footer">
        <span className="text-neutral-500 text-xs font-black block mb-3 font-mono uppercase">{t.shareOnSocial}</span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-none hover:bg-neutral-800 transition-all text-xs font-bold border border-black shadow-xs cursor-pointer"
          >
            <Link2 className="w-4 h-4 text-white" />
            <span>{t.copyLink}</span>
          </button>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-black border-2 border-black rounded-none hover:bg-neutral-50 transition-all text-xs font-bold shadow-xs"
          >
            <Twitter className="w-4 h-4 text-black" />
            <span>{viewerT.shareX}</span>
          </a>
          <a
            href={`https://telegram.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-200 text-black border-2 border-black rounded-none hover:bg-neutral-100 transition-all text-xs font-bold shadow-xs"
          >
            <Send className="w-4 h-4 text-black" />
            <span>{viewerT.telegram}</span>
          </a>
        </div>
      </div>

      {/* Related News List */}
      {relatedArticles.length > 0 && (
        <div className="border-t-2 border-black pt-8 mb-12" id="viewer-related-section">
          <h3 className="font-sans font-black text-xl text-black mb-6 flex items-center gap-2 uppercase tracking-wide">
            <MessageSquare className="w-5 h-5 text-black" />
            <span>{t.relatedArticles}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectArticle(rel.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer flex flex-col bg-white border-2 border-black rounded-none overflow-hidden transition-all duration-300 hover:bg-neutral-50"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 border-b border-black">
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full transform group-hover:scale-101 transition-all duration-300"
                  />
                </div>
                <div className={`p-4 flex flex-col flex-grow ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <span className="text-[9px] bg-black text-white font-black px-2 py-0.5 rounded-none w-max mb-2 uppercase italic border border-black">
                    {getCategoryLabel(rel.category, lang)}
                  </span>
                  <h4 className="font-sans font-black text-sm text-black group-hover:underline line-clamp-2 leading-snug">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400 font-mono mt-auto pt-2">{rel.publishDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comment Section Panel */}
      <div className="border-t-2 border-black pt-8" id="viewer-comments-section">
        <h3 className="font-sans font-black text-xl text-black mb-6 flex items-center gap-2 uppercase tracking-wide">
          <MessageSquare className="w-5 h-5 text-black" />
          <span>{viewerT.commentTitle} ({comments.length})</span>
        </h3>

        {/* Form */}
        <form onSubmit={handleAddComment} className="bg-neutral-50 border-2 border-black p-5 rounded-none mb-8">
          <h4 className="font-sans font-black text-sm text-black mb-4">{viewerT.commentPrompt}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-black text-neutral-500 mb-1">{viewerT.commentUserLabel}</label>
              <input
                type="text"
                required
                placeholder={viewerT.commentUserPlace}
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full bg-white text-xs px-4 py-2.5 rounded-none border border-black focus:outline-none focus:bg-neutral-50 transition-all"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-black text-neutral-500 mb-1">{viewerT.commentTextLabel}</label>
            <textarea
              required
              rows={3}
              placeholder={viewerT.commentTextPlace}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-white text-xs px-4 py-2.5 rounded-none border border-black focus:outline-none focus:bg-neutral-50 transition-all"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-black text-white text-xs font-black px-5 py-2.5 rounded-none hover:bg-neutral-800 transition-all flex items-center gap-2 border border-black cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-white" />
            <span>{t.postComment}</span>
          </button>
        </form>

        {/* Comment List */}
        <div className="space-y-4" id="comments-list-box">
          {comments.length > 0 ? (
            comments.map((comm) => (
              <div key={comm.id} className="bg-white border-2 border-black p-4 rounded-none flex items-start gap-3">
                <div className="w-9 h-9 rounded-none bg-neutral-100 flex items-center justify-center font-black text-black text-xs border border-black">
                  {comm.authorName.slice(0, 2)}
                </div>
                <div className="flex-grow">
                  <div className={`flex items-center justify-between mb-1.5 border-b border-neutral-100 pb-1 ${
                    lang === 'ar' ? 'flex-row' : 'flex-row'
                  }`}>
                    <span className="font-black text-xs text-black">{comm.authorName}</span>
                    <span className="text-[10px] text-neutral-400 font-mono font-black">{comm.date}</span>
                  </div>
                  <p className={`text-neutral-800 text-xs sm:text-sm leading-relaxed font-serif ${
                    lang === 'ar' ? 'text-right' : 'text-left'
                  }`}>{comm.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-neutral-50 border-2 border-black p-8 text-center text-xs font-bold text-neutral-500">
              {t.noCommentsYet}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
