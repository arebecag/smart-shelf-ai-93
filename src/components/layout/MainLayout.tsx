import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const routeNames: Record<string, string> = {
  "/": "Dashboard",
  "/buscar": "Buscar Produtos",
  "/favoritos": "Favoritos",
  "/comparar": "Comparar Produtos",
  "/aprovacoes": "Aprovações",
  "/tv": "Apresentação TV",
  "/estatisticas": "Estatísticas",
  "/historico": "Histórico",
  "/configuracoes": "Configurações",
  "/ajuda": "Ajuda",
};

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const currentRoute = routeNames[location.pathname] || "Página";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-card px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Sugestão Inteligente</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentRoute}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
