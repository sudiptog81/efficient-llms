import { Users } from "lucide-react";
import AuthorCard from "./AuthorCard";

const AuthorList = ({ authors }) => (
  <div className="border-b border-zinc-200 dark:border-zinc-800 py-8">
    <h2 className="flex items-center gap-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
      <Users className="w-6 h-6" />
      Authors
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {authors.map((author, idx) => (
        <AuthorCard key={idx} author={author} />
      ))}
    </div>
  </div>
);

export default AuthorList;
