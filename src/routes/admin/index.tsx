import { createFileRoute } from "@tanstack/react-router";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { Calendar, Users, Activity, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <>
      <AdminHeader title="Dashboard" />
      
      <div className="flex-1 p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Reservations"
            value="124"
            icon={Calendar}
            trend="12%"
            trendUp={true}
          />
          <StatsCard
            title="Active Users"
            value="892"
            icon={Users}
            trend="4%"
            trendUp={true}
          />
          <StatsCard
            title="Daily Views"
            value="3,421"
            icon={Activity}
            trend="8%"
            trendUp={true}
          />
          <StatsCard
            title="Conversion"
            value="3.2%"
            icon={TrendingUp}
            trend="1.1%"
            trendUp={false}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 glass-card min-h-[400px]">
            <h3 className="font-display text-xl mb-4">Recent Reservations</h3>
            <div className="flex h-[300px] items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
              Reservation chart will go here
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 glass-card min-h-[400px]">
            <h3 className="font-display text-xl mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="block font-medium text-gold">Manage Menu</span>
                <span className="block text-xs text-muted-foreground mt-1">Add or update today's specials</span>
              </button>
              <button className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <span className="block font-medium text-gold">View Reservations</span>
                <span className="block text-xs text-muted-foreground mt-1">Check tonight's table availability</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
