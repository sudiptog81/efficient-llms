const AreaContent = ({ contentHtml }) => (
  <div className="py-2">
    <div
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  </div>
);

export default AreaContent;
