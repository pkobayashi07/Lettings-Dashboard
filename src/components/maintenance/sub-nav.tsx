import Link from "next/link";

const LINKS = [
  { href: "/maintenance", label: "Tickets" },
  { href: "/maintenance/contractors", label: "Contractors" },
];

export function MaintenanceSubNav({ active }: { active: string }) {
  return (
    <div className="mb-6 flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
            active === link.href
              ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-50"
              : "border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
