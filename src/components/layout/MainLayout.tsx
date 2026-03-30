import { ReactNode, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useSimulator } from "@/contexts/SimulatorContext";
import {
  Monitor, Settings, HelpCircle, History, BarChart3,
  ChevronDown, Menu, X, Megaphone,
} from "lucide-react";
import logoCondor from "@/assets/logo-condor.png";

interface MainLayoutProps {
  children: ReactNode;
}

const PRIMARY_TABS = [
  { label: "Semanal", path: "/semanal", description: "Análise e sugestões semanais" },
  { label: "Simulador", path: "/simulador", description: "Simulação de preços" },
  { label: "Sugestão", path: "/sugestao", description: "Curadoria e aprovações" },
];

const SECONDARY_LINKS = [
  { icon: Megaphone, label: "Padrão Campanha", path: "/campanha" },
  { icon: Monitor, label: "Apresentação TV", path: "/tv" },
  { icon: BarChart3, label: "Estatísticas", path: "/estatisticas" },
  { icon: History, label: "Histórico", path: "/historico" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: HelpCircle, label: "Ajuda", path: "/ajuda" },
];

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { approvals } = useApprovals();
  const { queue: simulatorQueue } = useSimulator();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);

  const activeTab = PRIMARY_TABS.find(t => location.pathname.startsWith(t.path))?.path
    ?? (location.pathname === "/" ? "/sugestao" : null);

  const pendingApprovals = approvals.length;
  const simulatorCount = simulatorQueue.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
        <div className="flex items-center h-14 px-4 gap-4">
          {/* Logo */}
          <Link to="/sugestao" className="flex items-center gap-2 flex-shrink-0">
            <img src={logoCondor} alt="Condor" className="h-8 w-auto object-contain" />
          </Link>

          {/* Desktop primary tabs */}
          <nav className="hidden md:flex items-center gap-1 mx-auto">
            {PRIMARY_TABS.map(tab => {
              const isActive = activeTab === tab.path;
              const badge = tab.path === "/simulador" ? simulatorCount
                : tab.path === "/sugestao" ? pendingApprovals
                : 0;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={cn(
                    "relative flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {badge > 0 && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-primary text-primary-foreground"
                    )}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary links — desktop */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            {SECONDARY_LINKS.slice(0, 4).map(link => (
              <Link
                key={link.path}
                to={link.path}
                title={link.label}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  location.pathname === link.path
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{link.label}</span>
              </Link>
            ))}

            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setSecondaryOpen(v => !v)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span className="hidden lg:inline">Mais</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", secondaryOpen && "rotate-180")} />
              </button>
              {secondaryOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
                  {SECONDARY_LINKS.slice(4).map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setSecondaryOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="ml-auto md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(v => !v)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {PRIMARY_TABS.map(tab => (
              <button
                key={tab.path}
                onClick={() => { navigate(tab.path); setMobileMenuOpen(false); }}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  activeTab === tab.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
            <div className="border-t border-border mt-2 pt-2 space-y-1">
              {SECONDARY_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
