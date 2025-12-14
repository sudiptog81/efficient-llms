import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import BaseLayout from '@/layouts/BaseLayout';
import IndexPaperCard from '@/components/IndexPaperCard';
import Head from 'next/head';

export default function PapersDirectory({ papers }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Publications",
    "description": "A comprehensive list of publications related to efficient large language models. Brought to you by Laboratory for Computational Social Systems, IIT Delhi.",
    "publisher": {
      "@type": "Organization",
      "name": "Parmanu @ LCS2 IIT Delhi",
      "description": "Laboratory for Computational Social Systems, IIT Delhi"
    },
    ...(papers && papers.length > 0 && {
      "hasPart": papers.map(paper => ({
        "@type": "ScholarlyArticle",
        "headline": paper.title,
        "abstract": paper.abstract,
        "author": paper.authors.map(author => ({
          "@type": "Person",
          "name": author.name
        })),
        "datePublished": paper.publishedDate,
        ...(paper.conference && {
          "publisher": {
            "@type": "Organization",
            "name": paper.conference ? paper.conference : "Parmanu @ LCS2 IIT Delhi"
          }
        })
      }))
    })
  };

  return (
    <BaseLayout>
      <Head>
        <title>Publications | Parmanu @ LCS2 IIT Delhi</title>
        <meta name="description" content="A comprehensive list of publications related to efficient large language models. Brought to you by Laboratory for Computational Social Systems, IIT Delhi." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </Head>
      <main className="max-w-6xl mx-auto px-6 mt-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Publications
          </h1>
          <p className="mt-4 text-lg md:text-xl text-zinc-600 dark:text-zinc-400">
            A list of works from our research group on making LLMs efficient.
          </p>
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
          // citations: data.citations || null,
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
