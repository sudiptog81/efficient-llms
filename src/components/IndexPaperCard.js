import Link from "next/link";

const IndexPaperCard = ({ paper }) => (
  <Link
    href={`/papers/${paper.slug}`}
    className="block p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg"
  >
    <div className="flex items-start gap-3 mb-3">
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
          {cat}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
      <span className="flex items-center gap-1">
        {new Date(paper.publishedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </span>
      {paper.citations && (
        <span className="text-xs">
          • {paper.citations} citations
        </span>
      )}
    </div>
  </Link>
);

export default IndexPaperCard;
