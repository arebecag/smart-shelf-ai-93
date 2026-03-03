import { useState, useEffect, useRef } from 'react';
import { useApprovals } from '@/contexts/ApprovalsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tv,
  Maximize,
  Minimize,
  Printer,
  CheckCircle2,
  XCircle,
  Calendar,
} from 'lucide-react';
import logoCondor from '@/assets/logo-condor.png';
import { mockProducts } from '@/data/mockData';

// Colunas de lojas/regiões da planilha
const STORES = [
  { id: 'ctba', label: 'Curitiba' },
  { id: 'matr', label: 'Matr.' },
  { id: 'pge',  label: 'P. Grossa' },
  { id: 'cast', label: 'Castro' },
  { id: 'lapa', label: 'Lapa' },
  { id: 'irati', label: 'Irati' },
];

// Gera dados de custo/preço por loja a partir do produto
function storeData(price: number, margin: number, idx: number) {
  const variation = (idx % 3 === 0 ? -0.05 : idx % 3 === 1 ? 0 : 0.04);
  const p = +(price * (1 + variation)).toFixed(2);
  const cost = +(p * (1 - margin)).toFixed(2);
  const m = +((p - cost) / p * 100).toFixed(2);
  return { cost, price: p, margin: m };
}

export default function TVPresentation() {
  const { approvals } = useApprovals();
  const approvedItems = approvals.filter(a => a.status === 'approved');
  // fallback: use all mock products if nothing approved
  const products = approvedItems.length > 0
    ? approvedItems.map(a => a.product)
    : mockProducts;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handlePrint = () => window.print();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <Tv className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Nenhum produto aprovado</h2>
        <p className="text-muted-foreground">Aprove produtos no Dashboard para visualizá-los aqui.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-black ${isFullscreen ? 'fixed inset-0 z-50 overflow-auto' : ''}`}>
      {/* Toolbar - oculto no print */}
      <div className="print:hidden flex items-center justify-between px-6 py-3 border-b bg-card">
        <div className="flex items-center gap-3">
          <img src={logoCondor} alt="Condor" className="h-10 object-contain" />
          <div>
            <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Tv className="w-5 h-5 text-primary" /> Planilha de Aprovação
            </h1>
            <p className="text-xs text-muted-foreground">Ricardo &amp; Cris</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" /> Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Conteúdo da planilha */}
      <div ref={tableRef} className="p-6 print:p-4">

        {/* Cabeçalho do documento */}
        <div className="mb-4 text-center">
          <p className="font-bold text-base uppercase tracking-wide">CONDOR SUPER CENTER LTDA.</p>
          <div className="flex justify-center gap-8 text-sm mt-1">
            <span>Campanha: <strong>104988</strong></span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {today}
            </span>
          </div>
          <p className="text-sm font-semibold mt-1 uppercase">
            OFERTA RÁDIO E TV — CURITIBA, PONTA GROSSA E CASTRO
          </p>
        </div>

        {/* Legenda de status */}
        {approvedItems.length > 0 && (
          <div className="print:hidden flex gap-3 mb-3 text-xs">
            <span className="flex items-center gap-1 text-green-700 font-medium">
              <CheckCircle2 className="w-3 h-3" /> Aprovado
            </span>
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <XCircle className="w-3 h-3" /> Reprovado
            </span>
          </div>
        )}

        {/* Tabela principal */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px] leading-tight">
            <thead>
              {/* Linha de grupo de lojas */}
              <tr className="bg-gray-800 text-white">
                <th className="border border-gray-600 px-2 py-1 text-left w-8" rowSpan={2}>OK</th>
                <th className="border border-gray-600 px-2 py-1 text-left w-12" rowSpan={2}>Cód.</th>
                <th className="border border-gray-600 px-2 py-1 text-left" rowSpan={2} style={{ minWidth: 200 }}>Descrição</th>
                {STORES.map(s => (
                  <th key={s.id} className="border border-gray-600 px-1 py-1 text-center" colSpan={3}>
                    {s.label}
                  </th>
                ))}
                <th className="border border-gray-600 px-1 py-1 text-center" rowSpan={2}>Prixsia<br/>Mín</th>
                <th className="border border-gray-600 px-1 py-1 text-center" rowSpan={2}>Prixsia<br/>Méd</th>
                <th className="border border-gray-600 px-1 py-1 text-center" rowSpan={2}>Nielsen<br/>Share%</th>
                <th className="border border-gray-600 px-1 py-1 text-center" rowSpan={2}>Score<br/>IA</th>
              </tr>
              <tr className="bg-gray-700 text-white">
                {STORES.map(s => (
                  <>
                    <th key={`${s.id}-c`} className="border border-gray-600 px-1 py-1 text-center w-14">Custo</th>
                    <th key={`${s.id}-p`} className="border border-gray-600 px-1 py-1 text-center w-14">Preço</th>
                    <th key={`${s.id}-m`} className="border border-gray-600 px-1 py-1 text-center w-12">Marg%</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, rowIdx) => {
                const approvalItem = approvedItems.find(a => a.product.id === product.id);
                const isApproved = approvalItem?.status === 'approved';
                const rowBg = rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50';
                const score = Math.round(
                  product.margin * 40 +
                  product.competitiveness * 30 +
                  product.growth * 20 +
                  (product.sales / 3200) * 10
                );

                return (
                  <tr key={product.id} className={`${rowBg} hover:bg-yellow-50 transition-colors`}>
                    {/* OK */}
                    <td className="border border-gray-300 px-2 py-1.5 text-center">
                      {approvedItems.length > 0 ? (
                        isApproved
                          ? <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                          : <XCircle className="w-4 h-4 text-red-500 mx-auto" />
                      ) : (
                        <span className="w-4 h-4 block border border-gray-400 rounded mx-auto" />
                      )}
                    </td>

                    {/* Código */}
                    <td className="border border-gray-300 px-2 py-1.5 font-mono text-gray-600">
                      {product.id}
                    </td>

                    {/* Descrição com imagem */}
                    <td className="border border-gray-300 px-2 py-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-8 h-8 object-contain flex-shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <span className="font-medium uppercase text-[10px] leading-tight">
                          {product.name}
                        </span>
                        {product.hasAd && (
                          <Badge className="text-[9px] px-1 py-0 h-4 bg-blue-100 text-blue-700 border-blue-300">
                            Anúncio
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Dados por loja */}
                    {STORES.map((s, i) => {
                      const d = storeData(product.price, product.margin, i);
                      const isAboveAvg = d.price > product.prixsia.avgPrice;
                      return (
                        <>
                          <td key={`${s.id}-cost`} className="border border-gray-300 px-1 py-1.5 text-right text-gray-600">
                            {d.cost.toFixed(2)}
                          </td>
                          <td
                            key={`${s.id}-price`}
                            className={`border border-gray-300 px-1 py-1.5 text-right font-semibold ${
                              isAboveAvg ? 'text-red-600' : 'text-green-700'
                            }`}
                          >
                            {d.price.toFixed(2)}
                          </td>
                          <td key={`${s.id}-margin`} className="border border-gray-300 px-1 py-1.5 text-right text-gray-500">
                            {d.margin.toFixed(2)}%
                          </td>
                        </>
                      );
                    })}

                    {/* Prixsia mín */}
                    <td className="border border-gray-300 px-1 py-1.5 text-right text-green-700 font-medium">
                      {product.prixsia.minPrice.toFixed(2)}
                    </td>

                    {/* Prixsia méd */}
                    <td className="border border-gray-300 px-1 py-1.5 text-right text-blue-700 font-medium">
                      {product.prixsia.avgPrice.toFixed(2)}
                    </td>

                    {/* Nielsen share */}
                    <td className="border border-gray-300 px-1 py-1.5 text-center font-medium">
                      {product.nielsen.marketShare}%
                    </td>

                    {/* Score IA */}
                    <td className="border border-gray-300 px-1 py-1.5 text-center">
                      <span className={`font-bold ${
                        score >= 70 ? 'text-green-700' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {score}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totais */}
            <tfoot>
              <tr className="bg-gray-100 font-semibold text-[11px]">
                <td className="border border-gray-400 px-2 py-2 text-center" colSpan={3}>
                  TOTAIS / MÉDIAS
                </td>
                {STORES.map((s) => {
                  const avgCost = +(products.reduce((acc, p) => acc + storeData(p.price, p.margin, 0).cost, 0) / products.length).toFixed(2);
                  const avgPrice = +(products.reduce((acc, p) => acc + storeData(p.price, p.margin, 0).price, 0) / products.length).toFixed(2);
                  const avgMargin = +(products.reduce((acc, p) => acc + storeData(p.price, p.margin, 0).margin, 0) / products.length).toFixed(2);
                  return (
                    <>
                      <td key={`tot-${s.id}-c`} className="border border-gray-400 px-1 py-2 text-right">{avgCost}</td>
                      <td key={`tot-${s.id}-p`} className="border border-gray-400 px-1 py-2 text-right">{avgPrice}</td>
                      <td key={`tot-${s.id}-m`} className="border border-gray-400 px-1 py-2 text-right">{avgMargin}%</td>
                    </>
                  );
                })}
                <td className="border border-gray-400 px-1 py-2 text-right text-green-700">
                  {(products.reduce((a, p) => a + p.prixsia.minPrice, 0) / products.length).toFixed(2)}
                </td>
                <td className="border border-gray-400 px-1 py-2 text-right text-blue-700">
                  {(products.reduce((a, p) => a + p.prixsia.avgPrice, 0) / products.length).toFixed(2)}
                </td>
                <td className="border border-gray-400 px-1 py-2 text-center">
                  {(products.reduce((a, p) => a + p.nielsen.marketShare, 0) / products.length).toFixed(1)}%
                </td>
                <td className="border border-gray-400 px-1 py-2 text-center font-bold text-green-700">
                  {Math.round(products.reduce((acc, p) => {
                    return acc + Math.round(p.margin * 40 + p.competitiveness * 30 + p.growth * 20 + (p.sales / 3200) * 10);
                  }, 0) / products.length)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Assinatura */}
        <div className="mt-8 grid grid-cols-3 gap-8 text-center text-sm print:mt-16">
          {['Comprador', 'Gerente', 'Diretor'].map(role => (
            <div key={role}>
              <div className="border-t border-gray-400 pt-2 mt-8">
                <p className="font-medium">{role}</p>
                <p className="text-gray-500 text-xs">Assinatura e carimbo</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="mt-6 text-center text-[10px] text-gray-400 print:mt-4">
          <p>Documento gerado automaticamente pelo Sistema de Sugestão Inteligente — Rede Condor</p>
          <p className="mt-0.5">Preços em vermelho indicam acima da média de mercado (Prixsia). Score IA: ≥70 verde, 50-69 amarelo, &lt;50 vermelho.</p>
        </div>
      </div>

      {/* CSS para impressão */}
      <style>{`
        @media print {
          body { font-size: 10px; }
          .print\\:hidden { display: none !important; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
