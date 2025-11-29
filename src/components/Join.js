import Button from "./Button";

const Join = () => (
  <section id="join" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <div className="p-10 lg:p-20 bg-indigo-600 dark:bg-gray-800 rounded-2xl text-white text-center shadow-2xl">
      <h2 className="text-4xl font-extrabold tracking-tight">
        Drive the Next Wave of Efficient AI.
      </h2>
      <p className="mt-4 text-xl opacity-90 max-w-3xl mx-auto">
        We are always looking for passionate researchers, engineers, and PhD students. Join our highly collaborative environment.
      </p>
      <div className="mt-8 flex justify-center">
        <Button href="mailto:chak.tanmoy.iit@gmail.com" variant="secondary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Apply Now
        </Button>
      </div>
    </div>
  </section>
);

export default Join;
