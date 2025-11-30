import AuthorCard from "./AuthorCard";

const AuthorList = ({ authors }) => (
  <div className="border-zinc-200 dark:border-zinc-800 py-4">
    <div className="flex flex-row items-center align-middle justify-center gap-8 gap-y-4 flex-wrap">
      {authors.map((author, idx) => (
        <AuthorCard key={idx} author={author} />
      ))}
    </div>
  </div>
);

export default AuthorList;
