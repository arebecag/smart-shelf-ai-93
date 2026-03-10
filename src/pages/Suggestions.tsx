import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Search, Bot, BarChart2, CheckSquare } from "lucide-react";
import Dashboard from "./Dashboard";
import SearchProducts from "./SearchProducts";
import AIAssistant from "./AIAssistant";
import Compare from "./Compare";
import Approvals from "./Approvals";
import { useApprovals } from "@/contexts/ApprovalsContext";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "buscar", label: "Buscar Produtos", icon: Search },
  { id: "assistente", label: "Assistente IA", icon: Bot },
  { id: "comparar", label: "Comparar", icon: BarChart2 },
  { id: "aprovacoes", label: "Aprovações", icon: CheckSquare },
] as const;

type TabId = typeof TABS[number]["id"];

export default function Suggestions() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const { approvals } = useApprovals();
  const pendingCount = approvals.length;

  return (
    <div className="space-y-5 p-6">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          const badge = tab.id === "aprovacoes" ? pendingCount : 0;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {badge > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "buscar" && <SearchProducts />}
        {activeTab === "assistente" && <AIAssistant />}
        {activeTab === "comparar" && <Compare />}
        {activeTab === "aprovacoes" && <Approvals />}
      </div>
    </div>
  );
}
