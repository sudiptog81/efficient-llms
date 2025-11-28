export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-gray-800 py-10 mt-20 text-center text-sm text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Laboratory for Computational Social Systems. All rights reserved.
        </p>
        <div className="mt-4 space-x-4">
          <a href="#research" className="hover:text-indigo-600 dark:hover:text-indigo-400">Research</a>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <a href="https://github.com/lab-for-computational-social-systems" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400">GitHub</a>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <a href="mailto:chak.tanmoy.iit@gmail.com" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact</a>
        </div>
      </div>
    </footer>
  );
}
