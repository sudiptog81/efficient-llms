import { MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-gray-800 py-10 mt-20 text-center text-sm text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>
          &copy; {new Date().getFullYear()} Laboratory for Computational Social Systems. All Rights Reserved. <br />
          <MapPin className="inline-block ml-2 mb-1 w-3 h-3" /> 3B-7, Block III, Indian Institute of Technology Delhi, Hauz Khas, New Delhi, India 110016.
        </p>
        <div className="mt-4 space-x-4">
          <Link href="https://twitter.com/lcs2lab" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 dark:hover:text-indigo-400">Twitter</Link>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <Link href="https://www.linkedin.com/company/lcs2lab/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-800 dark:hover:text-indigo-400">LinkedIn</Link>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <Link href="mailto:parmanu.lcs2@gmail.com" className="hover:text-indigo-800 dark:hover:text-indigo-400">E-mail</Link>
        </div>
      </div>
    </footer>
  );
}
