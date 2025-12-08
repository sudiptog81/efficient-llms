import BaseLayout from "@/layouts/BaseLayout";
import Head from "next/head";

export default function Custom500() {
  return (
    <BaseLayout>
      <Head>
        <title>Internal Server Error | Parmanu @ LCS2 IIT Delhi</title>
        <meta name="description" content="500 - Internal Server Error." />
      </Head>
      <main className="flex items-center justify-center mt-20 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">Oops! 500!</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Something is broken, please let us know!</p>
        </div>
      </main>
    </BaseLayout>
  );
}
