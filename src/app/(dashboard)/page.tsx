import { getCurrentUser } from "@/lib/dal";
import { getVisibleNavItems } from "@/lib/nav";
import { KpiTile } from "@/components/kpi-tile";
import { getDashboardKpis } from "@/lib/dashboard-kpis";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  const visibleDepartments = getVisibleNavItems(user.department, user.role)
    .map((item) => item.department)
    .filter(
      (department): department is "ADMIN" | "LETTINGS" | "MAINTENANCE" | "FINANCE" =>
        department !== "DASHBOARD"
    );

  const kpisByDepartment = await getDashboardKpis(user.organizationId, visibleDepartments);

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
            {kpisByDepartment[department].map((kpi) => (
              <KpiTile key={kpi.label} label={kpi.label} value={kpi.value} hint={kpi.hint} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
