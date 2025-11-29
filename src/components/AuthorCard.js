import { Building } from "lucide-react";

const AuthorCard = ({ author }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
      {author.name.split(' ').map(n => n[0]).join('')}
    </div>
    <div className="min-w-0 flex-1">
      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
        {author.name}
      </div>
      <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400 mt-1">
        <Building className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">{author.affiliation}</span>
      </div>
    </div>
  </div>
);
export default AuthorCard;
