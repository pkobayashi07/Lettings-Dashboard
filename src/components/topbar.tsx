import { logout } from "@/lib/actions/auth";

export function Topbar({
  userName,
  organizationName,
}: {
  userName: string;
  organizationName: string;
}) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-800 dark:bg-neutral-900">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {organizationName}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">{userName}</span>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-md px-2 py-1 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
