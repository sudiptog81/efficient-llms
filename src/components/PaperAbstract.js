const Abstract = ({ abstract }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 py-8">
    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
      Abstract
    </h2>
    <p className="text-md leading-relaxed text-zinc-700 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: abstract }} />
  </div>
);

export default Abstract;
