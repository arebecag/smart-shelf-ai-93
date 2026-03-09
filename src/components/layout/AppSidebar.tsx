import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoCondor from "@/assets/logo-condor.png";
import { useApprovals } from "@/contexts/ApprovalsContext";
import { useSimulator } from "@/contexts/SimulatorContext";

// Fluxo de etapas: define a jornada de uso do sistema
const STEPS = [
  { step: 1, label: "Descoberta", urls: ["/", "/semanal", "/buscar"] },
  { step: 2, label: "Simulação", urls: ["/simulador", "/comparar"] },
  { step: 3, label: "Aprovação", urls: ["/aprovacoes", "/favoritos"] },
  { step: 4, label: "Publicação", urls: ["/tv"] },
];

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, step: 1 },
  { title: "Comparativo Semanal", url: "/semanal", icon: CalendarDays, step: 1 },
  { title: "Buscar Produtos", url: "/buscar", icon: Search, step: 1 },
  { title: "Simulador de Preços", url: "/simulador", icon: Zap, step: 2 },
  { title: "Comparar", url: "/comparar", icon: GitCompare, step: 2 },
  { title: "Favoritos", url: "/favoritos", icon: Star, step: 3 },
  { title: "Aprovações", url: "/aprovacoes", icon: ClipboardCheck, step: 3 },
  { title: "Assistente IA", url: "/assistente", icon: Sparkles, step: 2 },
  { title: "Apresentação TV", url: "/tv", icon: Tv, step: 4 },
];

const analysisMenuItems = [
  { title: "Estatísticas", url: "/estatisticas", icon: BarChart3, step: 0 },
  { title: "Histórico", url: "/historico", icon: History, step: 0 },
];

const configMenuItems = [
  { title: "Configurações", url: "/configuracoes", icon: Settings, step: 0 },
  { title: "Ajuda", url: "/ajuda", icon: HelpCircle, step: 0 },
];

const STEP_COLORS = [
  "text-chart-1 bg-chart-1/10 border-chart-1/20",
  "text-chart-2 bg-chart-2/10 border-chart-2/20",
  "text-chart-3 bg-chart-3/10 border-chart-3/20",
  "text-chart-4 bg-chart-4/10 border-chart-4/20",
  "text-chart-5 bg-chart-5/10 border-chart-5/20",
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { approvals } = useApprovals();
  const { queue } = useSimulator();

  const pendingApprovals = approvals.filter(a => a.status === 'approved').length;
  const simulatorCount = queue.length;

  const isActive = (path: string) => location.pathname === path;

  const activeStep = STEPS.find(s => s.urls.includes(location.pathname))?.step ?? 0;

  const getBadge = (url: string) => {
    if (url === "/aprovacoes" && pendingApprovals > 0) return pendingApprovals;
    if (url === "/simulador" && simulatorCount > 0) return simulatorCount;
    return null;
  };

  const renderMenuItem = (item: { title: string; url: string; icon: React.ElementType; step: number }) => {
    const badge = getBadge(item.url);
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.url}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150",
              "hover:bg-sidebar-accent/60",
              isActive(item.url) && "bg-primary/10 text-primary font-semibold shadow-sm"
            )}
          >
            <item.icon className={cn(
              "h-4 w-4 flex-shrink-0",
              isActive(item.url) ? "text-primary" : "text-sidebar-foreground/50"
            )} />
            {!collapsed && (
              <>
                <span className="flex-1 text-[13px]">{item.title}</span>
                {badge && (
                  <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </>
            )}
            {collapsed && badge && (
              <span className="absolute top-0.5 right-0.5 text-[8px] font-bold bg-primary text-primary-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar-background">
      {/* Logo */}
      <SidebarHeader className="px-3 pt-4 pb-3 border-b border-sidebar-border/60">
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <img
            src={logoCondor}
            alt="Logo Condor"
            className={cn("object-contain flex-shrink-0", collapsed ? "w-8 h-8" : "w-20 h-12")}
          />
          {!collapsed && (
            <div>
              <h1 className="font-bold text-[13px] text-sidebar-foreground leading-tight">Sugestão Inteligente</h1>
              <p className="text-[10px] text-sidebar-foreground/50 leading-tight">Sistema de Tabloides</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Steps indicator */}
      {!collapsed && (
        <div className="px-3 py-3 border-b border-sidebar-border/40">
          <p className="text-[10px] text-sidebar-foreground/40 uppercase tracking-wider font-semibold mb-2">Fluxo de trabalho</p>
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex items-center gap-1 flex-1">
                <div className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 border transition-all cursor-default",
                  activeStep === s.step
                    ? "bg-primary/10 border-primary/30"
                    : "border-transparent opacity-50"
                )}>
                  <span className={cn(
                    "w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center",
                    activeStep === s.step ? "bg-primary text-primary-foreground" : "bg-sidebar-foreground/20 text-sidebar-foreground/50"
                  )}>
                    {s.step}
                  </span>
                  <span className={cn(
                    "text-[9px] font-medium leading-tight text-center",
                    activeStep === s.step ? "text-primary" : "text-sidebar-foreground/40"
                  )}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="h-2.5 w-2.5 text-sidebar-foreground/20 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <SidebarContent className="px-2 pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold px-3", collapsed && "sr-only")}>
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-1">
          <SidebarGroupLabel className={cn("text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold px-3", collapsed && "sr-only")}>
            Análises
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-1">
          <SidebarGroupLabel className={cn("text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-semibold px-3", collapsed && "sr-only")}>
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 border-t border-sidebar-border/40">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/30 text-center">© 2025 Rede Condor</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
