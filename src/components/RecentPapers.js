import { Link } from "lucide-react";
import Button from "./Button";

const RecentPapers = ({ recentPublications }) => (
  <section id="publications" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-gray-800 bg-zinc-100 dark:bg-gray-900">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold tracking-tight">Recent Publications</h2>
      <p className="mt-3 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        See our latest breakthroughs in model compression and inference.
      </p>
    </div>

    <div className="max-w-4xl mx-auto space-y-6">
      {recentPublications.map((pub, index) => (
        <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white dark:bg-gray-950 rounded-lg shadow-md border border-zinc-100 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {pub.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Published {pub.year}
            </p>
          </div>
          <Link
            href={`papers/${pub.id ? pub.id : pub.doi}`}
            className="mt-3 sm:mt-0 text-sm font-medium text-zinc-700 hover:text-indigo-600 dark:text-zinc-200 dark:hover:text-indigo-400 flex items-center gap-1"
          >
            Read Paper
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      ))}
      <div className="pt-6 text-center">
        <Button href={"/papers"} variant="secondary">
          See All Research Archive
        </Button>
      </div>
    </div>
  </section>
);

export default RecentPapers;
