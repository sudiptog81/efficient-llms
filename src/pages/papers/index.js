import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import BaseLayout from '@/layouts/BaseLayout';
import IndexPaperCard from '@/components/IndexPaperCard';
import Head from 'next/head';

export default function PapersDirectory({ papers }) {
  return (
    <BaseLayout>
      <Head>
        <title>Publications | Efficient-LLMs</title>
        <meta name="description" content="A comprehensive list of publications related to efficient large language models." />
      </Head>
      <main className="max-w-6xl mx-auto px-6 my-12">
        <header className="text-center mb-12">
        </header>

        {papers.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Oops! I can&apos;t see any papers right now. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {papers.map((paper) => (
              <IndexPaperCard key={paper.slug} paper={paper} />
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
          conference: data.conference || null,
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
