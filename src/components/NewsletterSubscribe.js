import { useState } from "react";
import { Loader, UserCheck, UserPlus } from "lucide-react";
import Button from "./Button";

const NewsletterSubscribe = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const baseClasses = "w-full md:w-200 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold transition-colors border shadow-md bg-white text-indigo-800 dark:bg-zinc-800 dark:text-zinc-50";
  const successClasses = "w-full md:w-200 flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold bg-green-700 text-white hover:bg-green-700 border-green-700 hover:border-green-700 dark:bg-green-400 dark:hover:bg-green-600 dark:border-green-400 dark:hover:border-green-600 dark:text-gray-950";


  const handleOnClick = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert("E-mail is required!");
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
        alert(data.error || "Failed to subscribe to newsletter!");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
  <section id="subscribe" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 border-t border-zinc-200 dark:border-gray-800">
      <form className="p-10 bg-indigo-800 dark:bg-indigo-500 rounded-2xl text-white text-center shadow-2xl">
        <div className="max-w-4xl flex flex-col md:flex-row justify-center items-center mx-auto gap-4">
          <input 
            type="email"
            placeholder="Enter your e-mail"
            className="px-4 py-3 w-full md:w-6xl text-center rounded-full border-2 border-zinc-300 dark:bg-gray-800 dark:border-gray-700 md:mr-4 font-bold focus:placeholder-transparent"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            href="#subscribe" 
            className={`${subscribed ? successClasses : baseClasses}`}         
            type="submit" 
            onClick={handleOnClick}
          >
            {subscribed ? <UserCheck className="w-4 h-4 mr-1 font-bold -mt-[2px]" strokeWidth={3} /> : loading ? <Loader className="w-4 h-4 mr-1 font-bold -mt-[2px]" strokeWidth={3} /> : <UserPlus className="w-4 h-4 mr-1 font-bold -mt-[2px]" strokeWidth={3} />}
            {subscribed ? "Subscribed" : loading ? "Subscribing" : "Subscribe to Newsletter"}
          </Button>
        </div>
      </form>
  </section>
)};

export default NewsletterSubscribe;
