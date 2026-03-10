
## Understanding the request

The user sketched a UI where:
- The **sidebar is removed** (or minimized)
- **3 big tabs at the top** replace the sidebar navigation: `Semanal` | `Simulador` | `Sugestão`
- Each tab opens its respective full-screen view
- The Weekly tab should look like the reference dashboard image (faturamento/volume/rentabilidade by category with day-of-week breakdown)
- Everything is inside a single unified shell — no left sidebar cluttering

## What to build

### New top-level shell: `MainLayout.tsx`
Replace the sidebar-based layout with a **top navigation bar** approach:
- Logo (Condor) on the left
- **3 primary tab buttons** in the center/top: `Semanal`, `Simulador`, `Sugestão`  
- Secondary utility links on the right (Configurações, Ajuda, TV)
- No sidebar at all (remove `AppSidebar`)
- Routes remain the same, but the "main 3" tabs are the primary entry points

### Tab structure (based on sketch)

```text
┌─────────────────────────────────────────────────┐
│  [Logo Condor]  [Semanal] [Simulador] [Sugestão] │  ← top bar
│──────────────────────────────────────────────────│
│                                                  │
│  [Content of selected tab fills this area]       │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Tab 1 — "Semanal" (`/semanal`)
Redesign WeeklyComparison to match the reference BI screenshot:
- **Top area**: Area chart "Faturamento, volume e rentabilidade por categorias" (line/area chart)
- **Middle**: Day-of-week grid showing top categories per day with faturamento values (7 columns Mon-Sun)
- **Bottom**: Participation charts (stacked bar per category per day)
- Keep the existing scoring/suggestion logic, just re-layout it

### Tab 2 — "Simulador" (`/simulador`)
The existing Simulator page stays as-is — already well built.

### Tab 3 — "Sugestão" (new composite page or `/`)
This tab becomes a hub with its own internal sub-navigation:
- Dashboard (current `/`)
- Buscar Produtos (`/buscar`)  
- Assistente IA (`/assistente`)
- Comparar (`/comparar`)
- Favoritos + Aprovações

Secondary pages (TV, Estatísticas, Histórico, Config, Ajuda) accessible via top-right utility area.

## Implementation plan

### 1. New `MainLayout.tsx`
- Remove `SidebarProvider` / `AppSidebar`
- Add a fixed top header bar with:
  - Condor logo (left)
  - 3 primary nav tabs: Semanal / Simulador / Sugestão (center, styled as large pill tabs)
  - Secondary icon buttons: TV, Estatísticas, Histórico, Config, Ajuda (right side)
- Use `useLocation` + `NavLink` so active tab is highlighted
- Responsive: on mobile collapse secondary icons into a dropdown

### 2. Revamp `WeeklyComparison.tsx` to match BI reference
- **Top section**: `AreaChart` (recharts) — Faturamento + Volume + Rentabilidade by section (x-axis = sections)
- **Right side of top**: ranked lists for Faturamento, Volume, Rentabilidade, Margem
- **Middle section**: 7-column day grid — each day shows top sections ordered by estimated faturamento with value chips
- Keep existing day-boost logic to power the day grid
- **Bottom**: `BarChart` stacked — participation per category per day (% or R$)

### 3. New "Sugestão" hub page (`src/pages/Suggestions.tsx`)
- Route: `/` becomes this hub
- Internal tabs: "Dashboard" | "Buscar" | "Assistente IA" | "Comparar" | "Aprovações"
- This consolidates the discovery/approval workflow into one tabbed page

### 4. Update `App.tsx` routes
- `/` → new Suggestions hub
- `/semanal` → redesigned WeeklyComparison
- `/simulador` → existing Simulator
- Keep all other routes for secondary pages

### Files to change
- `src/components/layout/MainLayout.tsx` — full rewrite (top nav, no sidebar)
- `src/components/layout/AppSidebar.tsx` — no longer needed (can keep but unused)
- `src/pages/WeeklyComparison.tsx` — redesign layout to match BI screenshot
- `src/pages/Index.tsx` — redirect to new Suggestions hub
- `src/App.tsx` — add Suggestions route, update layout
- `src/pages/Suggestions.tsx` — new file, tabbed hub for Sugestão section
