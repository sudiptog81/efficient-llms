import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import Link from 'next/link';
import BaseLayout from '@/layouts/BaseLayout';
import PaperHeader from '@/components/PaperHeader';
import Abstract from '@/components/PaperAbstract';
import Content from '@/components/PaperContent';
import Head from 'next/head';
import ShareFab from '@/components/ShareFab';

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
      <Head>
        <title>{paper.title} | Efficient-LLMs</title>
        <meta name="description" content={paper.abstract} />
        <meta property="og:title" content={`${paper.title} | Efficient-LLMs`} />
        <meta property="og:description" content={paper.abstract} />
        <meta property="og:type" content="website" />
      </Head>
      <main className="max-w-screen md:max-w-4xl mx-auto md:my-12">
        <div className="bg-white dark:bg-zinc-900 md:rounded-2xl md:shadow-lg md:border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-8 md:p-12">
            <PaperHeader paper={paper} />
            <Abstract abstract={paper.abstract} />
            {contentHtml && <Content contentHtml={contentHtml} />}
          </div>
        </div>
      </main>
      <ShareFab paper={paper} />
    </BaseLayout>
  );
}

export async function getStaticPaths() {
  const papersDirectory = path.join('src/data/papers');
  const filenames = fs.readdirSync(papersDirectory);

  const paths = filenames.map((filename) => ({
    params: {
      id: filename.replace(/\.md$/, ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const papersDirectory = path.join('src/data/papers');
  const fullPath = path.join(papersDirectory, `${params.id}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(remarkMath)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeKatex)
      .use(rehypeStringify, { allowDangerousHtml: true })
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
          conference: data.conference,
          abstract: data.abstract,
          citations: data.citations || null,
          doi: data.doi || null,
          links: data.links || null,
          bibtex: data.bibtex || null,
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
