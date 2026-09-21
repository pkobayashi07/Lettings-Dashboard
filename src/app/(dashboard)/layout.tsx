import { getCurrentUser } from "@/lib/dal";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen">
      <Sidebar department={user.department} role={user.role} />
      <div className="flex flex-1 flex-col">
        <Topbar userName={user.name} organizationName={user.organization.name} />
        <main className="flex-1 bg-neutral-50 p-6 dark:bg-neutral-950">{children}</main>
      </div>
    </div>
  );
}
