import BaseLayout from "@/layouts/BaseLayout";
import Head from "next/head";

export default function Custom404() {
  return (
    <BaseLayout>
      <Head>
        <title>Page Not Found | Parmanu @ LCS2 IIT Delhi</title>
        <meta name="description" content="404 - The page you are looking for does not exist." />
      </Head>
      <main className="flex items-center justify-center mt-20 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">Oops! 404!</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">We are officially lost, like a needle in a haystack.</p>
        </div>
      </main>
    </BaseLayout>
  );
}
