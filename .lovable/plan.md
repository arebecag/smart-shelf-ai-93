
## What the reference shows vs. what's built

### Reference layout (images 7, 8, 9 — full page top to bottom):

```
┌─────────────────────────────────────────────────────────────┐
│  FILTER BAR: Depto | Seção | Grupo | Família | Praça |      │
│              Dia Semana | Fornecedor | Ano e Mês | Ofertas  │
│                                                    28/02/21 │
├──────────────────────────────────┬──────────────────────────┤
│                                  │ Faturamento  │  Volume   │
│   Area Chart                     │ Açougue R$.. │ Beb.Frias │
│   (Faturamento, Volume,          │ Animais R$.. │ Seca Leve │
│    Rentab. c/ Sellout)           │─────────────┼───────────│
│   X-axis = section names         │ Rentab.c/Se │ Margem c/ │
│   3 areas stacked                │ Frutas&H... │ Laticínios│
│                                  │ Açougue R$  │ 23,51%    │
├──────────────────────────────────┴──────────────────────────┤
│  7-DAY GRID: Seg | Ter | Qua | Qui | Sex | Sáb | Dom        │
│  Each column: scrollable ranked list with horizontal bars    │
│  Blue for weekdays, Red for Fri/Sat/Sun                     │
├──────────────────────────────────┬──────────────────────────┤
│ Seção table:                     │ Fat | Vol | Rent | Camp  │
│ Açougue  R$194M  10.2M  R$27M 13%│ (product rankings)      │
│ Bebidas  R$191M  62.0M  R$25M 14%│                          │
│ ...                              │                          │
├──────────────────────────────────┴──────────────────────────┤
│ Participação cat/dia (stacked)   │ Participação por praça   │
│ X = sections, stacked = days     │ X = 4 regiões            │
│ Labels % ≥ ~9%                   │ Curitiba/CG/Norte/SC     │
└──────────────────────────────────┴──────────────────────────┘
```

### Key differences from current code:

1. **Block order is wrong** — currently: Seções table → Area chart → 7-day grid → Stacked chart. Reference: Area chart → 7-day grid → Seções table → Stacked charts
2. **Area chart position** — needs to be left ~65% of width, with the 4 ranking panels on the right ~35% (2×2 grid: Faturamento/Volume top, Rentab./Margem bottom)
3. **Missing filter bar** at the top (Depto, Seção, Grupo, Família, Praça, Dia da Semana, Fornecedor, Ano e mês, Produtos Ofertas)
4. **Stacked bar chart (participation)** — X-axis should be **section names** (many categories), segments = days of week with blue→red gradient. This is actually the current implementation (DAYS_SHORT stacked over sections). The current `buildStackedData` already does this (each row = section, columns = day %), so that part is correct
5. **"Participação por praça"** chart is missing — needs to be added to the right of the participation chart (4 regions: CuritibaRMCLitoral, CamposGerais, Norte, SantaCatarina)
6. **Right panel in section row** — image-9 shows 5 columns: Faturamento, Volume, Rentab. c/Sellout, TOP em Campanha, TOP SEM Campanha. This matches current code but is currently positioned at the TOP instead of after the 7-day grid.

## Plan

### 1. Add filter bar at the top
Simple row of dropdowns using Select components: Depto, Seção, Grupo de Família, Família, Praça, Dia da Semana, Fornecedor, Ano e Mês, Produtos Ofertas. Purely cosmetic state (no real filtering needed since data is mock). Date display top-right ("28/02/21" style → use today's date).

### 2. Reorder blocks to match reference
New order:
1. Filter bar
2. Area chart (left 65%) + 4 ranking mini-panels (right 35%)
3. 7-day grid (full width)  
4. Seções table (left) + 5-column product panel (right)
5. Stacked participation chart (left 65%) + Participation by praça chart (right 35%)

### 3. Fix Area chart + 4 right ranking panels layout
Right panel = 2×2 grid:
- Top-left: **Faturamento** — ranked list by section (section name in blue, R$ value)
- Top-right: **Volume** — ranked list (section name in orange, number)
- Bottom-left: **Rentab. c/ Sellout** — ranked list (section name in green, R$)  
- Bottom-right: **Margem c/ Sellout** — ranked list (section name in purple/maroon, %)

### 4. Add "Participação por praça" chart
Add mock data for 4 regions (CuritibaRMCLitoral, CamposGerais, Norte, SantaCatarina). Each bar = one region, stacked by days of week using same day colors. Same % labels when ≥ 9%.

### 5. Fix section metrics for right panels
`buildAllSectionMetrics` already returns faturamento, volume, rentabilidade, margem per section sorted by faturamento desc — use this for the 4 ranking panels.

### Files to change
- `src/pages/WeeklyComparison.tsx` — full rewrite of JSX structure (data functions remain mostly the same)
