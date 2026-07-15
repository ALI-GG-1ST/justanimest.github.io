/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Article } from '../types';

interface SEOHeadProps {
  article: Article | null;
  lang: 'ar' | 'en';
}

export default function SEOHead({ article, lang }: SEOHeadProps) {
  useEffect(() => {
    const isAr = lang === 'ar';
    const siteUrl = window.location.origin;
    const currentUrl = window.location.href;

    // Helper to update or create a meta tag
    const setMetaTag = (nameOrProperty: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${nameOrProperty}"]`
        : `meta[name="${nameOrProperty}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', nameOrProperty);
        } else {
          element.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create canonical link tag
    const setCanonicalLink = (url: string) => {
      let element = document.querySelector('link[rel="canonical"]');
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
      }
      element.setAttribute('href', url);
    };

    // Determine values based on current active article state
    let title = '';
    let description = '';
    let keywords = '';
    let ogType = 'website';
    let ogImage = `${siteUrl}/assets/default-share.jpg`; // Fallback image if any
    let schemaData: any = null;

    if (article) {
      // Dynamic Article SEO
      title = `${article.title} | JUST ANIME`;
      description = article.shortDescription || article.content.substring(0, 160) + '...';
      keywords = article.keywords && article.keywords.length > 0 
        ? article.keywords.join(', ') 
        : `${article.category}, anime, manga, ${article.tags.join(', ')}`;
      ogType = 'article';
      ogImage = article.coverImage || ogImage;

      // JSON-LD NewsArticle / BlogPosting schema for search engine crawlers
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': article.title,
        'description': description,
        'image': [ogImage],
        'datePublished': article.publishDate || new Date().toISOString(),
        'dateModified': article.publishDate || new Date().toISOString(),
        'author': {
          '@type': 'Person',
          'name': article.author || 'JUST ANIME Team',
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'JUST ANIME',
          'logo': {
            '@type': 'ImageObject',
            'url': `${siteUrl}/logo.png`, // Fallback/relative placeholder logo
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': currentUrl,
        }
      };
    } else {
      // Frontpage / Main Index SEO
      if (isAr) {
        title = 'JUST ANIME - تسريبات وأخبار الأنمي والمانجا الحصرية';
        description = 'الشبكة الأولى والأسرع لتسريبات الأنمي والمانجا، آخر أخبار وتحديثات الأنمي والترجمات الحصرية على مدار الساعة مع دعم الترجمة العربية والانجليزية.';
        keywords = 'أنمي, مانجا, تسريبات, أخبار الأنمي, ترجمة أنمي, ون بيس, جوجوتسو كايسن, هجوم العمالقة, بليتش, ميزات حصرية';
      } else {
        title = 'JUST ANIME - Exclusive Anime & Manga News, Leaks and Chapters';
        description = 'The premier and fastest community network for 24/7 anime news, leaks, manga translations, exclusive articles, and real-time community engagement.';
        keywords = 'anime, manga, leaks, anime news, manga chapters, anime translations, one piece, jujutsu kaisen, attack on titan, bleach, anime brief, adblock bypass';
      }

      // JSON-LD WebSite schema for search engine crawlers
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'JUST ANIME',
        'url': siteUrl,
        'description': description,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${siteUrl}/?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      };
    }

    // Apply document-level updates
    document.title = title;
    setCanonicalLink(currentUrl);

    // Standard meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);

    // Open Graph (Facebook / Discord / Slack)
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:site_name', 'JUST ANIME', true);

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    // Dynamic JSON-LD script injection
    let scriptElement = document.getElementById('json-ld-schema');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = 'json-ld-schema';
      scriptElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(schemaData, null, 2);

    // Cleanup logic if needed (optional)
  }, [article, lang]);

  return null; // This component handles side-effects in head, rendering nothing in DOM
}
