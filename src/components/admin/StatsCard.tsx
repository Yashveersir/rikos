import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 glass-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-gold/10 p-2 text-gold">
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-4">
        <h3 className="font-display text-4xl text-foreground">{value}</h3>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? "text-green-500" : "text-red-500"}`}>
            {trendUp ? "+" : ""}{trend}
          </span>
        )}
      </div>
    </div>
  );
}
