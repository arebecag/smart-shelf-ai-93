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
  ClipboardCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoCondor from "@/assets/logo-condor.png";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Buscar Produtos", url: "/buscar", icon: Search },
  { title: "Favoritos", url: "/favoritos", icon: Star },
  { title: "Comparar", url: "/comparar", icon: GitCompare },
  { title: "Aprovações", url: "/aprovacoes", icon: ClipboardCheck },
];

const analysisMenuItems = [
  { title: "Estatísticas", url: "/estatisticas", icon: BarChart3 },
  { title: "Histórico", url: "/historico", icon: History },
];

const configMenuItems = [
  { title: "Configurações", url: "/configuracoes", icon: Settings },
  { title: "Ajuda", url: "/ajuda", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: { title: string; url: string; icon: React.ElementType }) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
            "hover:bg-primary/10",
            isActive(item.url) && "bg-primary/15 text-primary font-medium"
          )}
        >
          <item.icon className={cn("h-5 w-5", isActive(item.url) ? "text-primary" : "text-muted-foreground")} />
          {!collapsed && <span>{item.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <img 
            src={logoCondor} 
            alt="Logo Condor" 
            className={cn(
              "object-contain",
              collapsed ? "w-10 h-10" : "w-24 h-16"
            )}
          />
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg text-foreground">Sugestão Inteligente</h1>
              <p className="text-xs text-muted-foreground">Sistema de Tabloides</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Análises
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analysisMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={cn(collapsed && "sr-only")}>
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {configMenuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="text-xs text-muted-foreground text-center">
            © 2025 Rede Condor
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
