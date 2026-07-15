/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('⚠️ Warning: GEMINI_API_KEY environment variable is not defined.');
}

// AI Article Generation Endpoint
app.post('/api/gemini/generate-article', async (req, res) => {
  try {
    const { prompt, category, lang = 'ar' } = req.body;
    const isEn = lang === 'en';

    if (!ai) {
      return res.status(500).json({
        error: isEn
          ? 'Gemini API Key (GEMINI_API_KEY) is not configured on the server.'
          : 'لم يتم تكوين مفتاح واجهة برمجة تطبيقات Gemini (GEMINI_API_KEY) في الخادم.',
      });
    }

    if (!prompt) {
      return res.status(400).json({
        error: isEn
          ? 'Please enter the core topic or news idea.'
          : 'الرجاء كتابة الفكرة الأساسية أو موضوع الخبر.',
      });
    }

    const systemInstruction = isEn
      ? `You are an elite, highly professional anime journalist and content writer for the famous news portal "JUST ANIME".
Your job is to craft a highly engaging, accurate, and professional news article in English based on the user's idea.
Format the article using basic HTML tags: H2 for subheadings, P for paragraphs, Blockquote for quotes, and UL/LI for bullet points.
Maintain an exciting, journalistic tone, and ensure the content is well-structured and fully optimized for SEO.`
      : `أنت صحفي وكاتب محتوى أنمي أسطوري ومحترف للغاية لمدونة الأخبار الشهيرة JUST ANIME.
مهمتك هي صياغة خبر أو مقال شيق، دقيق، واحترافي باللغة العربية الفصحى وبأسلوب صحفي جذاب للغاية بناءً على الفكرة أو الموضوع المكتوب.
يجب أن يحتوي المقال على عناوين فرعية H2 وفقرات شيقة واستشهادات جذابة (blockquote) وقوائم نقطية إن أمكن.
تجنب الكلمات الركيكة، واحرص على تقديم محتوى ممتاز ومتوافق مع قواعد السيو (SEO).`;

    const userPrompt = isEn
      ? `Write a detailed article about: "${prompt}" in the category "${category || 'News'}".
Ensure an eye-catching headline (title), an engaging short summary (shortDescription), the complete body content structured with HTML tags (<h2>, <p>, <blockquote>, <ul>, <li>), relevant tags, reading time estimate, and SEO keywords.`
      : `اكتب خبراً مفصلاً عن: "${prompt}" ضمن تصنيف "${category || 'أخبار'}".
تأكد من صياغة عنوان صحفي جذاب، ووصف قصير مثير للاهتمام، ومحتوى كامل دسم مقسم بشكل رائع بـ وسوم H2 وقرأت بـ P واستشهادات بـ blockquote، مع توفير وسوم ومدة قراءة تقديرية وكلمات دلالية ممتازة للسيو.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: isEn 
                ? 'Catchy and exciting main headline for the article in English' 
                : 'العنوان الرئيسي للخبر بلغة عربية قوية ومثيرة وجذابة جداً',
            },
            shortDescription: {
              type: Type.STRING,
              description: isEn
                ? 'Engaging short description summarizing the article for card previews'
                : 'وصف قصير وجذاب يظهر في بطاقات الأخبار ويلخص المقال بشكل مشوق',
            },
            content: {
              type: Type.STRING,
              description: isEn
                ? 'Complete body content rich in information, formatted with HTML tags (<h2>, <p>, <blockquote>, <ul>, <li>)'
                : 'المحتوى الكامل للمقال غني بالمعلومات ومهيأ بـ وسوم HTML الأساسية (<h2>, <p>, <blockquote>, <ul>, <li>)',
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: isEn
                ? 'Relevant tags or hashtags related to the article (3 to 5 tags in English)'
                : 'الوسوم أو الهاشتاغات المتعلقة بالخبر (من 3 إلى 5 وسوم باللغة العربية)',
            },
            readTime: {
              type: Type.STRING,
              description: isEn
                ? 'Estimated reading time, e.g., "4 mins"'
                : 'مدة القراءة التقريبية مثلاً: "4 دقائق"',
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: isEn
                ? 'SEO keywords and search terms in English'
                : 'الكلمات المفتاحية المخصصة لتحسين محركات البحث SEO الكلمات الدلالية',
            },
          },
          required: ['title', 'shortDescription', 'content', 'tags', 'readTime', 'keywords'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('لم يرجع نموذج الذكاء الاصطناعي أي استجابة.');
    }

    const generatedData = JSON.parse(text.trim());
    res.json(generatedData);
  } catch (error: any) {
    console.error('Error generating article:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء توليد المقال بالذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.',
      details: error.message,
    });
  }
});

// Sitemap.xml dynamic or static generation route
app.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
    
    // In dev mode or if sitemap doesn't exist yet, generate it on-the-fly
    if (!fs.existsSync(sitemapPath) || process.env.NODE_ENV !== 'production') {
      const { generateSitemap } = await import('./src/lib/sitemap.js');
      await generateSitemap();
    }

    if (fs.existsSync(sitemapPath)) {
      res.header('Content-Type', 'application/xml');
      return res.sendFile(sitemapPath);
    }
    
    res.status(404).send('Sitemap not found');
  } catch (error) {
    console.error('Error serving sitemap.xml:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve frontend build / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [JUST ANIME Server] running on http://localhost:${PORT}`);
  });
}

startServer();
