/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article } from '../types';

export function generateNewsArticleSchema(article: Article): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.shortDescription,
    'image': [article.coverImage],
    'datePublished': `${article.publishDate}T09:00:00+03:00`,
    'dateModified': `${article.publishDate}T12:00:00+03:00`,
    'author': [
      {
        '@type': 'Person',
        'name': article.author,
        'jobTitle': 'محرر أخبار أنمي',
      },
    ],
    'publisher': {
      '@type': 'Organization',
      'name': 'JUST ANIME',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop',
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://just-anime.pages.dev/article/${article.id}`,
    },
    'keywords': article.keywords.join(', '),
  };

  return JSON.stringify(schema, null, 2);
}

export function generateOrganizationSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'JUST ANIME',
    'url': 'https://just-anime.pages.dev',
    'logo': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=200&auto=format&fit=crop',
    'sameAs': [
      'https://twitter.com/justanime',
      'https://facebook.com/justanime',
      'https://instagram.com/justanime',
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'الدعم الفني والتحرير',
      'email': 'alawyabbas15@gmail.com',
    },
  };

  return JSON.stringify(schema, null, 2);
}

export function generateBreadcrumbSchema(category: string, title?: string): string {
  const itemsList = [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'الرئيسية',
      'item': 'https://just-anime.pages.dev/',
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': category,
      'item': `https://just-anime.pages.dev/category/${encodeURIComponent(category)}`,
    },
  ];

  if (title) {
    itemsList.push({
      '@type': 'ListItem',
      'position': 3,
      'name': title,
      'item': `https://just-anime.pages.dev/article/active`,
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': itemsList,
  };

  return JSON.stringify(schema, null, 2);
}
