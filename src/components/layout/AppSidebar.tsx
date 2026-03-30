import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Search,
  History,
  Settings,
  Star,
  BarChart3,
  GitCompare,
  HelpCircle,
  ClipboardCheck,
  Tv,
  Sparkles,
  CalendarDays,
  Zap,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoCondor from "@/assets/logo-condor.png";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useSimulator } from "@/contexts/SimulatorContext";

// ─── Workflow steps ──────────────────────────────────────────────────────────
const STEPS = [
  { step: 1, short: "1", label: "Descoberta",  urls: ["/", "/semanal", "/buscar"] },
  { step: 2, short: "2", label: "Simulação",   urls: ["/simulador", "/comparar", "/assistente"] },
  { step: 3, short: "3", label: "Aprovação",   urls: ["/aprovacoes", "/favoritos"] },
  { step: 4, short: "4", label: "Publicação",  urls: ["/tv"] },
];

// ─── Menu definition ─────────────────────────────────────────────────────────
type MenuItem = { title: string; url: string; icon: React.ElementType; badge?: () => number | null };

const useMenuGroups = () => {
  const { approvals } = useApprovals();
  const { queue } = useSimulator();

  const pendingApprovals = approvals.filter(a => a.status === 'approved').length;
  const simulatorCount = queue.length;

  const descoberta: MenuItem[] = [
    { title: "Dashboard",           url: "/",         icon: LayoutDashboard },
    { title: "Comparativo Semanal", url: "/semanal",  icon: CalendarDays },
    { title: "Padrão Campanha",     url: "/campanha", icon: Megaphone },
    { title: "Buscar Produtos",     url: "/buscar",   icon: Search },
  ];

  const simulacao: MenuItem[] = [
    { title: "Simulador de Preços", url: "/simulador",  icon: Zap,        badge: () => simulatorCount > 0 ? simulatorCount : null },
    { title: "Comparar Produtos",   url: "/comparar",   icon: GitCompare },
    { title: "Assistente IA",       url: "/assistente", icon: Sparkles },
  ];

  const aprovacao: MenuItem[] = [
    { title: "Favoritos",  url: "/favoritos",  icon: Star },
    { title: "Aprovações", url: "/aprovacoes", icon: ClipboardCheck, badge: () => pendingApprovals > 0 ? pendingApprovals : null },
  ];

  const publicacao: MenuItem[] = [
    { title: "Apresentação TV", url: "/tv", icon: Tv },
  ];

  const extras: MenuItem[] = [
    { title: "Estatísticas", url: "/estatisticas",  icon: BarChart3 },
    { title: "Histórico",    url: "/historico",     icon: History },
    { title: "Configurações",url: "/configuracoes", icon: Settings },
    { title: "Ajuda",        url: "/ajuda",         icon: HelpCircle },
  ];

  return { descoberta, simulacao, aprovacao, publicacao, extras };
};

