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
import Content from '@/components/PaperContent';
import IndexPaperCard from '@/components/IndexPaperCard';
import Head from 'next/head';

export default function AreaPage({ area, contentHtml, papersForArea }) {
  if (!area) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-xl text-zinc-600 dark:text-zinc-400">Area not found</p>
        </div>
      </div>
    );
  }

  return (
    <BaseLayout>
      <Head>
        <title>{area.title} | Parmanu @ LCS2 IIT Delhi</title>
        <meta name="description" content={area.summary} />
        <meta property="og:title" content={`${area.title} | Parmanu @ LCS2 IIT Delhi`} />
        <meta property="og:description" content={area.summary} />
        <meta property="og:type" content="website" />
      </Head>
      <main className="max-w-4xl mx-auto px-6">
        <div className="overflow-hidden">
          <div className="pt-8 md:pt-12 pb-4">
            <h2
              className="text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50"
            >
              {area.title}
            </h2>
            {area.summary && <p className="text-zinc-700 dark:text-zinc-400">{area.summary}</p>}
            {contentHtml && <Content contentHtml={contentHtml} />}
          </div>
        </div>
        {papersForArea && papersForArea.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {papersForArea.map((paper) => (
                <IndexPaperCard key={paper.slug} paper={paper} />
              ))}
            </div>
          </div>
        )}
      </main>
    </BaseLayout>
  );
}

export async function getStaticPaths() {
  const areasDirectory = path.join('src/data/areas');
  const filenames = fs.readdirSync(areasDirectory);

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
  const areasDirectory = path.join('src/data/areas');
  const fullPath = path.join(areasDirectory, `${params.id}.md`);

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

    // load all papers and filter by categories matching area tags
    const PAPERS_DIRECTORY = path.join(process.cwd(), 'src/data/papers');
    let papers = [];
    try {
      const paperFiles = fs.readdirSync(PAPERS_DIRECTORY).filter(f => f.endsWith('.md'));
      papers = paperFiles.map((filename) => {
        const fullPaperPath = path.join(PAPERS_DIRECTORY, filename);
        const fileContents = fs.readFileSync(fullPaperPath, 'utf8');
        const { data: paperData } = matter(fileContents);

        return {
          slug: filename.replace(/\.md$/, ''),
          title: paperData.title,
          abstract: paperData.abstract,
          categories: paperData.categories || [],
          publishedDate: paperData.publishedDate,
          conference: paperData.conference || null,
          authors: paperData.authors,
          citations: paperData.citations || null,
        };
      });
    } catch (err) {
      console.error('Error loading papers for area page:', err);
      papers = [];
    }

    const areaTags = data.tags || [];
    const papersForArea = (areaTags.length > 0)
      ? papers.filter(p => Array.isArray(p.categories) && p.categories.some(cat => areaTags.includes(cat)))
      : [];

    return {
      props: {
        area: {
          slug: params.id,
          title: data.title,
          summary: data.summary,
          tags: data.tags || null,
        },
        contentHtml: content ? contentHtml : null,
        papersForArea,
      },
    };
  } catch (error) {
    console.error('Error loading area:', error);
    return {
      props: {
        area: null,
        contentHtml: null,
      },
    };
  }
}
