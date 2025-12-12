import { Building } from "lucide-react";
import Link from "next/link";

const AuthorCard = ({ author }) => (
  <div className="flex items-start rounded-lg bg-white dark:bg-zinc-900/50 justify-center text-center">
    <div className="min-w-0 flex-1">
      <div className={`font-semibold text-zinc-900 dark:text-zinc-50 ${author.email ? "cursor-pointer hover:text-red-600 dark:hover:text-red-400" : ""}`}>
        {author.email ? (
          <Link href={`mailto:${author.email}`} title={`Email ${author.name}`} className="inline-block ml-1">
            {author.name}
          </Link>
        ) : (
          <span>{author.name}</span>
        )}
      </div>
      <div className="flex items-center justify-center text-sm text-zinc-600 dark:text-zinc-400 mt-1">
        <span className="truncate">{author.affiliation}</span>
      </div>
    </div>
  </div>
);
export default AuthorCard;
