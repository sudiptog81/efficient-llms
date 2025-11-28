import React from 'react';
import { FileText, Tag, Calendar, Users } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import BaseLayout from '@/layouts/BaseLayout';

const PaperCard = ({ paper }) => (
  <Link
    href={`/papers/${paper.slug}`}
    className="block p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg"
  >
    <div className="flex items-start gap-3 mb-3">
      <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
        {paper.title}
      </h3>
    </div>

    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-3">
      {paper.abstract}
    </p>

    <div className="flex flex-wrap gap-2 mb-3">
      {paper.categories.slice(0, 2).map((cat, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium"
        >
          <Tag className="w-3 h-3" />
          {cat}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
      <span className="flex items-center gap-1">
        <Calendar className="w-3 h-3" />
        {new Date(paper.publishedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </span>
      <span className="flex items-center gap-1">
        <Users className="w-3 h-3" />
        {paper.authors.length} {paper.authors.length === 1 ? 'Author' : 'Authors'}
      </span>
      {paper.citations && (
        <span className="text-xs">
          • {paper.citations} citations
        </span>
      )}
    </div>
  </Link>
);

export default function PapersDirectory({ papers }) {
  return (
    <BaseLayout>
      <main className="max-w-6xl mx-auto px-6 my-12">
        <header className="text-center mb-12">
        </header>

        {papers.length === 0 ? (
          <div className="text-center p-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              No papers found in the directory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {papers.map((paper) => (
              <PaperCard key={paper.slug} paper={paper} />
            ))}
          </div>
        )}
      </main>
    </BaseLayout>
  );
}

const PAPERS_DIRECTORY = path.join(process.cwd(), 'src/data/papers');

export async function getStaticProps() {
  try {
    const filenames = fs.readdirSync(PAPERS_DIRECTORY);

    const papers = filenames
      .filter(filename => filename.endsWith('.md')) // Filter for markdown files
      .map((filename) => {
        const fullPath = path.join(PAPERS_DIRECTORY, filename);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const { data } = matter(fileContents);

        return {
          slug: filename.replace(/\.md$/, ''), // e.g., 'my-paper.md' -> 'my-paper'
          title: data.title,
          abstract: data.abstract,
          categories: data.categories,
          publishedDate: data.publishedDate,
          authors: data.authors,
          citations: data.citations || null,
        };
      })
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    return {
      props: {
        papers,
      },
    };
  } catch (error) {
    console.error('Error fetching papers directory:', error);
    return {
      props: {
        papers: [],
      },
    };
  }
}
