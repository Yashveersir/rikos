import { Link, useLocation } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  Calendar, 
  MenuSquare, 
  Image as ImageIcon, 
  Users, 
  Settings, 
  LogOut,
  Mail
} from "lucide-react";
import { adminLogout } from "@/api/auth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Calendar, label: "Reservations", href: "/admin/reservations" },
  { icon: MenuSquare, label: "Menu Management", href: "/admin/menu" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
  { icon: Mail, label: "Messages", href: "/admin/messages" },
  { icon: Users, label: "Users & Staff", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
  const location = useLocation();

  const handleLogout = async () => {
    await adminLogout();
    window.location.href = "/admin/login";
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/5 bg-[#0a0a0a]">
      <div className="flex h-20 items-center px-8">
        <h1 className="font-display text-2xl tracking-widest gold-gradient-text">RIKO'S</h1>
        <span className="ml-2 mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">Admin</span>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                isActive 
                  ? "bg-gold/10 text-gold shadow-[inset_0_0_0_1px_rgba(201,162,39,0.2)]" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
