import { useState } from "react";
import { Loader, UserCheck, UserPlus } from "lucide-react";
import Button from "./Button";

const NewsletterSubscribe = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [placeholder, setPlaceholder] = useState("Enter your e-mail");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseClasses = "w-full md:w-120 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-colors border border-indigo-800 shadow-md text-white bg-indigo-800 dark:bg-indigo-500 dark:text-zinc-50";
  const successClasses = "w-full md:w-120 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-green-700 text-white hover:bg-green-700 border-green-700 hover:border-green-700 dark:bg-green-400 dark:hover:bg-green-600 dark:border-green-400 dark:hover:border-green-600 dark:text-gray-950";

  const handleOnClick = async (e) => {
    e.preventDefault();
    if (loading || subscribed) return;

    setError("");

    if (!email) {
      setError("E-mail is required!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscribed(true);
        setEmail("");
      } else {
        setEmail("");
        setError(data.error || "Failed to subscribe to newsletter!");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="subscribe" className="max-w-7xl mx-auto border-zinc-200 dark:border-gray-800">
      <form className="max-w-4xl mx-auto rounded-2xl text-center">
        <div className="max-w-4xl flex flex-col md:flex-row justify-center items-center mx-auto gap-4 gap-x-2">
          <input
            type="email"
            className={`px-4 py-3 w-full md:w-6xl text-center rounded-full border-2 outline-none md:mr-4 font-bold focus:placeholder-transparent ${error
              ? "border-red-600 dark:border-red-400 placeholder-red-600 dark:placeholder-red-400"
              : "border-indigo-800 dark:border-white placeholder-indigo-800 dark:placeholder-white"
              }`}
            required
            value={email}
            placeholder={error || placeholder}
            disabled={subscribed || loading}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
          />
          <Button
            href="#subscribe"
            className={`${subscribed ? successClasses : baseClasses}`}
            type="submit"
            disabled={subscribed || loading}
            onClick={handleOnClick}
          >
            {subscribed ? <UserCheck className="w-5 h-5 mr-1 font-bold -mt-[2px]" strokeWidth={3} /> : loading ? <Loader className="w-5 h-5 mr-1 font-bold -mt-[2px]" strokeWidth={3} /> : <UserPlus className="w-5 h-5 mr-1 font-bold -mt-[2px]" strokeWidth={3} />}
            {subscribed ? "Subscribed" : loading ? "Subscribing" : "Subscribe"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default NewsletterSubscribe;
