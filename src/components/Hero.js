import Button from "./Button";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-32 text-center">
      <div className="space-y-6">
        <p className="text-sm font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
          The Future of AI is Compact
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl mx-auto leading-tight">
          Scaling <span className="text-indigo-600 dark:text-indigo-400">Intelligence</span>, Cutting <span className="text-red-500 dark:text-red-400">Cost</span>.
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
          Our research group is dedicated to pioneering techniques—from advanced quantization to sparse architectures—that make Large Language Models accessible and deployable on commodity hardware.
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
    </section>
  );
}
