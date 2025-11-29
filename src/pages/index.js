import React from 'react';
import Image from "next/image";
import BaseLayout from '@/layouts/BaseLayout';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Button from '@/components/Button';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import fs from 'fs';
import path from 'path';

const researchAreas = [
  // {
  //   icon: (
  //     <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
  //     </svg>
  //   ),
  //   title: "Quantization & Sparsity",
  //   description: "Developing novel methods to compress model weights to 4-bit and below with minimal perplexity loss, focusing on structured sparsity for hardware acceleration.",
  // },
  {
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Efficient Architectures",
    description: "Designing dynamic and conditional computation models, including Mixture-of-Experts (MoE) and state-of-the-art KV-Cache optimization techniques for faster decoding.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.275a1.879 1.879 0 011.05 3.493l-1.464 1.464m-6.31 4.54a1.879 1.879 0 01-2.659-2.659l1.464-1.464m-9.395 3.033a1.879 1.879 0 01-1.05-3.493l1.464-1.464m6.31-4.54a1.879 1.879 0 012.659 2.659l-1.464 1.464m4.54-6.31a1.879 1.879 0 013.493 1.05l-1.464 1.464m-6.57 6.57a1.879 1.879 0 01-3.493-1.05l1.464-1.464m4.54-6.31a1.879 1.879 0 01-1.05 3.493l1.464 1.464" />
      </svg>
    ),
    title: "Efficient Fine-Tuning",
    description: "Investigating data filtering, curriculum learning, and synthetic data generation strategies to achieve high performance with significantly smaller training budgets.",
  },
 
];

async function loadRecentPublications() {
  const papersDir = path.join(process.cwd(), 'src', 'data', 'papers');
  try {
    const files = fs.readdirSync(papersDir).filter((f) => f.endsWith('.md'));
    const pubs = files.map((fname) => {
      const full = path.join(papersDir, fname);
      const raw = fs.readFileSync(full, 'utf8');

      // Try to read YAML frontmatter (--- ... ---)
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

      // Fallback: first H1 in markdown
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

    // sort by date desc and take top 3
    return pubs.sort((a, b) => new Date(b._date) - new Date(a._date)).slice(0, 3);
  } catch (e) {
    // If reading fails, return an empty array so the page still renders
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

        <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Core Research Pillars</h2>
            <p className="mt-3 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              We focus on the intersection of theoretical efficiency and practical deployment.
            </p>
          </div>

          {/* Responsive Grid: 1 column on mobile, 2 on medium, 2 on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {researchAreas.map((area) => (
              <div key={area.title} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-zinc-100 dark:border-gray-800 transform hover:scale-[1.02] transition duration-300">
                <div className="p-3 bg-indigo-50 dark:bg-gray-800 rounded-lg inline-flex mb-4">
                  {area.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* PUBLICATIONS Section */}
        <section id="publications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-gray-800 bg-zinc-100 dark:bg-gray-900">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Recent Publications</h2>
            <p className="mt-3 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              See our latest breakthroughs in model compression and inference.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {recentPublications.map((pub, index) => (
              <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white dark:bg-gray-950 rounded-lg shadow-md border border-zinc-100 dark:border-gray-800">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Published {pub.year}
                  </p>
                </div>
                <Link
                  href={`papers/${pub.id ? pub.id : pub.doi}`}
                  className="mt-3 sm:mt-0 text-sm font-medium text-zinc-700 hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-indigo-400 flex items-center gap-1"
                >
                  Read Paper
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            ))}
            <div className="pt-6 text-center">
              <Button href={"/papers"} variant="secondary">
                See All Research Archive
              </Button>
            </div>
          </div>
        </section>

        <section id="join" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="p-10 lg:p-20 bg-indigo-600 dark:bg-gray-800 rounded-2xl text-white text-center shadow-2xl">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Drive the Next Wave of Efficient AI.
            </h2>
            <p className="mt-4 text-xl opacity-90 max-w-3xl mx-auto">
              We are always looking for passionate researchers, engineers, and PhD students. Join our highly collaborative environment.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="mailto:chak.tanmoy.iit@gmail.com" variant="secondary">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Apply Now
              </Button>
            </div>
          </div>
        </section>

      </main>
    </BaseLayout>
  );
}
