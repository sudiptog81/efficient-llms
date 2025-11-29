"use client";

import React from 'react';
import { FileText, Users, Tag, ExternalLink, Calendar, Building } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import BaseLayout from '@/layouts/BaseLayout';
import PaperHeader from '@/components/PaperHeader';
import AuthorList from '@/components/AuthorList';
import Abstract from '@/components/PaperAbstract';
import Content from '@/components/PaperContent';

const Links = ({ links }) => {
  if (!links) return null;

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Resources
      </h2>
      <div className="flex flex-wrap gap-3">
        {links.arxiv && (
          <a
            href={links.arxiv}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            arXiv
          </a>
        )}
        {links.pdf && (
          <a
            href={links.pdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            PDF
          </a>
        )}
        {links.code && (
          <a
            href={links.code}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Code
          </a>
        )}
        {links.website && (
          <a
            href={links.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Website
          </a>
        )}
      </div>
    </div>
  );
};

export default function PaperPage({ paper, contentHtml }) {
  if (!paper) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">Paper not found</p>
        </div>
      </div>
    );
  }

  return (
    <BaseLayout>
      <main className="max-w-4xl mx-auto px-6 my-12">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-8 md:p-12">
            <PaperHeader paper={paper} />
            <AuthorList authors={paper.authors} />
            <Abstract abstract={paper.abstract} />
            {contentHtml && <Content contentHtml={contentHtml} />}
            <Links links={paper.links} />
          </div>
        </div>
      </main>
    </BaseLayout>
  );
}

export async function getStaticPaths() {
  const papersDirectory = path.join('src/data/papers');
  console.log('Reading papers from directory:', papersDirectory);
  const filenames = fs.readdirSync(papersDirectory);

  const paths = filenames.map((filename) => ({
    params: {
      id: filename.replace(/\.md$/, ''),
    },
  }));

  console.log('Generated paths for static generation:', paths);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  console.log('Fetching paper with params:', params);
  const papersDirectory = path.join('src/data/papers');
  const fullPath = path.join(papersDirectory, `${params.id}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html, { allowDangerousHtml: true })
      .process(content);
    const contentHtml = processedContent.toString();

    return {
      props: {
        paper: {
          slug: params.id,
          title: data.title,
          authors: data.authors,
          categories: data.categories,
          publishedDate: data.publishedDate,
          abstract: data.abstract,
          citations: data.citations || null,
          doi: data.doi || null,
          links: data.links || null,
        },
        contentHtml: content ? contentHtml : null,
      },
    };
  } catch (error) {
    console.error('Error loading paper:', error);
    return {
      props: {
        paper: null,
        contentHtml: null,
      },
    };
  }
}
