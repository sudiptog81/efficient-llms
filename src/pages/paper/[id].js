"use client";

import React from 'react';
import { FileText, Users, Tag, ExternalLink, Calendar, Building } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import BaseLayout from '@/layouts/BaseLayout';

const PaperHeader = ({ paper }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mt-4">
    <div className="flex items-start gap-3 mb-4">
      <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
        {paper.title}
      </h1>
    </div>

    <div className="flex flex-wrap gap-2 mb-4">
      {paper.categories.map((cat, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
        >
          <Tag className="w-3 h-3" />
          {cat}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        {new Date(paper.publishedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </span>
      {paper.citations && (
        <>
          <span>•</span>
          <span>{paper.citations} citations</span>
        </>
      )}
      {paper.doi && (
        <>
          <span>•</span>
          <span>DOI: {paper.doi}</span>
        </>
      )}
    </div>
  </div>
);

const AuthorCard = ({ author }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
      {author.name.split(' ').map(n => n[0]).join('')}
    </div>
    <div className="min-w-0 flex-1">
      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
        {author.name}
      </div>
      <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
        <Building className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">{author.affiliation}</span>
      </div>
    </div>
  </div>
);

const Authors = ({ authors }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 py-8">
    <h2 className="flex items-center gap-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
      <Users className="w-6 h-6" />
      Authors
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {authors.map((author, idx) => (
        <AuthorCard key={idx} author={author} />
      ))}
    </div>
  </div>
);

const Abstract = ({ abstract }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 py-8">
    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
      Abstract
    </h2>
    <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: abstract }} />
  </div>
);

const Content = ({ contentHtml }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 py-8">
    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
      Content
    </h2>
    <div
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  </div>
);

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
            <Authors authors={paper.authors} />
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
      .use(html)
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
