const PaperContent = ({ contentHtml }) => (
  <div className="py-8">
    <div
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-text-base prose-p:leading-6"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  </div>
);

export default PaperContent;
