import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o Assistente de IA do Sistema Sugestão Inteligente da Rede Condor.

CONTEXTO DO SISTEMA:
- Catálogo com 80+ produtos em 8 seções: Cervejas (14 produtos), Refrigerantes (12), Laticínios (12), Energéticos (6), Açougue (12), Padaria (10), Água Mineral (6), Suco Pronto (6)
- 10 tabloides históricos analisados (Nov/2024 a Ago/2025)
- Score IA composto por: Margem (30%), Frequência histórica (30%), Vendas (20%), Crescimento (20%)
- Dados de mercado: Nielsen (market share, penetração, ranking), Prixsia (preços concorrência: min/avg/max), Shopping Brasil (anúncios ativos), Global Segmentos (campanhas mídia)
- Lojas: Curitiba, Litoral (Matinhos/Guaratuba), Ponta Grossa, Castro, Lapa, Irati

SEÇÕES E DESTAQUES:
- Cervejas: Brahma Chopp/Duplo Malte, Heineken, Skol, Itaipava, Budweiser, Amstel, Corona, Spaten, Stella Artois, Original, Devassa, Eisenbahn, Colorado, Bohemia
- Refrigerantes: Coca-Cola (Original/Zero/600ml), Guaraná Antarctica (2L/Lata), Pepsi (Black/Cola), Fanta (Laranja/Uva), Sprite, Schweppes, Kuat
- Laticínios: Leite (Piracanjuba/Italac/LV Zero Lactose), Iogurte (Nestlé Grego/Activia), Queijo (Muçarela Tirolez/Prato Reino), Manteiga Aviação, Cream Cheese Philadelphia, Requeijão Catupiry, Leite Condensado Moça, Creme de Leite Nestlé
- Energéticos: Red Bull (250ml/SugarFree), Monster (Energy/Ultra Zero), TNT, Burn
- Açougue: Frango Inteiro, Coxa/Sobrecoxa, Peito s/Osso, Frango Assado, Alcatra, Coxão Mole, Picanha, Costela, Linguiça Toscana Perdigão, Paleta Suína, Salsicha Sadia, Hambúrguer Seara
- Padaria: Pão Francês, Pão de Forma Wickbold, Pão Hot Dog, Bolo Bauducco, Biscoito (Maizena Estrela/Oreo/Wafer/Cream Cracker), Croissant, Granola Nesfit
- Água: Minalba 1,5L, Cristal 500ml, Bonafont 1,5L, Tônica Schweppes, Perrier, Água de Coco Green Coco
- Sucos: Del Valle (Uva/Laranja), Sufresh Pêssego, AdeS Laranja, Kapo Morango, Do Bem Laranja

REGRAS DE ANÁLISE:
1. Priorize produtos com margem > 25% e competitividade > 0.70
2. Considere sazonalidade: Cervejas/Açougue lideram Sex/Sáb, Laticínios/Padaria dominam Seg/Dom
3. Produtos repetidos (isRepeated=true) têm penalidade de -5 pontos no score
4. Produtos com anúncio ativo da concorrência (hasAd=true) têm bônus de tráfego
5. Compare sempre com Prixsia (media de mercado) — preço acima da média reduz competitividade

Responda sempre em português brasileiro, de forma clara, objetiva e com dados quando possível. Use listas e formatação markdown para facilitar a leitura.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erro no serviço de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