// ─── Step indicator colors ────────────────────────────────────────────────────
const STEP_META = [
  { active: "bg-chart-1 text-white",       pill: "text-chart-1 bg-chart-1/10 border-chart-1/20" },
  { active: "bg-chart-2 text-white",       pill: "text-chart-2 bg-chart-2/10 border-chart-2/20" },
  { active: "bg-chart-4 text-white",       pill: "text-chart-4 bg-chart-4/10 border-chart-4/20" },
  { active: "bg-chart-5 text-white",       pill: "text-chart-5 bg-chart-5/10 border-chart-5/20" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { descoberta, simulacao, aprovacao, publicacao, extras } = useMenuGroups();

  const activeStepObj = STEPS.find(s => s.urls.includes(location.pathname));
  const activeStep = activeStepObj?.step ?? 0;

  const isActive = (url: string) => location.pathname === url;

  const renderItem = (item: MenuItem) => {
    const badge = item.badge?.();
    return (
      <SidebarMenuItem key={item.url}>
        <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
          <NavLink
            to={item.url}
            className={cn(
              "relative flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all duration-150",
              "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/70",
              isActive(item.url) && "bg-primary/10 text-primary font-semibold"
            )}
          >
            <item.icon className={cn("h-[15px] w-[15px] flex-shrink-0", isActive(item.url) ? "text-primary" : "text-sidebar-foreground/40")} />
            {!collapsed && <span className="flex-1 leading-none">{item.title}</span>}
            {!collapsed && badge != null && (
              <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {badge}
              </span>
            )}
            {collapsed && badge != null && (
              <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const renderGroup = (label: string, stepIdx: number, items: MenuItem[]) => {
    const isCurrentStep = activeStep === stepIdx + 1;
    const meta = STEP_META[stepIdx];
    return (
      <div className={cn("mb-1", collapsed ? "mt-2" : "mt-3")}>
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 mb-1.5">
            <span className={cn(
              "text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0",
              isCurrentStep ? meta.active : "bg-sidebar-foreground/10 text-sidebar-foreground/40"
            )}>
              {stepIdx + 1}
            </span>
            <span className={cn(
              "text-[10px] font-semibold uppercase tracking-wider",
              isCurrentStep ? "text-foreground" : "text-sidebar-foreground/35"
            )}>
              {label}
            </span>
            {isCurrentStep && (
              <span className={cn("ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-full border", meta.pill)}>
                Atual
              </span>
            )}
          </div>
        )}
        {collapsed && (
          <div className={cn(
            "mx-auto w-5 h-0.5 rounded-full mb-1.5",
            isCurrentStep ? "bg-primary" : "bg-sidebar-foreground/10"
          )} />
        )}
        <SidebarMenu>
          {items.map(renderItem)}
        </SidebarMenu>
      </div>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* ── Logo ── */}
      <SidebarHeader className={cn("border-b border-sidebar-border/60", collapsed ? "px-2 pt-3 pb-3" : "px-4 pt-4 pb-3")}>
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <img
            src={logoCondor}
            alt="Condor"
            className={cn("object-contain flex-shrink-0", collapsed ? "w-7 h-7" : "w-16 h-10")}
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-bold text-[13px] text-sidebar-foreground leading-tight truncate">Sugestão Inteligente</p>
              <p className="text-[10px] text-sidebar-foreground/40 leading-tight truncate">Sistema de Tabloides</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* ── Workflow progress pills (expanded only) ── */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border/40">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 mb-2">Fluxo</p>
          <div className="flex gap-1">
            {STEPS.map((s, i) => {
              const isPast    = activeStep > s.step;
              const isCurrent = activeStep === s.step;
              const meta      = STEP_META[i];
              return (
                <div
                  key={s.step}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-0.5 rounded-lg py-1.5 px-0.5 transition-all",
                    isCurrent ? cn("ring-1", meta.pill) : isPast ? "opacity-60" : "opacity-30"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center",
                    isCurrent ? meta.active : isPast ? "bg-sidebar-foreground/20 text-sidebar-foreground/60" : "bg-sidebar-foreground/10 text-sidebar-foreground/30"
                  )}>
                    {isPast ? "✓" : s.step}
                  </span>
                  <span className="text-[9px] font-medium text-center leading-tight text-sidebar-foreground/60 truncate w-full text-center">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Nav content ── */}
      <SidebarContent className={cn("pt-1 overflow-y-auto", collapsed ? "px-1" : "px-2")}>
        {renderGroup("Descoberta", 0, descoberta)}
        {renderGroup("Simulação",  1, simulacao)}
        {renderGroup("Aprovação",  2, aprovacao)}
        {renderGroup("Publicação", 3, publicacao)}

        {/* Extras without step */}
        <div className={cn(collapsed ? "mt-2" : "mt-4 border-t border-sidebar-border/30 pt-3")}>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/25 px-3 mb-1.5">
              Sistema
            </p>
          )}
          <SidebarMenu>
            {extras.map(renderItem)}
          </SidebarMenu>
        </div>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-sidebar-border/30 px-4 py-3">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/25 text-center">© 2025 Rede Condor</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
