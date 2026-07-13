import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { getAdminSession } from "@/api/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    // Skip auth check if we are already going to the login page
    if (location.pathname === "/admin/login") return;
    
    try {
      const session = await getAdminSession();
      if (!session) {
        throw redirect({
          to: "/admin/login",
          search: { redirect: location.href },
        });
      }
    } catch (err) {
      if (err instanceof Response) throw err; // Re-throw redirects
      throw redirect({
        to: "/admin/login",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  // If we are on /admin/login, don't show sidebar
  const isLoginPage = Route.useMatch().pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <main className="ml-64 flex min-h-screen flex-col">
        <Outlet />
      </main>
    </div>
  );
}
