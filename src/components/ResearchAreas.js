const researchAreas = [
  // {
  //   icon: (
  //     <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0h6" />
  //     </svg>
  //   ),
  //   title: "Quantization & Sparsity",
  //   description: "Developing novel methods to compress model weights to 4-bit and below with minimal perplexity loss, focusing on structured sparsity for hardware acceleration.",
  // },
  {
    icon: (
      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Efficient Architectures",
    description: "Designing dynamic and conditional computation models, including Mixture-of-Experts (MoE) and state-of-the-art KV-Cache optimization techniques for faster decoding.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.275a1.879 1.879 0 011.05 3.493l-1.464 1.464m-6.31 4.54a1.879 1.879 0 01-2.659-2.659l1.464-1.464m-9.395 3.033a1.879 1.879 0 01-1.05-3.493l1.464-1.464m6.31-4.54a1.879 1.879 0 012.659 2.659l-1.464 1.464m4.54-6.31a1.879 1.879 0 013.493 1.05l-1.464 1.464m-6.57 6.57a1.879 1.879 0 01-3.493-1.05l1.464-1.464m4.54-6.31a1.879 1.879 0 01-1.05 3.493l1.464 1.464" />
      </svg>
    ),
    title: "Efficient Fine-Tuning",
    description: "Investigating data filtering, curriculum learning, and synthetic data generation strategies to achieve high performance with significantly smaller training budgets.",
  },
  // {
  //   icon: (
  //     <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m-4 10a1 1 0 100-2 1 1 0 000 2z" />
  //     </svg>
  //   ),
  //   title: "Hardware-Software Co-Design",
  //   description: "Collaborating with hardware groups to design models (e.g., small operators) that maximize throughput and minimize latency on specialized AI accelerators.",
  // },
];

const ResearchAreas = () => (
  <section id="research" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-zinc-200 dark:border-gray-800">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold tracking-tight">Core Research Pillars</h2>
      <p className="mt-3 text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
        We focus on the intersection of theoretical efficiency and practical deployment.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {researchAreas.map((area) => (
        <div key={area.title} className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-zinc-100 dark:border-gray-800 transform hover:scale-[1.02] transition duration-300">

          <div className="flex flex-row align-center items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-gray-800 rounded-lg inline-flex mb-4">
              {area.icon}
            </div>
            <h3 className="text-xl font-semibold mb-4">{area.title}</h3>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            {area.description}
          </p>
        </div>
      ))}
    </div>
  </section>
);

export default ResearchAreas;
