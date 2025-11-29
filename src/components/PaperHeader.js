import { Calendar, FileText, Tag } from "lucide-react";

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

export default PaperHeader;
