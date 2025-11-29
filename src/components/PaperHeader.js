import { ExternalLink, FileText } from "lucide-react";
import AuthorList from "./AuthorList";
import Link from "next/link";

const Links = ({ links }) => {
  if (!links) return null;

  return (
    <div className="flex flex-wrap gap-8 pt-8 justify-center">
      {links.arxiv && (
        <Link
          href={links.arxiv}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          arXiv
        </Link>
      )}
      {links.pdf && (
        <Link
          href={links.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          PDF
        </Link>
      )}
      {links.code && (
        <Link
          href={links.code}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Code
        </Link>
      )}
      {links.website && (
        <Link
          href={links.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Website
        </Link>
      )}
    </div>
  );
};

const PaperHeader = ({ paper }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mt-4">
    <div className="flex items-start gap-3 mb-4">
      {/* <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" /> */}
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight text-center">
        {paper.title}
      </h1>
    </div>

    <AuthorList authors={paper.authors} />

    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {paper.categories.map((cat, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
        >
          {cat}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
      <span className="flex items-center gap-1">
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

    <Links links={paper.links} />
  </div>
);

export default PaperHeader;
