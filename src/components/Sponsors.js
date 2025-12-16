import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const Sponsors = ({ sponsors }) => {
  const { theme } = useTheme();

  return (
    <section id="sponsors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-gray-800">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight">Sponsors</h2>
        <p className="mt-3 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          We are grateful to our sponsors who help us drive innovation in efficient large language models.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2 md:gap-8 justify-center" >
        {sponsors.map((sponsor) => (
          <Link key={sponsor.name} href={sponsor.website} target="_blank" rel="noopener noreferrer" className="w-full px-3 py-6 md:py-0 flex justify-center items-center">
            <Image src={theme === "dark" && sponsor.dark_image ? sponsor.dark_image : sponsor.logo} alt={sponsor.name} width={180} height={180} className={`object-contain ${sponsor.dark_invert ? 'dark:invert' : ''}`} />
          </Link>
        ))}
      </div>

    </section>
  );
};

export default Sponsors;
