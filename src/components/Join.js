import { MailIcon } from "lucide-react";
import Button from "./Button";

const Join = () => (
  <section id="join" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-10">
    <div className="p-10 lg:p-20 bg-indigo-800 dark:bg-indigo-500 rounded-2xl text-white text-center shadow-2xl">
      <h2 className="text-4xl font-extrabold tracking-tight">
        Drive the Next Wave of Efficient AI.
      </h2>
      <p className="mt-4 text-xl opacity-90 max-w-3xl mx-auto">
        We are always looking for passionate researchers, engineers, and PhD students. Join our highly collaborative environment.
      </p>
      <div className="mt-8 flex justify-center">
        <Button href="mailto:parmanu.lcs2@gmail.com?subject=[Parmanu]%20Interested%20in%20Joining%20LCS2&cc=chak.tanmoy.iit@gmail.com" variant="secondary">
          <MailIcon className="w-4 h-4 mr-1 -mt-[1px]" strokeWidth={3} />
          <span className="font-bold">Apply Now</span>
        </Button>
      </div>
    </div>
  </section>
);

export default Join;
