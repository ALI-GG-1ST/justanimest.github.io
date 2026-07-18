/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Article {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  category: string;
  coverImage: string;
  tags: string[];
  author: string;
  publishDate: string;
  readTime: string;
  keywords: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  views: number;
  lang?: 'ar' | 'en';
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  date: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface AdPlaceholder {
  id: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  label: string;
  codeSnippet: string;
}

export interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  joinDate: string;
  status: 'active' | 'suspended';
  avatarUrl?: string;
  isGoogleUser?: boolean;
}

