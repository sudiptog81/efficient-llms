const Content = ({ contentHtml }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 py-8">
    <div
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  </div>
);

export default Content;
