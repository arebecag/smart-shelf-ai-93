import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ApprovalsProvider } from "@/contexts/ApprovalsContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import SearchProducts from "./pages/SearchProducts";
import Favorites from "./pages/Favorites";
import Compare from "./pages/Compare";
import Statistics from "./pages/Statistics";
import History from "./pages/History";
import Approvals from "./pages/Approvals";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <ApprovalsProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/buscar" element={<SearchProducts />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/comparar" element={<Compare />} />
                <Route path="/aprovacoes" element={<Approvals />} />
                <Route path="/estatisticas" element={<Statistics />} />
                <Route path="/historico" element={<History />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="/ajuda" element={<Help />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </ApprovalsProvider>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
