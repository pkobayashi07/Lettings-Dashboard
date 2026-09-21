import { getCurrentUser } from "@/lib/dal";
import { getVisibleNavItems } from "@/lib/nav";
import { KpiTile } from "@/components/kpi-tile";

const KPIS_BY_DEPARTMENT = {
  ADMIN: [
    { label: "Active Users", value: "—" },
    { label: "Properties Onboarded", value: "—" },
    { label: "Compliance Items Due", value: "—" },
  ],
  LETTINGS: [
    { label: "Open Applications", value: "—" },
    { label: "Vacant Units", value: "—" },
    { label: "Renewals Due (30d)", value: "—" },
  ],
  MAINTENANCE: [
    { label: "Open Tickets", value: "—" },
    { label: "Urgent Tickets", value: "—" },
    { label: "Avg. Resolution Time", value: "—" },
  ],
  FINANCE: [
    { label: "Rent Arrears", value: "—" },
    { label: "Outstanding Invoices", value: "—" },
    { label: "Occupancy Rate", value: "—" },
  ],
} as const;

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  const visibleDepartments = getVisibleNavItems(user.department, user.role)
    .map((item) => item.department)
    .filter((department): department is keyof typeof KPIS_BY_DEPARTMENT =>
      department !== "DASHBOARD"
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Welcome back, {user.name}
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Here&apos;s what&apos;s happening across your properties.
        </p>
      </div>

      {visibleDepartments.map((department) => (
        <section key={department}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            {department.charAt(0) + department.slice(1).toLowerCase()}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {KPIS_BY_DEPARTMENT[department].map((kpi) => (
              <KpiTile key={kpi.label} label={kpi.label} value={kpi.value} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
