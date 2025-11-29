import React from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import Link from 'next/link';
import Hero from '@/components/Hero';
import fs from 'fs';
import path from 'path';
import ResearchAreas from '@/components/ResearchAreas';
import RecentPapers from '@/components/RecentPapers';
import Join from '@/components/Join';

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
      const year = date && !isNaN(date.getTime()) ? date.getFullYear() : stat.mtime.getFullYear();

      return {
        title: title || path.basename(fname, '.md'),
        year,
        doi: '#',
        id: path.basename(fname, '.md'),
        _date: date.toISOString(),
      };
    });

    return pubs.sort((a, b) => new Date(b._date) - new Date(a._date)).slice(0, 3);
  } catch (e) {
    return [];
  }
}

export async function getStaticProps() {
  const recentPublications = await loadRecentPublications();
  return {
    props: {
      recentPublications,
    },
  };
}
export default function Home({ recentPublications = [] }) {
  return (
    <BaseLayout>
      <main className="w-full">
        <Hero />
        <ResearchAreas />
        <RecentPapers recentPublications={recentPublications} />
        <Join />
      </main>
    </BaseLayout>
  );
}
