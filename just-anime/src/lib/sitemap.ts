/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Fallback articles in case firestore fetch fails
import { initialArticles } from '../data/initialArticles';

const resolvedDirname = (typeof import.meta !== 'undefined' && import.meta.url)
  ? path.dirname(fileURLToPath(import.meta.url))
  : process.cwd();

// Read Firebase Config directly
const configPath = path.resolve(resolvedDirname, '../../firebase-applet-config.json');
let firebaseConfig: any;
try {
  firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.warn("⚠️ Warning: Could not read firebase-applet-config.json. Using fallback placeholder.");
  firebaseConfig = {
    apiKey: "AIzaSyPlaceholderKeyForLocalDevelopmentAndPreviewOnly",
    authDomain: "cuwer3rizveqaw62fg4mzd-541487428299.firebaseapp.com",
    projectId: "cuwer3rizveqaw62fg4mzd-541487428299",
    storageBucket: "cuwer3rizveqaw62fg4mzd-541487428299.appspot.com",
    messagingSenderId: "541487428299",
    appId: "1:541487428299:web:placeholderappid",
    firestoreDatabaseId: "(default)"
  };
}

// Hostname configuration
// Change this to match development or production domains
const BASE_URL = process.env.APP_URL || 'https://ais-pre-cuwer3rizveqaw62fg4mzd-541487428299.europe-west1.run.app';

export async function generateSitemap() {
  console.log("⚡ Starting Sitemap Generation...");
  let articlesList: any[] = [];

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
    const articlesCol = collection(db, 'articles');
    
    console.log("🔍 Querying articles from Firestore with a 2-second timeout...");
    const fetchPromise = getDocs(articlesCol);
    const timeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error("Timeout waiting for Firestore")), 2000)
    );
    
    const querySnapshot = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (querySnapshot && !querySnapshot.empty) {
      querySnapshot.forEach((docSnap: any) => {
        const data = docSnap.data();
        articlesList.push({
          id: docSnap.id,
          publishDate: data.publishDate || new Date().toISOString().split('T')[0],
          lang: data.lang || 'ar',
        });
      });
      console.log(`✅ Successfully fetched ${articlesList.length} articles from Firestore.`);
    } else {
      console.log("ℹ️ Firestore articles collection is empty. Falling back to initialArticles.");
      articlesList = initialArticles;
    }
  } catch (error) {
    console.warn("⚠️ Firestore query failed or timed out during build. Falling back to initialArticles.", error);
    articlesList = initialArticles;
  }

  // Generate XML content
  const lastModDefault = new Date().toISOString().split('T')[0];

  // Base routes of the application
  const routes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Write static base routes
  for (const route of routes) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route.url}</loc>\n`;
    xml += `    <lastmod>${lastModDefault}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Write dynamic article routes
  for (const article of articlesList) {
    // Standard URL query parameter used by the SPA to open a specific article
    const articleUrl = `/?article=${article.id}`;
    const pubDate = article.publishDate ? article.publishDate.split('T')[0] : lastModDefault;
    
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${articleUrl}</loc>\n`;
    xml += `    <lastmod>${pubDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  // Write to both 'dist/sitemap.xml' and 'public/sitemap.xml' if directories exist
  const distDir = path.resolve(resolvedDirname, '../../dist');
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const sitemapDistPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapDistPath, xml, 'utf8');
  console.log(`🎉 Sitemap successfully generated and saved to: ${sitemapDistPath}`);
}

// Run immediately if this script was executed directly from the command line
const isDirectRun = process.argv[1] && (
  ((typeof import.meta !== 'undefined' && import.meta.url) ? process.argv[1] === fileURLToPath(import.meta.url) : false) ||
  process.argv[1].endsWith('sitemap.ts') ||
  process.argv[1].endsWith('sitemap.js')
);

if (isDirectRun) {
  generateSitemap()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
