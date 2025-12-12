import Link from "next/link";

export default function Button({ href, children, variant = 'primary', ...props }) {
  const baseClasses = "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-colors border shadow-md";
  const primaryClasses = "bg-indigo-800 text-white hover:bg-indigo-700 border-indigo-800 hover:border-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-800 dark:border-indigo-500 dark:hover:border-indigo-800";
  const secondaryClasses = "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-700";
  const dangerClasses = "bg-red-600 text-white hover:bg-red-700 border-red-600 hover:border-red-700 dark:bg-red-400 dark:hover:bg-red-600 dark:border-red-400 dark:hover:border-red-600";
  const successClasses = "bg-green-600 text-white hover:bg-green-700 border-green-600 hover:border-green-700 dark:bg-green-400 dark:hover:bg-green-600 dark:border-green-400 dark:hover:border-green-600 dark:text-gray-950";

  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      className={`${baseClasses} ${variant === 'primary' ? primaryClasses : variant === 'secondary' ? secondaryClasses : variant === 'danger' ? dangerClasses : successClasses}`}
      {...props}
    >
      {children}
    </Link>
  );
};
