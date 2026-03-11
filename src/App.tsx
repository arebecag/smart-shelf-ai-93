import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ApprovalsProvider } from "@/contexts/ApprovalsContext";
import { SimulatorProvider } from "@/contexts/SimulatorContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Suggestions from "./pages/Suggestions";
import WeeklyComparison from "./pages/WeeklyComparison";
import Simulator from "./pages/Simulator";
import TVPresentation from "./pages/TVPresentation";
import Statistics from "./pages/Statistics";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <ApprovalsProvider>
          <SimulatorProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/sugestao" replace />} />
                  <Route path="/sugestao" element={<Suggestions />} />
                  <Route path="/semanal" element={<WeeklyComparison />} />
                  <Route path="/simulador" element={<Simulator />} />
                  <Route path="/tv" element={<TVPresentation />} />
                  <Route path="/estatisticas" element={<Statistics />} />
                  <Route path="/historico" element={<History />} />
                  <Route path="/configuracoes" element={<Settings />} />
                  <Route path="/ajuda" element={<Help />} />
                  {/* Legacy redirects */}
                  <Route path="/comparativo-semanal" element={<Navigate to="/semanal" replace />} />
                  <Route path="/weekly-comparison" element={<Navigate to="/semanal" replace />} />
                  <Route path="/buscar" element={<Navigate to="/sugestao" replace />} />
                  <Route path="/favoritos" element={<Navigate to="/sugestao" replace />} />
                  <Route path="/comparar" element={<Navigate to="/sugestao" replace />} />
                  <Route path="/aprovacoes" element={<Navigate to="/sugestao" replace />} />
                  <Route path="/assistente" element={<Navigate to="/sugestao" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </SimulatorProvider>
        </ApprovalsProvider>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
