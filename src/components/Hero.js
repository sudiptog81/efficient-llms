import Button from "./Button";
import Image from "next/image";
import AGIPath from "../../public/resources/landing_agi_path.jpg";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-12 lg:py-32 text-center">
      <div className="space-y-6">
        <p className="text-sm font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
          The Future of AI is Compact
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl mx-auto leading-tight">
          Scaling <span className="text-indigo-600 dark:text-indigo-400">Intelligence</span>, Cutting <span className="text-red-500 dark:text-red-400">Cost</span>.
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          Our research group is dedicated to pioneering techniques—from sparse efficient architectures to scalable inference paradigms—that make large language models accessible and deployable on commodity hardware.
        </p>
      </div>
      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <Button href="#publications" variant="primary">
          View Latest Publications
        </Button>
        <Button href="#join" variant="secondary">
          Join Our Mission
        </Button>
      </div>

      <Image
      src={AGIPath}
      alt="AGI Path"
      className="mt-20 mx-auto max-w-4xl"
      priority
    />
    
    </section>
  );
}
