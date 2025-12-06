import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import React from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import Head from 'next/head';
import ToolCard from '@/components/ToolCard';

export default function Tools({ tools }) {
  return (
    <BaseLayout>
      <Head>
        <title>Tools | Parmanu @ LCS2 IIT Delhi</title>
        <meta name="description" content="Tools created by our researchers for making large language models efficient. Find out more about our research and innovations in this field." />
      </Head>
      <main className="max-w-6xl mx-auto px-6 mt-10">
        <header className="text-center mb-12">
          <h2 className="text-4xl font-extrabold tracking-tight">
            Tools
          </h2>
          <p className="mt-4 text-lg md:text-xl text-zinc-600 dark:text-gray-400">
            Explore the tools developed by our researchers.
          </p>
        </header>

        {tools && tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <ToolCard key={index} tool={tool} index={index} />
            ))}
          </div>
        ) : (
          <p>Oops! I can&apos;t find any tools at the moment.</p>
        )}
      </main>
    </BaseLayout>
  );
}

const TOOLS_FILE = path.join(process.cwd(), 'src/data/tools.yaml');

export async function getStaticProps() {
  try {
    const fileContents = fs.readFileSync(TOOLS_FILE, 'utf8');
    const { tools } = yaml.load(fileContents);
    return {
      props: {
        tools,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        tools: [],
      },
    };
  }
}
