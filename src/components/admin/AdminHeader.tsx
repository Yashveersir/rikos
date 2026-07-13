import { Bell, Search } from "lucide-react";

export function AdminHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#0a0a0a]/80 px-8 backdrop-blur-md">
      <h2 className="font-display text-2xl text-foreground">{title}</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-10 w-64 rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
          />
        </div>
        
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell size={20} />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-black">
            3
          </span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-gold font-semibold">
            A
          </div>
          <div className="hidden text-sm md:block">
            <p className="font-medium text-foreground">Admin User</p>
            <p className="text-xs text-muted-foreground">admin@rikos.in</p>
          </div>
        </div>
      </div>
    </header>
  );
}
