import Image from "next/image";
import Link from "next/link";

const Sponsors = ({ sponsors }) => (
  <section id="sponsors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-gray-800">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold tracking-tight">Sponsors</h2>
      <p className="mt-3 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        We are grateful to our sponsors who help us drive innovation in efficient large language models.
      </p>
    </div>

    <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-8 justify-center" >
      {sponsors.map((sponsor) => (
        <Link key={sponsor.name} href={sponsor.website} target="_blank" rel="noopener noreferrer" className="w-full px-3 py-6 md:py-0 flex items-center">
          <div className="w-full flex flex-col align-center items-center justify-center">
            <div className="rounded-lg">
              <Image src={sponsor.logo} alt={sponsor.name} width={200} height={200} className={`w-auto h-auto object-contain ${sponsor.dark_invert ? 'dark:invert' : ''}`} />
            </div>
          </div>
        </Link>
      ))}
    </div>

  </section>
);

export default Sponsors;
