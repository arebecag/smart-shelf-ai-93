
## Plan

### 1. WeeklyComparison — "Melhores por Seção/Dia" + Cruzamento com Dashboard

**New section: "Sugestão de Produtos por Dia e Seção"**

- Add a tab layout at the top: `Comparativo` | `Sugestões por Dia`
- In the **Sugestões por Dia** tab:
  - For each day of the week, show a row/card with the **top 2 products per section** (Cervejas, Refrigerantes, Laticínios, Energéticos) ranked by simulated sales for that day
  - At the bottom, a **"Adicionar ao Dashboard"** button per product that opens a toast saying "Produto X adicionado como sugestão"
  - A **"Sugestões Inteligentes"** panel that picks the top product per section with the highest weekly sales average, with a CTA to send to approvals
- The cross with Dashboard: use `useApprovals` context — clicking "Sugerir para Tabloide" on a weekly suggestion card calls `addApproval(product)` so it flows directly to the approval screen and TV Presentation

### 2. TVPresentation — Editable prices + Observations + Larger font

**Editable fields:**
- Add `editedData` state: `Record<productId, Record<storeId, { price: string, obs: string }>>` 
- Replace static price cells with `<input>` fields (inline, borderless style matching the table) when in edit mode
- Toggle button "Editar / Visualizar" in the toolbar
- Margin auto-recalculates based on typed price vs cost

**Observations column:**
- Add an `Obs.` column after Score IA
- When in edit mode, shows a small `<textarea>` or `<input>` for each row
- Saved in local state, appears on print

**Larger text:**
- Increase base table font from `text-[11px]` to `text-[13px]`
- Increase product image from `w-8 h-8` to `w-10 h-10`
- Header row padding increased slightly

### Files to edit
- `src/pages/WeeklyComparison.tsx` — add tabs, sugestões por dia/seção, integration with ApprovalsContext
- `src/pages/TVPresentation.tsx` — editable price inputs, obs column, larger font
