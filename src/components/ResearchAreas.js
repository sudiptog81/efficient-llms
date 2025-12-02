import { Zap, Package, ChartSpline, Waypoints, Scissors, Merge, Binary, BookCopy, Cog } from "lucide-react";
import Link from "next/link";

const ICONS = {
  Zap,
  Package,
  ChartSpline,
  Waypoints,
  Scissors,
  Merge,
  Binary,
  BookCopy,
  Cog
};

const ResearchAreas = ({ researchAreas = [] }) => (
  <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-gray-800">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold tracking-tight">Research Areas</h2>
      <p className="mt-3 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        We focus on the intersection of theoretical efficiency and practical deployment.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto" >
      {researchAreas.map((area, index) => (
        <Link key={area.title} href={`/areas/${area.slug}`} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-zinc-100 dark:border-gray-800 transform hover:scale-[1.02] transition duration-300">

          <div className="flex flex-row align-center items-center gap-4">
            <div className={`p-3 ${index % 2 === 0 ? 'bg-indigo-500 dark:bg-indigo-400' : 'bg-red-500 dark:bg-red-400'} rounded-lg inline-flex`}
            >
              {/* <div className="p-3 bg-indigo-50 dark:bg-gray-800 rounded-lg inline-flex" suppressHydrationWarning> */}
              {(() => {
                const IconComp = ICONS[area.icon] || Zap;
                return <IconComp className="w-6 h-6 text-white" />;
              })()}
            </div>
            <h3 className="text-xl font-semibold">{area.title}</h3>
          </div>
          {/* <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {area.summary || area.description || ''}
          </p> */}
        </Link>
      ))}
    </div>
  </section>
);

export default ResearchAreas;
