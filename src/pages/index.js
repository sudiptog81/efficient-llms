import React from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import Link from 'next/link';
import Hero from '@/components/Hero';
import fs from 'fs';
import path from 'path';
import ResearchAreas from '@/components/ResearchAreas';
import RecentPapers from '@/components/RecentPapers';
import Join from '@/components/Join';
import Head from 'next/head';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

async function loadRecentPublications() {
  const papersDir = path.join(process.cwd(), 'src', 'data', 'papers');
  try {
    const files = fs.readdirSync(papersDir).filter((f) => f.endsWith('.md'));
    const pubs = files.map((fname) => {
      const full = path.join(papersDir, fname);
      const raw = fs.readFileSync(full, 'utf8');

      const fmMatch = raw.match(/^-{3}([\s\S]*?)-{3}/);
      let title = null;
      let dateStr = null;
      if (fmMatch) {
        const fm = fmMatch[1];
        const titleMatch = fm.match(/title:\s*(.+)/i);
        const dateMatch = fm.match(/date:\s*(.+)/i);
        if (titleMatch) title = titleMatch[1].trim().replace(/^['\"]|['\"]$/g, '');
        if (dateMatch) dateStr = dateMatch[1].trim().replace(/^['\"]|['\"]$/g, '');
      }

      if (!title) {
        const h1 = raw.match(/^#\s+(.+)$/m);
        if (h1) title = h1[1].trim();
      }

      const stat = fs.statSync(full);
      const date = dateStr ? new Date(dateStr) : stat.mtime;

      return {
        title: title || path.basename(fname, '.md'),
        id: path.basename(fname, '.md'),
        _date: date.toISOString(),
      };
    });

    return pubs.sort((a, b) => new Date(b._date) - new Date(a._date)).slice(0, 3);
  } catch (e) {
    return [];
  }
}

async function loadResearchAreas() {
  const areasDir = path.join(process.cwd(), 'src', 'data', 'areas');
  try {
    const files = fs.readdirSync(areasDir).filter((f) => f.endsWith('.md'));
    const areas = files.map((fname) => {
      const full = path.join(areasDir, fname);
      const raw = fs.readFileSync(full, 'utf8');

      const fmMatch = raw.match(/^-{3}([\s\S]*?)-{3}/);
      const area = {};
      if (fmMatch) {
        const fm = fmMatch[1];
        const titleMatch = fm.match(/title:\s*(.+)/i);
        const slugMatch = fm.match(/slug:\s*(.+)/i);
        const summaryMatch = fm.match(/summary:\s*([\s\S]+)/i);
        const iconMatch = fm.match(/icon:\s*(.+)/i);
        if (titleMatch) area.title = titleMatch[1].trim().replace(/^['"]|['"]$/g, '');
        if (slugMatch) area.slug = slugMatch[1].trim().replace(/^['"]|['"]$/g, '');
        if (summaryMatch) area.summary = summaryMatch[1].trim().replace(/^['\n\s]+|[\n\s]+$/g, '');
        if (iconMatch) area.icon = iconMatch[1].trim().replace(/^['\"]|['\"]$/g, '');
      }

      area.title = area.title || path.basename(fname, '.md');
      area.slug = area.slug || path.basename(fname, '.md');

      return area;
    });

    return areas;
  } catch (e) {
    return [];
  }
}

export async function getStaticProps() {
  const recentPublications = await loadRecentPublications();
  const researchAreas = await loadResearchAreas();
  return {
    props: {
      recentPublications,
      researchAreas,
    },
  };
}
export default function Home({ researchAreas = [], recentPublications = [] }) {
  const siteUrl = 'https://parmanu.lcs2.in';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Parmanu @ LCS2 IIT Delhi',
        url: siteUrl,
        description:
          'A comprehensive resource for efficient large language models. Brought to you by Laboratory for Computational Social Systems, IIT Delhi.',
      },
    ],
  };

  return (
    <BaseLayout>
      <Head>
        <title>Parmanu @ LCS2 IIT Delhi | Efficient LLMs for The World </title>
        <meta name="description" content="A comprehensive resource for efficient large language models. Brought to you by Laboratory for Computational Social Systems, IIT Delhi." />
        <meta property="og:title" content="Parmanu @ LCS2 IIT Delhi" />
        <meta property="og:description" content="A comprehensive resource for efficient large language models. Brought to you by Laboratory for Computational Social Systems, IIT Delhi." />
        <meta property="og:type" content="website" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </Head>
      <main className="w-full">
        <Hero />
        <ResearchAreas researchAreas={researchAreas} />
        <RecentPapers recentPublications={recentPublications} />
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-gray-800 pt-20">
          <NewsletterSubscribe />
        </div>
        <Join />
      </main>
    </BaseLayout>
  );
}
