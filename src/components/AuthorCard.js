import { Building } from "lucide-react";

const AuthorCard = ({ author }) => (
  <div className="flex items-start rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
    <div className="min-w-0 flex-1">
      <div className="font-semibold text-zinc-900 dark:text-zinc-50">
        {author.name}
      </div>
      <div className="flex items-center justify-center text-sm text-zinc-600 dark:text-zinc-400 mt-1">
        <span className="truncate">{author.affiliation}</span>
      </div>
    </div>
  </div>
);
export default AuthorCard;
