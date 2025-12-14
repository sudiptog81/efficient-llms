import Link from "next/link";

const IndexPaperCard = ({ paper }) => (
  <Link
    href={`/papers/${paper.slug}`}
    className="block p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-800 dark:hover:border-indigo-400 transition-all duration-300 bg-white dark:bg-zinc-900 shadow-md hover:shadow-lg"
  >
    <div className="flex flex-col items-start gap-3 mb-3">
      <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
        {paper.conference}
      </h3>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 leading-snug line-clamp-2">
        {paper.title}
      </h2>
    </div>

    <div>
      {paper.categories.slice(0, 2).map((cat, idx) => (
        <span
          key={idx}
          className={`text-indigo-800 dark:text-indigo-300 text-xs font-medium ${idx !== 0 ? "before:content-['•'] before:mx-1" : ""}`}
        >
          {cat}
        </span>
      ))}
    </div>
  </Link>
);

export default IndexPaperCard;
