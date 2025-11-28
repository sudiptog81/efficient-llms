export default function Button({ href, children, variant = 'primary' }) {
  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors border shadow-md";
  const primaryClasses = "bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:border-indigo-500 dark:hover:border-indigo-600";
  const secondaryClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700";

  return (
    <a
      href={href}
      rel="noopener noreferrer"
      className={`${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses}`}
    >
      {children}
    </a>
  );
};
